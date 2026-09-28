import { z } from "zod";
import type { ProductType } from "../../context/ProductContext";

export type StepKey = "categories" | "productdetails" | "images" | "review";

export const STEPS: { key: StepKey; label: string }[] = [
  { key: "categories", label: "Categories" },
  { key: "productdetails", label: "Product Details" },
  { key: "images", label: "Images" },
  { key: "review", label: "Review" },
];

const variationSchema = z.object({
  color: z.string().trim().min(1, "Each variant needs a color"),
  size: z.string().trim().min(1, "Each variant needs a size"),
  quantity: z.coerce.number().min(1, "Variant quantity must be at least 1"),
});

// Per-step schemas — only what that step is responsible for.
const categoriesSchema = z.object({
  cat_code: z.string().trim().min(1, "Please select a category"),
});

const detailsSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  variations: z.array(variationSchema).min(1, "Add at least one variant"),
});

const imagesSchema = z.object({
  previewimg: z.custom<string | File>(
    (v) => v instanceof File || (typeof v === "string" && v.length > 0),
    "A preview image is required"
  ),
});

/** Validate a single wizard step. Returns a list of human-readable errors ([] = valid). */
export function validateStep(step: StepKey, product: ProductType): string[] {
  let result:
    | ReturnType<typeof categoriesSchema.safeParse>
    | ReturnType<typeof detailsSchema.safeParse>
    | ReturnType<typeof imagesSchema.safeParse>;

  switch (step) {
    case "categories":
      result = categoriesSchema.safeParse(product);
      break;
    case "productdetails":
      result = detailsSchema.safeParse(product);
      break;
    case "images":
      result = imagesSchema.safeParse(product);
      break;
    default:
      return [];
  }

  return result.success ? [] : result.error.issues.map((i) => i.message);
}

/** Validate the whole product before final submit. */
export function validateProduct(product: ProductType): string[] {
  return [
    ...validateStep("categories", product),
    ...validateStep("productdetails", product),
    ...validateStep("images", product),
  ];
}

/**
 * Build the variations array in the exact shape the backend VariationDto expects.
 * Accepts both the flat add-flow shape and the nested { dimension } edit-flow shape.
 */
export function buildVariationsPayload(variations: any[]): Record<string, unknown>[] {
  return (variations ?? []).map((v) => {
    const dim = v?.dimension ?? {};
    return {
      color: v?.color ?? "",
      size: v?.size ?? "",
      quantity: Number(v?.quantity) || 0,
      bust: v?.bust ?? dim.bust ?? "",
      hip: v?.hip ?? dim.hip ?? "",
      sleeve: v?.sleeve ?? dim.sleeve ?? "",
      neck: v?.neck ?? dim.neck ?? "",
      gender: v?.gender ?? dim.gender ?? "",
      waist: v?.waist ?? dim.waist ?? "",
      sizeType: v?.sizeType ?? dim.type ?? "custom",
    };
  });
}
