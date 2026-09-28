import { ArchiveX, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import "../../assets/css/categories.css";
import { useDesignContext } from "../../context/ProductContext";
import { tokenService } from "../../context/tokenService";

interface PostDataType {
    name: string;
    designercode: string;
}
export interface CategoryType {
    name: string;
    alias: string;
    id: string;
}
interface Response {
    status: string;
    data: CategoryType[];
}

const Categories: React.FC = () => {
    const queryClient = useQueryClient();
    const designerCode = tokenService.getDesignerCode() ?? "";
    const { design, addToDesign } = useDesignContext();

    const [catname, setCatName] = useState<string>("");

    const queryKey = useMemo(() => ["categories", designerCode], [designerCode]);
    const { data, isLoading } = useApiQuery<Response>(
        queryKey,
        `/designer/category?designercode=${designerCode}`
    );
    const categories = data?.data ?? [];

    const selectedName = design.category?.name;

    // Choosing a category updates the shared design draft.
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = categories.find((cat) => cat.id === e.target.value);
        addToDesign({
            category: { id: selected?.id ?? "", name: selected?.name ?? "" },
            designer_code: designerCode,
            cat_code: selected?.id ?? "",
        });
    };

    // Create a new category; on success it is refetched and appears in the list.
    const mutation = useApiMutation<{ message: string }>("/designer/category/", "POST", {
        onSuccess: () => {
            toast.success("Category added successfully");
            setCatName("");
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (error) => toast.error(`Error adding category: ${error.message}`),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = catname.trim();
        if (!name) {
            toast.error("Please enter a category name");
            return;
        }
        const postData: PostDataType = { name, designercode: designerCode };
        mutation.mutate(postData);
    };

    return (
        <div className="container">
            <div className="row g-4 p-3">
                {/* Choose an existing category */}
                <div className="col-md-7">
                    <h6 className="text-white mb-1">Choose a category</h6>
                    <p className="kf-cat-help mb-3">
                        Pick the category this design belongs to so shoppers can find it.
                    </p>

                    {isLoading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner color="secondary" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="kf-cat-empty text-center py-5">
                            <ArchiveX className="mb-2" size={32} />
                            <p className="mb-1">You have no categories yet.</p>
                            <small>Create your first one using the form on the right.</small>
                        </div>
                    ) : (
                        <>
                            <select
                                className="form-select"
                                value={design.cat_code ?? ""}
                                onChange={handleSelectChange}
                            >
                                <option value="">Select a category…</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {selectedName ? (
                                <div className="kf-cat-selected mt-3">
                                    Selected: <strong>{selectedName}</strong>
                                </div>
                            ) : (
                                <small className="kf-cat-help d-block mt-2">
                                    No category selected yet.
                                </small>
                            )}
                        </>
                    )}
                </div>

                {/* Add a new category */}
                <div className="col-md-5">
                    <div className="kf-cat-add">
                        <h6 className="text-white mb-1">Add a new category</h6>
                        <p className="kf-cat-help mb-3">
                            Not in the list? Create one and it appears here instantly.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="categoryName" className="form-label">
                                Category name
                            </label>
                            <input
                                id="categoryName"
                                type="text"
                                name="catname"
                                value={catname}
                                onChange={(e) => setCatName(e.target.value)}
                                className="form-control mb-3"
                                placeholder="e.g. Evening Gowns"
                            />
                            <button
                                type="submit"
                                className="btn btn-secondary d-inline-flex align-items-center gap-2"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <Spinner color="secondary" size="sm" />
                                ) : (
                                    <Save size={16} />
                                )}
                                Save category
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
