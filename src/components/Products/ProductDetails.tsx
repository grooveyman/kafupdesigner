import { useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useProductContext } from "../../context/ProductContext";
import { Variation } from "../../context/ProductContext";
import "../../assets/css/addproduct.css";
import DressWithMeasurements from "./VariantModal";
import VariantModal from "./VariantModal";

// utility (outside component)
const isDarkColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
};

const ProductDetails: React.FC = () => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const { product, addToProduct, removeVariant } = useProductContext();

  const [variantForm, setVariantForm] = useState<Variation>({
    size: "",
    quantity: 1,
    price: 0,
    gender: "",
    color: "#000000",
    bust:"",
      hip:"",
      waist:"",
      neck:"",
      sleeve:""
  });

  // 🔹 update name / description
  const handleProductChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      addToProduct({ [name]: value } as any);
    },
    [addToProduct]
  );

  // 🔹 update variant form
  const handleVariantChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  // 🔹 add variation
  const addVariation = () => {
    if (!variantForm.size || variantForm.quantity < 1) {
      toast.error("Please provide valid size and quantity");
      return;
    }

    addToProduct({
      variations: [...product.variations, variantForm],
    });

    setVariantForm({
      size: "",
      quantity: 1,
      price: 0,
      color: "#000000",
      bust:"",
      hip:"",
      waist:"",
      neck:"",
      sleeve:"",
      gender:""
    });
  };

  return (
    <>
    <div className="row">
      
    </div>
      <div className="row p-3">
        {/* NAME */}
        <div className="col-md-6">
          <label>Product Name</label>
          <input
            className="form-control mt-2"
            name="name"
            value={product.name}
            onChange={handleProductChange}
          />
        </div>

        {/* PRICE */}
        <div className="col-md-6">
          <label>Price</label>
          <input
            className="form-control mt-2"
            type="number"
            name="price"
            value={product.price}
            onChange={handleProductChange}
          />
        </div>
      </div>

      <div className="row">
        {/* VARIANTS */}
        <div className="col-md-6 mt-3">
          <label>Variants (Size : Quantity)</label>
          <div className="d-flex gap-2 flex-wrap mt-2">
            {product.variations.map((v, i) => (
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
        </div>

        {/* DESCRIPTION */}
        <div className="col-md-6 mt-3">
          <label>Description</label>
          <textarea
            className="form-control mt-2"
            rows={6}
            name="description"
            value={product.description}
            onChange={handleProductChange}
            style={{ resize: "none" }}
          />
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

export default ProductDetails;
