import { CopyPlus } from "lucide-react";
import { useProductContext } from "../../context/ProductContext";

const EXTRA_IMAGE_SLOTS = 3;

const AddImages: React.FC = () => {
  const { product, addToProduct } = useProductContext();

  /* Main image */
  const handleMainImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addToProduct({ previewimg: file });
  };

  /* Extra images */
  const handleExtraImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const images = [...product.otherimages];

    images[index] = { url: file };

    addToProduct({ otherimages: images });
  };

  return (
    <div className="row">
      {/* Main Image */}
      <div className="col-md-6">
        <label htmlFor="main-upload" className="addcube">
          {product.previewimg ? (
            <img
              src={
                typeof product.previewimg === "string"
                  ? product.previewimg
                  : URL.createObjectURL(product.previewimg)
              }
              className="img-fluid"
              alt="Main preview"
            />
          ) : (
            <div>
              <CopyPlus /> Add Image
            </div>
          )}
        </label>

        <input
          id="main-upload"
          type="file"
          accept="image/*"
          hidden
          onChange={handleMainImageChange}
        />
      </div>

      {/* Extra Images */}
      <div className="col-md-6">
        <div className="row g-2">
          {Array.from({ length: EXTRA_IMAGE_SLOTS }).map((_, index) => {
            const img = product.otherimages[index];

            return (
              <div className="col-4" key={index}>
                <label
                  htmlFor={`extra-upload-${index}`}
                  className="extra-image-box"
                >
                  {img?.url ? (
                    <img
                      src={
                        typeof img.url === "string"
                          ? img.url
                          : URL.createObjectURL(img.url)
                      }
                      className="img-fluid"
                      alt={`Extra ${index}`}
                    />
                  ) : (
                    <div className="extra-image-placeholder">
                      <CopyPlus size={18} />
                      <small>Add</small>
                    </div>
                  )}
                </label>

                <input
                  id={`extra-upload-${index}`}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleExtraImageChange(index, e)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddImages;
