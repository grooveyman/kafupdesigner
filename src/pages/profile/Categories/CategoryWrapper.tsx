import { useMemo, useState } from "react";
import { Plus, Search, Trash2, FolderOpen } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../../components/Spinner";
import { useApiMutation, useApiQuery } from "../../../hooks/useApi";
import { tokenService } from "../../../context/tokenService";
import type { CategoryType } from "../../../components/Products/Categories";
import "../profile.css";

interface CategoryResponse {
    status: boolean;
    data: CategoryType[];
}

const CategoryWrapper: React.FC = () => {
    const queryClient = useQueryClient();
    const designerCode = tokenService.getDesignerCode() ?? "";
    const queryKey = useMemo(() => ["categories"], []);
    const [search, setSearch] = useState("");
    const [name, setName] = useState("");

    const { data, isLoading } = useApiQuery<CategoryResponse>(
        queryKey,
        `/designer/category?designercode=${designerCode}`
    );
    const categories = data?.data ?? [];

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((c) => c.name.toLowerCase().includes(q));
    }, [categories, search]);

    const createMutation = useApiMutation<{ message: string }>("/designer/category", "POST", {
        onSuccess: () => {
            toast.success("Category added successfully");
            setName("");
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (error) => toast.error(`Error adding category: ${error.message}`),
    });

    const deleteMutation = useApiMutation<{ message: string }>("/designer/category", "DELETE", {
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (error) => toast.error(`Error deleting category: ${error.message}`),
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }
        createMutation.mutate({ name: name.trim(), designercode: designerCode });
    };

    const handleDelete = (category: CategoryType) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Delete "${category.name}"? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate({ id: category.id });
            }
        });
    };

    return (
        <div className="kf-profile">
            <div className="container kf-profile__container" style={{ marginTop: "1.5rem" }}>
                <div className="kf-card">
                    <div className="kf-content__header">
                        <div>
                            <h5 className="kf-content__title">Categories</h5>
                            <p className="kf-content__subtitle">
                                {isLoading ? "Loading…" : `${filtered.length} of ${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
                            </p>
                        </div>
                    </div>

                    <form className="kf-filters" onSubmit={handleCreate}>
                        <div className="kf-search">
                            <Search size={16} />
                            <input
                                type="search"
                                placeholder="Search categories…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Search categories"
                            />
                        </div>
                        <input
                            className="kf-cat-input"
                            type="text"
                            placeholder="New category name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-label="New category name"
                        />
                        <button type="submit" className="btn btn-secondary d-inline-flex align-items-center gap-2" disabled={createMutation.isPending}>
                            {createMutation.isPending ? <Spinner color="secondary" size="sm" /> : <Plus size={16} />} Add
                        </button>
                    </form>

                    {isLoading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner color="secondary" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="kf-empty">
                            <FolderOpen size={34} />
                            <p className="mb-0">{categories.length === 0 ? "No categories yet. Add your first one above." : "No categories match your search."}</p>
                        </div>
                    ) : (
                        <ul className="kf-cat-list">
                            {filtered.map((cat) => (
                                <li key={cat.id} className="kf-cat-row">
                                    <span className="kf-cat-name">{cat.name}</span>
                                    <button
                                        type="button"
                                        className="kf-cat-del"
                                        onClick={() => handleDelete(cat)}
                                        aria-label={`Delete ${cat.name}`}
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryWrapper;
