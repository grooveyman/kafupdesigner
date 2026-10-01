import { useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useDesignContext } from "../../context/ProductContext";
import { Variation } from "../../context/ProductContext";
import "../../assets/css/addproduct.css";
import VariantModal from "./VariantModal";

// utility (outside component)
const isDarkColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
};

const DesignDetails: React.FC = () => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const { design, addToDesign, removeVariant } = useDesignContext();

  const [variantForm, setVariantForm] = useState<Variation>({
    size: "",
    quantity: 1,
    gender: "",
    color: "#000000",
    bust: "",
    hip: "",
    waist: "",
    neck: "",
    sleeve: "",
    sizetype: ""
  });

  // 🔹 update name / description
  const handleDesignChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      addToDesign({ [name]: value } as any);
    },
    [addToDesign]
  );

  // 🔹 add variation
  const addVariation = () => {
    if (!variantForm.size || variantForm.quantity < 1) {
      toast.error("Please provide valid size and quantity");
      return;
    }

    addToDesign({
      variations: [...design.variations, variantForm],
    });

    setVariantForm({
      size: "",
      quantity: 1,
      color: "#000000",
      bust: "",
      hip: "",
      waist: "",
      neck: "",
      sleeve: "",
      gender: "",
      sizetype: ""
    });
  };

  return (
    <>
      <div className="p-3">
        <div className="row g-3">
          {/* NAME */}
          <div className="col-md-6">
            <label className="form-label">Design Name</label>
            <input
              className="form-control"
              name="name"
              value={design.name}
              onChange={handleDesignChange}
            />
          </div>

          {/* PRICE */}
          <div className="col-md-6">
            <label className="form-label">Price</label>
            <input
              className="form-control"
              type="number"
              name="price"
              value={design.price}
              onChange={handleDesignChange}
            />
          </div>
        </div>

        <div className="row g-3 mt-1">
          {/* DESCRIPTION */}
          <div className="col-md-6">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={6}
              name="description"
              value={design.description}
              onChange={handleDesignChange}
              style={{ resize: "none" }}
            />
          </div>

          {/* VARIANTS */}
          <div className="col-md-6">
            <label className="form-label">Variants (Size : Quantity)</label>
            <div className="d-flex gap-2 flex-wrap">
              {design.variations.map((v, i) => (
                <button
                  key={i}
                  className="btn"
                  style={{
                    backgroundColor: v.color,
                    color: isDarkColor(v.color) ? "#fff" : "#000",
                  }}
                  onDoubleClick={() => removeVariant(i)}
                  type="button"
                >
                  {v.size}:{v.quantity}
                </button>
              ))}

              <button
                className="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#sizeModal"
                type="button"
              >
                + Add Variant
              </button>
            </div>
            {design.variations.length > 0 && (
              <small className="kf-variant-help d-block mt-2">
                Double-click a variant to remove it.
              </small>
            )}

            <label className="kf-sales-toggle mt-4">
              <input
                className="kf-sales-toggle__input"
                type="checkbox"
                role="switch"
                checked={design.sell === "1"}
                onChange={(event) =>
                  addToDesign({ sell: event.target.checked ? "1" : "0" })
                }
              />
              <span className="kf-sales-toggle__track" aria-hidden="true">
                <span className="kf-sales-toggle__thumb" />
              </span>
              <span className="kf-sales-toggle__copy">
                <span className="kf-sales-toggle__title">Sell this design?</span>
                <span className="kf-sales-toggle__description">
                  {design.sell === "1"
                    ? "Available for sale on Kafup"
                    : "Keep this design off your shop"}
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* COLOR PICKER */}
        <input
          type="color"
          ref={colorInputRef}
          value={variantForm.color}
          onChange={(e) =>
            setVariantForm((p) => ({ ...p, color: e.target.value }))
          }
          hidden
        />

        {/* MODAL */}
        <VariantModal
          variantForm={variantForm}
          setVariantForm={setVariantForm}
          onSave={addVariation}
          colorInputRef={colorInputRef}
        />
      </div>
    </>
  );
};

export default DesignDetails;
