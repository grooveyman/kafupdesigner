import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";

declare global {
    interface Window {
        bootstrap: any;
    }
}

export interface Variation {
    size: string;
    color: string;
    price: number;
    quantity: number;
}
interface OtherImage {
    url: string | File;
}
interface FormData {
    name: string;
    description: string;
    variation: Variation[];
    previmage: string | File;
    otherimages: OtherImage[];
    category: string;
}

const AddDesign: React.FC = () => {
const [variations, setVariations] = useState<Variation[]>([]);

    const navigate = useNavigate();
    const [data, setData] = useState<FormData>({
        name: "",
        description: "",
        variation: [],
        previmage: "",
        otherimages: [],
        category: "",
    });

    //mutation to send post request
    const mutation = useApiMutation<{ message: string }>(
        "/products/product",
        "POST",
        {
            onSuccess: (data) => {
                toast.success(data.message);
                navigate("/admin/products");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }
    );


    //handle sending products to backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        ["name", "description", "category"].forEach((key) => {
            formData.append(key, (data as any)[key]);
        });
        //variations
        formData.append("variations", JSON.stringify(variations));

        //preview image
        if (data.previmage instanceof File) {
            formData.append("previewimg", data.previmage);
        }

        //extra images
        // formData.append("otherimages", JSON.stringify(data.otherimages));
        data.otherimages.forEach((img) => {
            if (img.url instanceof File) {
                formData.append("images", img.url);
            }
        });

        //send data to backend
        console.log(formData);
        mutation.mutate(formData);
        // console.log(res.json());
    };

    return (
        <div className="container">
            <form
                className="w-100"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
            </form>

        </div>
    );
}

export default AddDesign;