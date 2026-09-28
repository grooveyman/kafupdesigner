import { useMemo, useRef, useState } from "react";
import { Plus, Search, Trash2, FolderOpen, Pencil, X } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../../components/Spinner";
import { useApiMutation, useApiQuery } from "../../../hooks/useApi";
import "../profile.css";
import "../../../assets/css/addproduct.css";

interface CollectionType {
    id: string;
    name: string;
    description?: string;
    image?: string | null;
    noOfProducts?: number;
}

const CollectionWrapper: React.FC = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ["collections"], []);
    const closeRef = useRef<HTMLButtonElement>(null);

    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState<CollectionType | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, isLoading } = useApiQuery<CollectionType[]>(queryKey, "/designer/collection");
    const collections = Array.isArray(data) ? data : [];

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return collections;
        return collections.filter((c) => c.name.toLowerCase().includes(q));
    }, [collections, search]);

    const resetForm = () => {
        setEditing(null);
        setName("");
        setDescription("");
        setImage(null);
        setPreview(null);
    };

    const openCreate = () => {
        resetForm();
    };

    const openEdit = (c: CollectionType) => {
        setEditing(c);
        setName(c.name);
        setDescription(c.description ?? "");
        setImage(null);
        setPreview(c.image ?? null);
    };

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImage(file);
        setPreview(file ? URL.createObjectURL(file) : editing?.image ?? null);
    };

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const createMutation = useApiMutation<{ message: string }>("/designer/collection", "POST", {
        onSuccess: (res) => {
            toast.success(res?.message || "Collection created");
            invalidate();
            closeRef.current?.click();
            resetForm();
        },
        onError: (err) => toast.error(err.message),
    });

    const updateMutation = useApiMutation<{ message: string }>("/designer/collection", "PATCH", {
        onSuccess: (res) => {
            toast.success(res?.message || "Collection updated");
            invalidate();
            closeRef.current?.click();
            resetForm();
        },
        onError: (err) => toast.error(err.message),
    });

    const saving = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Collection name is required");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("description", description.trim());
        if (image) formData.append("image", image);

        if (editing) {
            formData.append("id", editing.id);
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    const deleteMutation = useApiMutation<{ message: string }>("/designer/collection", "DELETE", {
        onSuccess: (res) => {
            toast.success(res?.message || "Collection deleted");
            invalidate();
        },
        onError: (err) => toast.error(err.message),
    });

    const handleDelete = (c: CollectionType) => {
        Swal.fire({
            title: "Delete collection?",
            text: `"${c.name}" will be removed. This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it",
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate({ id: c.id });
        });
    };

    return (
        <div className="kf-card">
            <div className="kf-content__header">
                <div>
                    <h5 className="mb-1">Collections</h5>
                    <p className="kf-variant-help mb-0">
                        Group your designs into themed collections with a cover image.
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-secondary d-inline-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#collectionModal"
                    onClick={openCreate}
                >
                    <Plus size={18} /> Add Collection
                </button>
            </div>

            <div className="kf-filters">
                <div className="kf-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search collections by name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner />
                </div>
            ) : filtered.length ? (
                <div className="kf-grid">
                    {filtered.map((c) => (
                        <div className="kf-design" key={c.id}>
                            <div className="kf-design__media">
                                {c.image ? (
                                    <img src={c.image} alt={c.name} />
                                ) : (
                                    <div className="kf-design__placeholder">
                                        <FolderOpen size={28} />
                                    </div>
                                )}
                                <div className="kf-media-actions">
                                    <button
                                        type="button"
                                        className="kf-cat-del kf-edit"
                                        aria-label={`Edit ${c.name}`}
                                        data-bs-toggle="modal"
                                        data-bs-target="#collectionModal"
                                        onClick={() => openEdit(c)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="kf-cat-del"
                                        aria-label={`Delete ${c.name}`}
                                        onClick={() => handleDelete(c)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="kf-design__body">
                                <p className="kf-design__name mb-1">{c.name}</p>
                                {c.description ? (
                                    <p className="kf-variant-help mb-2">
                                        {c.description.length > 60
                                            ? c.description.slice(0, 60) + "…"
                                            : c.description}
                                    </p>
                                ) : null}
                                <span className="kf-review-label">
                                    {c.noOfProducts ?? 0} design
                                    {(c.noOfProducts ?? 0) === 1 ? "" : "s"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kf-empty">
                    <FolderOpen size={32} className="mb-2" />
                    <p className="mb-0">
                        {collections.length === 0
                            ? "No collections yet. Create your first one."
                            : "No collections match your search."}
                    </p>
                </div>
            )}

            <div
                className="modal fade"
                id="collectionModal"
                tabIndex={-1}
                aria-labelledby="collectionModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered kf-variant-dialog">
                    <div className="modal-content">
                        <div className="modal-header border-0 align-items-center">
                            <h5 className="modal-title" id="collectionModalLabel">
                                {editing ? "Edit Collection" : "Add Collection"}
                            </h5>
                            <button
                                ref={closeRef}
                                type="button"
                                className="kf-modal-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={resetForm}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-5">
                                        <label className="form-label">Cover image</label>
                                        <label htmlFor="collectionImage" className="addcube">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="preview"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <span className="extra-image-placeholder">
                                                    Click to upload
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            id="collectionImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={onImageChange}
                                        />
                                    </div>
                                    <div className="col-md-7">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Summer 2026"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={5}
                                                placeholder="What is this collection about?"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="kf-variant-divider" />

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        data-bs-dismiss="modal"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-secondary"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving…"
                                            : editing
                                            ? "Update Collection"
                                            : "Create Collection"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionWrapper;
