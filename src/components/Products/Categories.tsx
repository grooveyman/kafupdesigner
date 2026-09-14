import { ArchiveX, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import "../../assets/css/categories.css";
import { useProductContext } from "../../context/ProductContext";

interface PostDataType {
    name: string;
    designercode: string;
}
export interface CategoryType {
    name: string;
    alias: string;
    id: string;
}
const Categories: React.FC = () => {
    const queryClient = useQueryClient();
    const [selected, setSelected] = useState<{ id: string } | null>(null);
    const [catname, setCatName] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCatName(e.target.value);
    };
    const queryKey = useMemo(() => ["categories"], []);
    const { data, isLoading } = useApiQuery<CategoryType[]>(queryKey, "/categories/all?designercode=DES740410");

    const categories = data || [];
    const options: { value: string, label: string }[] = categories.map((cat) => ({ value: cat.id, label: cat.name }));

    const { product, addToProduct } = useProductContext();
    const handleSelectChange = (selectedOption: any) => {

        if (selectedOption) {
            const selectedCategory = categories.find(cat => cat.id === selectedOption.target.value);
            console.log("selected category");
            console.log(selectedCategory);
            if (selectedCategory) {
                setSelected({ id: selectedCategory.id });
                addToProduct({ category: { id: selectedCategory.id, name: selectedCategory.name }, designer_code:"DES740410", cat_code: selectedCategory.id });
            }
        }
    };

    //delete mutation
    const deleteMutation = useApiMutation<{ message: string }>(
        "/categories/",
        "DELETE",
        {
            onSuccess: (data) => {
                console.log("Category deleted:", data.message);
                toast.success("Category deleted successfully");
                setSelected(null);
                queryClient.invalidateQueries({ queryKey });
            },
            onError: (error) => {
                console.error("Error deleting category:", error);
                toast.error(`Error deleting category: ${error.message}`);
            }
        }
    );

    //create mutation
    const mutation = useApiMutation<{ message: string }>(
        "/categories/",
        "POST",
        {
            onSuccess: (data) => {
                console.log("Category added:", data.message);
                toast.success("Category added successfully");
                setCatName("");
                // Optionally, you can add code to refresh the categories list here
                queryClient.invalidateQueries({ queryKey });
            },
            onError: (error) => {
                console.error("Error adding category:", error);
                toast.error(`Error adding category: ${error.message}`);
            }
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const postData: PostDataType = {
            name: catname,
            designercode: "DES740410"
        }

        mutation.mutate(postData);
    };
    return (
        <>
            <div className="container">
                <div className="row p-3">
                    <div className="col-md-6">
                        <h6 className="text-lg font-semibold mb-2">Select category</h6>
                        <div className="flex flex-col space-y-2">
                            {isLoading ? (
                                <div className="flex justify-center py-6">
                                    <Spinner color="secondary" />
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="flex flex-col items-center text-gray-400 py-6">
                                    <ArchiveX className="mb-2" size={32} />
                                    <p>No categories available.</p>
                                </div>
                            ) : (
                                <select onChange={handleSelectChange} value={product.cat_code} className="form-select select-category">
                                    <option value=""> Select a category </option>
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                    </div>

                    <div className="col-md-6">


                        <div className="p-3">
                            <h6>Not in List? Add New Category</h6>
                            <div className="mb-3">
                                <label htmlFor="categoryName" className="form-label">Category Name</label>
                                <input type="text" name="catname" value={catname} onChange={handleChange} className="form-control" id="categoryName" placeholder="Enter category name" />
                            </div>
                            <button type="button" onClick={handleSubmit} className="btn btn-secondary flex items-center gap-2">
                                {mutation.isPending ? (<Spinner className="inline-block" color="secondary" size="sm" />) : <Save className="inline-block" />} Save </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Categories;