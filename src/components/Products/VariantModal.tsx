import React, { useEffect, useMemo, useState } from "react";
import { Variation } from "../../context/ProductContext";
import { useApiQuery } from "../../hooks/useApi";
import Spinner from "../Spinner";

interface VariantModalProps {
  variantForm: Variation;
  setVariantForm: React.Dispatch<React.SetStateAction<Variation>>;
  onSave: () => void;
  colorInputRef: React.RefObject<HTMLInputElement | null>;
}

interface DimensionDetailType {
  bust: string;
  chest: string;
  hip: string;
  neck: string;
  sleeve: string;
  waist: string;
  sizeNo: string;
}

interface DimensionType {
  type: string;
  size: string;
  unit?: string;
  alias: string;
  gender: string;
  dimensiondetail: DimensionDetailType[];
  id: string;
}

type FieldErrors = Partial<Record<string, string>>;

const VariantModal: React.FC<VariantModalProps> = ({
  variantForm,
  setVariantForm,
  onSave,
  colorInputRef,
}) => {
  /* ---------------- STATE ---------------- */
  const [errors, setErrors] = useState<FieldErrors>({});

  /* ---------------- HELPERS ---------------- */
  const sanitizeInput = (value: string) =>
    value.replace(/[^0-9/-]/g, "");

  const isValidInput = (value: string) =>
    /^[0-9/-]*$/.test(value);

  const measurementFields = ["bust", "waist", "hip", "neck", "sleeve"];

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (measurementFields.includes(name)) {
      if (!isValidInput(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only numbers, / and - are allowed",
        }));
        return;
      } else {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
        finalValue = sanitizeInput(value);
      }
    }

    setVariantForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price"
          ? Number(finalValue)
          : finalValue,
    }));
  };

  /* ---------------- DATA ---------------- */


  const hasErrors = Object.keys(errors).length > 0;

  /* ---------------- UI ---------------- */
  return (
    <div className="modal fade" id="sizeModal">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-body">
            <div className="row text-white p-3">
              Add Variant
            </div>

            <div className="row">
              {/* LEFT */}
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Size"
                  name="size"
                  value={variantForm.size}
                  onChange={handleChange}
                />

                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  name="quantity"
                  value={variantForm.quantity}
                  onChange={handleChange}
                />
                <div className="mb-3">
                  <label>Gender</label>
                <select name="gender" className="form-select" value={variantForm.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                </div>
                
               

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => colorInputRef.current?.click()}
                >
                  Pick Color
                </button>
              </div>

              {/* RIGHT DIMENSIONS */}
              <div className="col-md-6">
                <p className="text-white">Add Dimensions</p>

                  <>
                    {/* Bust / Chest */}
                    <div className="row">
                      <div className="col-md-6">
                        <label>Bust / Chest</label>
                        <input
                          className={`form-control mb-2 ${errors.bust ? "is-invalid" : ""
                            }`}
                          name="bust"
                          placeholder=""
                          onChange={handleChange}
                        />
                        {errors.bust && (
                          <div className="invalid-feedback">
                            {errors.bust}
                          </div>
                        )}


                      </div>
                      <div className="col-md-6">
                        {/* Waist */}
                        <label>Waist</label>
                        <input
                          className={`form-control mb-2 ${errors.waist ? "is-invalid" : ""
                            }`}
                          name="waist"
                          placeholder=""
                          onChange={handleChange}
                        />
                        {errors.waist && (
                          <div className="invalid-feedback">
                            {errors.waist}
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Hip */}
                    <div className="row">
                      <div className="col-md-6">
                        <label>Hip</label>
                        <input
                          className={`form-control mb-2 ${errors.hip ? "is-invalid" : ""
                            }`}
                          name="hip"
                          placeholder=""
                          onChange={handleChange}
                        />
                        {errors.hip && (
                          <div className="invalid-feedback">
                            {errors.hip}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        {/* Neck */}
                        <label>Neck</label>
                        <input
                          className={`form-control mb-2 ${errors.neck ? "is-invalid" : ""
                            }`}
                          name="neck"
                          placeholder=""
                          onChange={handleChange}
                        />
                        {errors.neck && (
                          <div className="invalid-feedback">
                            {errors.neck}
                          </div>
                        )}
                      </div>
                    </div>




                    {/* Sleeve */}
                    <label>Sleeve</label>
                    <input
                      className={`form-control mb-2 ${errors.sleeve ? "is-invalid" : ""
                        }`}
                      name="sleeve"
                      placeholder=""
                      onChange={handleChange}
                    />
                    {errors.sleeve && (
                      <div className="invalid-feedback">
                        {errors.sleeve}
                      </div>
                    )}
                  </>
              
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary"
              type="button"
              onClick={onSave}
              disabled={hasErrors}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
