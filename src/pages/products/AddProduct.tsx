import React, { useState } from "react";
import "./admin.css";
import { CheckCheckIcon, Image, ListChecks, NotebookPen, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Categories from "../../components/Products/Categories";
import "../../assets/css/addproduct.css";
import ProductDetails from "../../components/Products/ProductDetails";
import AddImages from "../../components/Products/AddImages";
import Review from "../../components/Products/Review";
import { useProductContext } from "../../context/ProductContext";
import ProductScrollNav from "../../components/Products/ProductScrollNav";
import Spinner from "../../components/Spinner";
import { STEPS, StepKey, buildVariationsPayload, validateStep, validateProduct } from "./productValidation";

export interface Variation {
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface OtherImage {
  url: string | File;
}

export interface FormDataType {
  name: string;
  description: string;
  price: number;
  variation: Variation[];
  previmage: string | File;
  otherimages: OtherImage[];
  category: string;
}

const TAB_ICONS: Record<StepKey, React.ReactNode> = {
  categories: <ListChecks className="mr-2 inline-block" size={18} />,
  productdetails: <NotebookPen className="mr-2 inline-block" size={18} />,
  images: <Image className="mr-2 inline-block" size={18} />,
  review: <CheckCheckIcon className="mr-2 inline-block" size={18} />,
};

const AddProducts: React.FC = () => {
  const { product } = useProductContext();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = STEPS[stepIndex].key;
  const isLastStep = stepIndex === STEPS.length - 1;

  const mutation = useApiMutation<{ message: string }>("/designer/designs", "POST", {
    onSuccess: (data) => {
      toast.success(data.message ?? "Product created successfully");
      navigate("/products");
    },
    onError: (error) => toast.error(error.message),
  });

  const goNext = () => {
    const errors = validateStep(currentStep, product);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0));

  // Free to jump backwards; jumping forward requires the steps in between to be valid.
  const goToStep = (index: number) => {
    if (index <= stepIndex) {
      setStepIndex(index);
      return;
    }
    for (let s = stepIndex; s < index; s++) {
      const errs = validateStep(STEPS[s].key, product);
      if (errs.length) {
        toast.error(errs[0]);
        setStepIndex(s);
        return;
      }
    }
    setStepIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateProduct(product);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description ?? "");
    formData.append("catcode", product.category?.id ?? product.cat_code ?? "");
    formData.append("price", String(product.price));
    formData.append("sell", (product as any).sell ?? "0");

    const collectioncode = (product as any).collection_code ?? "";
    if (collectioncode) formData.append("collectioncode", collectioncode);

    // variations must reach the backend as a JSON array of objects (parsed server-side).
    formData.append("variations", JSON.stringify(buildVariationsPayload(product.variations)));

    if (product.previewimg instanceof File) {
      formData.append("previewimg", product.previewimg);
    }
    product.otherimages.forEach((img) => {
      if (img.url instanceof File) formData.append("otherimages", img.url);
    });

    mutation.mutate(formData);
  };

  return (
    <>
      <ProductScrollNav prodname={product.name} prodamount={product.price} />
      <div className="container kf-wizard">
        <form className="w-100" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mt-4">
            <div>
              <Breadcrumb
                crumbs={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Product List", href: "/products" },
                  { label: "Add Product", href: "/addproducts" },
                ]}
              />
            </div>
          </div>

          {/* Step tabs */}
          <div className="card kf-wizard__tabs">
            {STEPS.map((s, i) => (
              <button
                type="button"
                key={s.key}
                className={`kf-wizard__tab ${currentStep === s.key ? "is-active" : ""} ${i < stepIndex ? "is-done" : ""}`}
                onClick={() => goToStep(i)}
              >
                <span className="kf-wizard__tab-index">{i + 1}</span>
                {TAB_ICONS[s.key]}
                <span className="kf-wizard__tab-label">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Step body */}
          <div className="card kf-wizard__body mt-4">
            {currentStep === "categories" && <Categories />}
            {currentStep === "productdetails" && <ProductDetails />}
            {currentStep === "images" && <AddImages />}
            {currentStep === "review" && <Review />}
          </div>

          {/* Step navigation */}
          <div className="kf-wizard__nav">
            <button
              type="button"
              className="btn kf-wizard__btn kf-wizard__btn--ghost"
              onClick={goPrev}
              disabled={stepIndex === 0}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span className="kf-wizard__progress">
              Step {stepIndex + 1} of {STEPS.length}
            </span>

            {isLastStep ? (
              <button type="submit" className="btn btn-secondary kf-wizard__btn" disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner color="secondary" size="sm" /> : <CheckCheckIcon size={16} />} Submit
              </button>
            ) : (
              <button type="button" className="btn btn-secondary kf-wizard__btn" onClick={goNext}>
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProducts;
