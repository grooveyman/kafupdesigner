import React, { useEffect, useState } from "react";
import "./admin.css";
import { CheckCheckIcon, Image, ListChecks, NotebookPen, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Categories from "../../components/Products/Categories";
import "../../assets/css/addproduct.css";
import DesignDetails from "../../components/Products/ProductDetails";
import AddImages from "../../components/Products/AddImages";
import Review from "../../components/Products/Review";
import { useDesignContext } from "../../context/ProductContext";
import DesignScrollNav from "../../components/Products/ProductScrollNav";
import Spinner from "../../components/Spinner";
import { tokenService } from "../../context/tokenService";
import { STEPS, StepKey, buildVariationsPayload, validateStep, validateDesign } from "./productValidation";

const TAB_ICONS: Record<StepKey, React.ReactNode> = {
  categories: <ListChecks className="mr-2 inline-block" size={18} />,
  productdetails: <NotebookPen className="mr-2 inline-block" size={18} />,
  images: <Image className="mr-2 inline-block" size={18} />,
  review: <CheckCheckIcon className="mr-2 inline-block" size={18} />,
};

const EditDesign: React.FC = () => {
  const { prodid } = useParams();
  const designerCode = tokenService.getDesignerCode() ?? "";
  const navigate = useNavigate();

  const { data } = useApiQuery<any>(["editproduct_" + prodid], `/designer/designs/${prodid}`);
  const { design, addToDesign } = useDesignContext();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = STEPS[stepIndex].key;
  const isLastStep = stepIndex === STEPS.length - 1;

  // Map the backend design shape into the wizard's design draft.
  useEffect(() => {
    if (!data) return;
    addToDesign({
      name: data.name ?? "",
      description: data.description ?? "",
      price: Number(data.price) || 0,
      designer_code: designerCode,
      category: { id: data.categories?.id ?? "", name: data.categories?.name ?? "" },
      cat_code: data.categories?.id ?? "",
      previewimg: data.previewimg ?? "",
      otherimages: (data.designImages ?? []).map((img: any) => ({ url: img.imgurl, pid: img.public_id })),
      variations: (data.designvariations ?? []).map((dv: any) => ({
        color: dv.color ?? "#000000",
        size: dv.size ?? "",
        quantity: Number(dv.quantity) || 0,
        price: 0,
        bust: dv.dimension?.bust ?? "",
        hip: dv.dimension?.hip ?? "",
        waist: dv.dimension?.waist ?? "",
        neck: dv.dimension?.neck ?? "",
        sleeve: dv.dimension?.sleeve ?? "",
        gender: dv.dimension?.gender ?? "",
      })),
      ...(data.collection?.id ? { collection_code: data.collection.id } : {}),
    } as any);
  }, [data, addToDesign, designerCode]);

  const mutation = useApiMutation<{ message: string }>(`/designer/designs/${prodid}`, "PATCH", {
    onSuccess: (res) => {
      toast.success(res.message ?? "Design updated successfully");
      navigate("/designs");
    },
    onError: (error) => toast.error(error.message),
  });

  // WIZARD_HELPERS
  const goNext = () => {
    const errors = validateStep(currentStep, design);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0));

  const goToStep = (index: number) => {
    if (index <= stepIndex) {
      setStepIndex(index);
      return;
    }
    for (let s = stepIndex; s < index; s++) {
      const errs = validateStep(STEPS[s].key, design);
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

    const errors = validateDesign(design);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    const formData = new FormData();
    formData.append("name", design.name);
    formData.append("description", design.description ?? "");
    formData.append("catcode", design.category?.id ?? design.cat_code ?? "");
    formData.append("price", String(design.price));
    formData.append("sell", (design as any).sell ?? "0");

    const collectioncode = (design as any).collection_code ?? "";
    if (collectioncode) formData.append("collectioncode", collectioncode);

    formData.append("variations", JSON.stringify(buildVariationsPayload(design.variations)));

    if (design.previewimg instanceof File) {
      formData.append("previewimg", design.previewimg);
    }

    // Existing images are kept by their public id; new uploads are sent as files.
    const keepPublicIds: string[] = [];
    design.otherimages.forEach((img) => {
      if (img.url instanceof File) {
        formData.append("otherimages", img.url);
      } else if (img.pid) {
        keepPublicIds.push(img.pid);
      }
    });
    formData.append("delImgs", JSON.stringify(keepPublicIds));

    mutation.mutate(formData);
  };

  return (
    <>
      <DesignScrollNav prodname={design.name} prodamount={design.price} />
      <div className="container kf-wizard">
        <form className="w-100" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mt-4">
            <div>
              <Breadcrumb
                crumbs={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Design List", href: "/designs" },
                  { label: "Edit Design", href: "#" },
                ]}
              />
            </div>
          </div>

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

          <div className="card kf-wizard__body mt-4">
            {currentStep === "categories" && <Categories />}
            {currentStep === "productdetails" && <DesignDetails />}
            {currentStep === "images" && <AddImages />}
            {currentStep === "review" && <Review />}
          </div>

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
                {mutation.isPending ? <Spinner color="secondary" size="sm" /> : <CheckCheckIcon size={16} />} Save changes
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

export default EditDesign;
