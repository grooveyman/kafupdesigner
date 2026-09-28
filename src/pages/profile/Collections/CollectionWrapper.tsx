import { useMemo, useState } from "react";
import { Plus, Search, Trash2, FolderOpen } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../../components/Spinner";
import { useApiMutation, useApiQuery } from "../../../hooks/useApi";
import "../profile.css";

interface CollectionType {
    id: string;
    name: string;
    description?: string;
    image?: string;
}

const CollectionWrapper: React.FC = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ["collections"], []);
    const [search, setSearch] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const { data, isLoading } = useApiQuery<CollectionType[]>(queryKey, "/designer/collection");
    const collections = Array.isArray(data) ? data : [];

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return collections;
        return collections.filter((c) => c.name.toLowerCase().includes(q));
    }, [collections, search]);

    const createMutation = useApiMutation<{ message: string }>("/designer/collection", "POST", {
        onSuccess: () => {
            toast.success("Collection added successfully");
            setName("");
            setDescription("");
            setImage(null);
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (error) => toast.error(`Error adding collection: ${error.message}`),
    });

    const deleteMutation = useApiMutation<{ message: string }>("/designer/collection", "DELETE", {
        onSuccess: () => {
            toast.success("Collection deleted successfully");
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (error) => toast.error(`Error deleting collection: ${error.message}`),
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Collection name is required");
            return;
        }
        const formData = new FormData();
        formData.append("name", name.trim());
        if (description.trim()) formData.append("description", description.trim());
        if (image) formData.append("image", image);
        createMutation.mutate(formData);
    };

    const handleDelete = (collection: CollectionType) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Delete "${collection.name}"? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate({ id: collection.id });
            }
        });
    };

    return (
        <div className="kf-profile">
            <div className="container kf-profile__container" style={{ marginTop: "1.5rem" }}>
                <div className="kf-card">
                    <div className="kf-content__header">
                        <div>
                            <h5 className="kf-content__title">Collections</h5>
                            <p className="kf-content__subtitle">
                                {isLoading ? "Loading…" : `${filtered.length} of ${collections.length} collection${collections.length === 1 ? "" : "s"}`}
                            </p>
                        </div>
                    </div>

                    <form className="kf-collection-form" onSubmit={handleCreate}>
                        <div className="kf-filters" style={{ marginBottom: "0.6rem" }}>
                            <div className="kf-search">
                                <Search size={16} />
                                <input
                                    type="search"
                                    placeholder="Search collections…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Search collections"
                                />
                            </div>
                            <input
                                className="kf-cat-input"
                                type="text"
                                placeholder="New collection name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                aria-label="New collection name"
                            />
                        </div>
                        <div className="kf-filters">
                            <input
                                className="kf-cat-input"
                                type="text"
                                placeholder="Description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                aria-label="Collection description"
                            />
                            <input
                                className="kf-file-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                                aria-label="Collection cover image"
                            />
                            <button type="submit" className="btn btn-secondary d-inline-flex align-items-center gap-2" disabled={createMutation.isPending}>
                                {createMutation.isPending ? <Spinner color="secondary" size="sm" /> : <Plus size={16} />} Add
                            </button>
                        </div>
                    </form>

                    {isLoading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner color="secondary" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="kf-empty">
                            <FolderOpen size={34} />
                            <p className="mb-0">{collections.length === 0 ? "No collections yet. Add your first one above." : "No collections match your search."}</p>
                        </div>
                    ) : (
                        <div className="kf-grid">
                            {filtered.map((collection) => (
                                <div key={collection.id} className="kf-design">
                                    <div className="kf-design__media">
                                        {collection.image ? (
                                            <img src={collection.image} alt={collection.name} loading="lazy" />
                                        ) : (
                                            <div className="kf-empty" style={{ border: 0, height: "100%" }}>
                                                <FolderOpen size={28} />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="kf-cat-del kf-media-del"
                                            onClick={() => handleDelete(collection)}
                                            aria-label={`Delete ${collection.name}`}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="kf-design__body">
                                        <p className="kf-design__name" title={collection.name}>{collection.name}</p>
                                        {collection.description && (
                                            <span className="kf-design__cat">{collection.description}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionWrapper;
