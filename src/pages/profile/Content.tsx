import { ImageOff } from "lucide-react";
import type { ProfileDesignType } from "../../types/types";

interface ContentProps {
    designs: ProfileDesignType[];
    loading?: boolean;
}

const formatPrice = (price: number) => {
    const value = Number(price);
    if (!value || Number.isNaN(value)) return "—";
    return `GHS ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Content: React.FC<ContentProps> = ({ designs, loading }) => {
    return (
        <div className="kf-card">
            <div className="kf-content__header">
                <div>
                    <h5 className="kf-content__title">Designs</h5>
                    <p className="kf-content__subtitle">
                        {loading ? "Loading your work…" : `${designs.length} design${designs.length === 1 ? "" : "s"} in your portfolio`}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="kf-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="kf-design">
                            <div className="kf-skeleton" style={{ aspectRatio: "1 / 1", borderRadius: 0 }} />
                            <div className="kf-design__body">
                                <div className="kf-skeleton" style={{ height: 14, width: "80%" }} />
                                <div className="kf-skeleton" style={{ height: 10, width: "50%", marginTop: 8 }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : designs.length === 0 ? (
                <div className="kf-empty">
                    <ImageOff size={34} />
                    <p className="mb-0">No designs yet. Your published work will appear here.</p>
                </div>
            ) : (
                <div className="kf-grid">
                    {designs.map((design) => (
                        <div key={design.id} className="kf-design">
                            <div className="kf-design__media">
                                {design.isSell === "1" && <span className="kf-badge">For sale</span>}
                                {design.previewimg ? (
                                    <img src={design.previewimg} alt={design.name} loading="lazy" />
                                ) : (
                                    <div className="kf-empty" style={{ border: 0, height: "100%" }}>
                                        <ImageOff size={28} />
                                    </div>
                                )}
                            </div>
                            <div className="kf-design__body">
                                <p className="kf-design__name" title={design.name}>{design.name}</p>
                                <div className="kf-design__meta">
                                    <span className="kf-design__cat">{design.categories?.name || "Uncategorised"}</span>
                                    <span className="kf-design__price">{formatPrice(design.price)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Content;
