import { useDesignContext } from "../../context/ProductContext";
import namer from "color-namer";

export const hexToColorName = (hex: string): string => {
    const names = namer(hex);
    return names.basic[0].name;
};

const Review: React.FC = () => {
    const { design } = useDesignContext();

    const isDarkColor = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    };

    const srcOf = (val: string | File) =>
        typeof val === "string" ? val : URL.createObjectURL(val);

    return (
        <div className="container kf-review">
            {/* Category */}
            <section className="kf-review-section">
                <h6 className="kf-review-title">Category</h6>
                <div className="kf-review-value">{design.category?.name || "—"}</div>
            </section>

            {/* Details */}
            <section className="kf-review-section">
                <h6 className="kf-review-title">Design Details</h6>
                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <span className="kf-review-label">Name</span>
                        <div className="kf-review-value">{design.name || "—"}</div>
                    </div>
                    <div className="col-12 col-md-4">
                        <span className="kf-review-label">Price (GHS)</span>
                        <div className="kf-review-value">{design.price || "—"}</div>
                    </div>
                    <div className="col-12">
                        <span className="kf-review-label">Description</span>
                        <div className="kf-review-value">{design.description || "—"}</div>
                    </div>
                </div>
            </section>

            {/* Variations */}
            <section className="kf-review-section">
                <h6 className="kf-review-title">Variations</h6>
                {design.variations?.length ? (
                    <div className="table-responsive">
                        <table className="table text-nowrap kf-review-table">
                            <thead>
                                <tr>
                                    <th>Variant</th>
                                    <th>Gender</th>
                                    <th>Bust</th>
                                    <th>Waist</th>
                                    <th>Hip</th>
                                    <th>Neck</th>
                                    <th>Sleeve</th>
                                </tr>
                            </thead>
                            <tbody>
                                {design.variations.map((variation, i) => (
                                    <tr className="variation-tr" key={i}>
                                        <td>
                                            <span
                                                className="kf-review-chip"
                                                style={{
                                                    backgroundColor: variation.color,
                                                    color: isDarkColor(variation.color) ? "#fff" : "#000",
                                                }}
                                            >
                                                {hexToColorName(variation.color)} · {variation.size} · {variation.quantity}
                                            </span>
                                        </td>
                                        <td>{variation.gender || "—"}</td>
                                        <td>{variation.bust || "—"}</td>
                                        <td>{variation.waist || "—"}</td>
                                        <td>{variation.hip || "—"}</td>
                                        <td>{variation.neck || "—"}</td>
                                        <td>{variation.sleeve || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="kf-review-value">No variations added.</div>
                )}
            </section>

            {/* Images */}
            <section className="kf-review-section">
                <h6 className="kf-review-title">Images</h6>
                <div className="d-flex flex-wrap align-items-start gap-3">
                    {design.previewimg && (
                        <div>
                            <span className="kf-review-label">Preview</span>
                            <img
                                className="kf-review-preview"
                                src={srcOf(design.previewimg)}
                                alt="Design preview"
                            />
                        </div>
                    )}
                    {design.otherimages?.length > 0 && (
                        <div>
                            <span className="kf-review-label">Gallery</span>
                            <div className="d-flex flex-wrap gap-2">
                                {design.otherimages.map((img, i) => (
                                    <img
                                        key={i}
                                        className="kf-review-thumb"
                                        src={srcOf(img.url)}
                                        alt={`Design image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Review;
