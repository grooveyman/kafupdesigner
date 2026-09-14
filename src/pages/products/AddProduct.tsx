import React, { useState, useRef } from "react";
import "./admin.css";
import { CheckCheckIcon, CopyPlus, Image, ListChecks, NotebookPen, NotepadTextDashed } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiMutation } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Categories, { CategoryType } from "../../components/Products/Categories";
import "../../assets/css/addproduct.css";
import ProductDetails from "../../components/Products/ProductDetails";
import AddImages from "../../components/Products/AddImages";
import Review from "../../components/Products/Review";
import { useProductContext } from "../../context/ProductContext";
import ProductScrollNav from "../../components/Products/ProductScrollNav";
import z from "zod";

export interface Variation {
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface OtherImage {
  url: string | File;
}

export interface FormDataType {
  name: string;
  description: string;
  price: number;
  variation: Variation[];
  previmage: string | File;
  otherimages: OtherImage[];
  category: string;
}

const AddProducts: React.FC = () => {
  const [variations, setVariations] = useState<Variation[]>([]);



  const { product, addToProduct } = useProductContext();

  //create form submission 
  const navigate = useNavigate();

  //mutation to send post request
  const mutation = useApiMutation<{ message: string }>(
    "/designs/product",
    "POST",
    {
      onSuccess: (data) => {
        toast.success(data.message);
        navigate("/products");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  //submit handler
  //handle sending produc
  const variationSchema = z.object({
    color: z.string().trim().min(1, "Color is required"),
    size: z.string().trim().min(1, "Size is requird"),
    quantity: z.number().min(1),
    bust: z.string().min(1),
    hip: z.string().min(1),
    waist: z.string().min(1),
    neck: z.string().min(1),
    sleeve: z.string().min(1),
    gender: z.string().min(1)
  });
  const productSchema = z.object({
    name: z.string().trim().min(1, "Name field cannot be empty"),
    description: z.string().transform((value) => value.replace(/[^a-zA-Z0-9]/g, '')).nullable(),
    price: z.string(),
    designer_code: z.string().trim().min(1, "designer code cannot be empty"),
    cat_code: z.string().trim().min(1, "category code cannot be empty"),
    variations: z.array(variationSchema).min(1, "At lest one variation is required")
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    ["name", "description"].forEach((key) => {
      formData.append(key, (product as any)[key]);
    });

    //category 
    formData.append("cat_code", product.category.id);
    //variations
    formData.append("variations", JSON.stringify(product.variations));

    //price
    formData.append("price", product.price.toString());

    //collection code
    formData.append("collection_code", "");
    //preview image
    if (product.previewimg instanceof File) {
      formData.append("previewimg", product.previewimg);
    }

    //designercode
    formData.append("designer_code", "DES740410");

    //extra images
    // formData.append("otherimages", JSON.stringify(data.otherimages));
    product.otherimages.forEach((img) => {
      if (img.url instanceof File) {
        formData.append("images", img.url);
      }
    });

    //validation
    const validated = productSchema.safeParse(product);
    if (!validated.success) {
      toast.error(validated.error.issues.map((e => `${e.path.join(".")}: ${e.message}`)).join("/n"));
      return;
    } else {
      //send data to backend
      console.log(product);
      mutation.mutate(formData);
    }

  };

  //tab state
  const [selectedTab, setSelectedTab] = useState("categories");

  //tab click handler
  const handleTabClick = (tab: string) => () => {
    if (tab === "categories") {
      console.log("Categories tab clicked");
      setSelectedTab("categories");
    } else if (tab === "productdetails") {
      console.log("Product Details tab clicked");
      setSelectedTab("productdetails");
    } else if (tab === "images") {
      console.log("Images tab clicked");
      setSelectedTab("images");
    } else if (tab === "review") {
      console.log("Review tab clicked");
      setSelectedTab("review");
    }
  }



  return (
    <>
      <ProductScrollNav prodname={product.name} prodamount={product.price} />
      <div className="container">
        <form
          className="w-100"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="row mt-4">

            <div>
              <Breadcrumb
                crumbs={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Product List", href: "/products" },
                  { label: "Add Product", href: "/addproducts" },
                ]}
              />
            </div>
            {/* <h5>Add New Product</h5> */}
          </div>

          <div className="container">
            <div className="col-md-12">


              <div className="card">
                <div className="flex justify-content-start space-x-7 p-3 border-gray-200">
                  <div className={`${selectedTab === "categories" ? "active-tab" : "tab"}`} onClick={handleTabClick("categories")}><ListChecks className="mr-2 inline-block" /> Categories</div>
                  <div className={`${selectedTab === "productdetails" ? "active-tab" : "tab"}`} onClick={handleTabClick("productdetails")}><NotebookPen className="mr-2 inline-block" /> Product Details</div>
                  <div className={`${selectedTab === "images" ? "active-tab" : "tab"}`} onClick={handleTabClick("images")}><Image className="mr-2 inline-block" /> Images</div>
                  <div className={`${selectedTab === "review" ? "active-tab" : "tab"}`} onClick={handleTabClick("review")}><CheckCheckIcon className="mr-2 inline-block" /> Review</div>
                </div>
              </div>

            </div>
          </div>


          <div className="row">
            <div className="col-md-12">
              <div className="card mt-5 pt-5 px-4 pb-5">
                {selectedTab === "categories" && <Categories />}
                {selectedTab === "productdetails" && <ProductDetails />}
                {selectedTab === "images" && <div><AddImages /></div>}
                {selectedTab === "review" && <div><Review /></div>}
              </div>


            </div>

          </div>
        </form>

      </div>Ï
    </>

  );
};

export default AddProducts;
