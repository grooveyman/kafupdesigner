import { useNavigate, useParams } from "react-router-dom";
import { ArchiveX, FolderOpen } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import Spinner from "../../../components/Spinner";
import { useApiQuery } from "../../../hooks/useApi";
import "../profile.css";
import "../../../assets/css/addproduct.css";

interface CollectionDesign {
    id: string;
    name: string;
    description?: string;
    previewimg?: string | null;
    price?: number | string;
    quantity?: number;
    status?: string;
}

interface CollectionDetail {
    id: string;
    name: string;
    description?: string;
    image?: string | null;
    designs: CollectionDesign[];
}

const CollectionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useApiQuery<CollectionDetail>(
        ["collection", id ?? ""],
        `/designer/collection/${id}`
    );

    const designs = data?.designs ?? [];

    return (
        <div className="kf-profile">
            <div className="container" style={{ marginTop: "1.5rem" }}>
                <div className="mb-3">
                    <Breadcrumb
                        crumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Collections", href: "/collections" },
                            { label: data?.name ?? "Collection" },
                        ]}
                    />
                </div>

                <div className="kf-card">
                    {isLoading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner />
                        </div>
                    ) : !data ? (
                        <div className="kf-empty">
                            <FolderOpen size={32} className="mb-2" />
                            <p className="mb-0">Collection not found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="kf-content__header">
                                <div>
                                    <h5 className="kf-content__title mb-1">{data.name}</h5>
                                    {data.description ? (
                                        <p className="kf-content__subtitle">{data.description}</p>
                                    ) : null}
                                    <span className="kf-review-label">
                                        {designs.length} design{designs.length === 1 ? "" : "s"}
                                    </span>
                                </div>
                            </div>

                            {designs.length ? (
                                <div className="kf-grid">
                                    {designs.map((d) => (
                                        <div
                                            className="kf-design kf-design--clickable"
                                            key={d.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => navigate(`/editdesigns/${d.id}`)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    navigate(`/editdesigns/${d.id}`);
                                                }
                                            }}
                                        >
                                            <div className="kf-design__media">
                                                {d.previewimg ? (
                                                    <img src={d.previewimg} alt={d.name} />
                                                ) : (
                                                    <div className="kf-design__placeholder">
                                                        <FolderOpen size={28} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="kf-design__body">
                                                <p className="kf-design__name mb-1">{d.name}</p>
                                                <div className="kf-design__meta">
                                                    <span className="kf-design__cat">
                                                        Qty: {d.quantity ?? 0}
                                                    </span>
                                                    <span className="kf-design__price">
                                                        {d.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="kf-empty">
                                    <ArchiveX size={32} className="mb-2" />
                                    <p className="mb-0">No designs in this collection yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionDetails;
