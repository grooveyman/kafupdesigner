import { useMemo, useState } from "react";
import { ImageOff, Search } from "lucide-react";
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
    const [search, setSearch] = useState("");
    const [collectionId, setCollectionId] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const collections = useMemo(() => {
        const map = new Map<string, string>();
        designs.forEach((d) => d.collection?.id && map.set(d.collection.id, d.collection.name));
        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [designs]);

    const categories = useMemo(() => {
        const map = new Map<string, string>();
        designs.forEach((d) => d.categories?.id && map.set(d.categories.id, d.categories.name));
        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [designs]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return designs.filter((d) => {
            if (collectionId && d.collection?.id !== collectionId) return false;
            if (categoryId && d.categories?.id !== categoryId) return false;
            if (q && !d.name?.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [designs, search, collectionId, categoryId]);

    return (
        <>
            {!loading && designs.length > 0 && (
                <div className="kf-filters">
                    <div className="kf-search">
                        <Search size={16} />
                        <input
                            type="search"
                            placeholder="Search designs…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search designs"
                        />
                    </div>
                    <select
                        className="kf-select"
                        value={collectionId}
                        onChange={(e) => setCollectionId(e.target.value)}
                        aria-label="Filter by collection"
                    >
                        <option value="">All collections</option>
                        {collections.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        className="kf-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        aria-label="Filter by category"
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="kf-card">
                <div className="kf-content__header">
                    <div>
                        <h5 className="kf-content__title">Designs</h5>
                        <p className="kf-content__subtitle">
                            {loading
                                ? "Loading your work…"
                                : `${filtered.length} of ${designs.length} design${designs.length === 1 ? "" : "s"}`}
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
                ) : filtered.length === 0 ? (
                    <div className="kf-empty">
                        <ImageOff size={34} />
                        <p className="mb-0">No designs match your filters.</p>
                    </div>
                ) : (
                    <div className="kf-grid">
                        {filtered.map((design) => (
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
        </>
    );
};

export default Content;
