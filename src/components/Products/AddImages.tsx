import { CopyPlus } from "lucide-react";
import { useDesignContext } from "../../context/ProductContext";

const EXTRA_IMAGE_SLOTS = 3;

const AddImages: React.FC = () => {
  const { design, addToDesign } = useDesignContext();

  console.log(design);

  /* Main image */
  const handleMainImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addToDesign({ previewimg: file });
  };

  /* Extra images */
  const handleExtraImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const images = [...design.otherimages];

    images[index] = { url: file };

    addToDesign({ otherimages: images });
  };

  return (
    <div className="row">
      {/* Main Image */}
      <div className="col-md-6">
        <label htmlFor="main-upload" className="addcube">
          {design.previewimg ? (
            <img
              src={
                typeof design.previewimg === "string"
                  ? design.previewimg
                  : URL.createObjectURL(design.previewimg)
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
            const img = design.otherimages[index];

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
