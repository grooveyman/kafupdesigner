import React, { useState } from "react";
import { Variation } from "../../context/ProductContext";

interface VariantModalProps {
  variantForm: Variation;
  setVariantForm: React.Dispatch<React.SetStateAction<Variation>>;
  onSave: () => void;
  colorInputRef: React.RefObject<HTMLInputElement | null>;
}

type FieldErrors = Partial<Record<string, string>>;

const MEASUREMENTS: { name: string; label: string }[] = [
  { name: "bust", label: "Bust / Chest" },
  { name: "waist", label: "Waist" },
  { name: "hip", label: "Hip" },
  { name: "neck", label: "Neck" },
  { name: "sleeve", label: "Sleeve" },
];

const VariantModal: React.FC<VariantModalProps> = ({
  variantForm,
  setVariantForm,
  onSave,
  colorInputRef,
}) => {
  const [errors, setErrors] = useState<FieldErrors>({});

  const sanitizeInput = (value: string) => value.replace(/[^0-9/-]/g, "");
  const isValidInput = (value: string) => /^[0-9/-]*$/.test(value);
  const measurementNames = MEASUREMENTS.map((m) => m.name);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let finalValue: string = value;

    if (measurementNames.includes(name)) {
      if (!isValidInput(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only numbers, / and - are allowed",
        }));
        return;
      }
      setErrors((prev) => {
        const { [name]: _removed, ...rest } = prev;
        return rest;
      });
      finalValue = sanitizeInput(value);
    }

    setVariantForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price" ? Number(finalValue) : finalValue,
    }));
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="modal fade" id="sizeModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">Add Variant</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* --- Basics --- */}
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Size</label>
                <input
                  className="form-control"
                  placeholder="e.g. M or 12"
                  name="size"
                  value={variantForm.size}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  name="quantity"
                  value={variantForm.quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  value={variantForm.gender}
                  onChange={handleChange}
                >
                  <option value="">Select…</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* --- Color --- */}
            <div className="d-flex align-items-center gap-3 mt-4">
              <span
                className="kf-color-swatch"
                style={{ backgroundColor: variantForm.color }}
                aria-hidden="true"
              />
              <div>
                <label className="form-label d-block mb-1">Color</label>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={() => colorInputRef.current?.click()}
                  >
                    Pick color
                  </button>
                  <small className="kf-variant-help">{variantForm.color}</small>
                </div>
              </div>
            </div>

            <hr className="kf-variant-divider" />

            {/* --- Measurements --- */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-white mb-0">Measurements</h6>
              <small className="kf-variant-help">
                Optional · numbers, / and - only
              </small>
            </div>

            <div className="row g-3">
              {MEASUREMENTS.map(({ name, label }) => (
                <div className="col-md-4" key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                    name={name}
                    value={(variantForm as Record<string, any>)[name] ?? ""}
                    onChange={handleChange}
                  />
                  {errors[name] && (
                    <div className="invalid-feedback">{errors[name]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0">
            <button
              className="btn btn-outline-secondary"
              type="button"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={onSave}
              disabled={hasErrors}
            >
              Save variant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
