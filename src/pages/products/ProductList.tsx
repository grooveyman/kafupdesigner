import { ArchiveX, EditIcon, Trash2Icon } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Product } from "../Home";
import ListSkeletonLoader from "../../components/ListSkeletonLoader";
import { toast } from "react-toastify";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./admin.css";
import { Variation } from "./AddProduct";

const ProductList: React.FC = () => {
  const [_isDelete, setIsDelete] = useState(false);
  const [randomNum] = useState(() => Math.floor(Math.random() * 1000000));
  const { data, isLoading } = useApiQuery<Product[]>(["products_" + randomNum], "/designs/DES740410");
  console.log("Fetched data:", isLoading ? " loading..." : data);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const mutation = useApiMutation<{ message: string }>(
    `/products/del`,
    "DELETE",
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleDelete = (name: string, id: string) => {
    console.log("Delete clicked");
    Swal.fire({
      title: "Are you sure?",
      text: `You are deleting ${name} from products. Note: This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id });
        setIsDelete(true);
        console.log("Item deleted");
        Swal.fire("Deleted!", "Product has been removed.", "success");
      }
    });
  };

  const handleEdit = (prodid: string) => {
    if (prodid) {
      navigate(`/editproducts/${prodid}`);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="">

            <div className="d-flex justify-content-between pt-4">
              <div>
                <Breadcrumb
                  crumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Product List", href: "/products" },
                  ]}
                />
              </div>

            </div>
          </div>
        </div>

        <div className="row filter-bar">
          <div className="mt-3 mb-3">
            <div className="row g-2 align-items-center">
              <div className="d-flex justify-content-between align-items-center">
                <div className="">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => navigate("/addproducts")}
                  >
                    Add Product
                  </button>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  {/* Search */}
                  <div className="">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search by order # or customer..."
                        className="form-control border-start-0"
                        value={"search"}
                        onChange={(e) => { }}
                      />
                    </div>
                  </div>
                  {/* Status Filter */}
                  <div className="">
                    <select
                      className="form-select"
                      value={""}
                      onChange={(e) => { }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="0">Pending</option>
                      <option value="2">Processing</option>
                      <option value="3">Shipped</option>
                      <option value="1">Delivered</option>
                      <option value="4">Cancelled</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="">
                    <select
                      className="form-select"
                      value={""}
                      onChange={(e) => { }}
                    >

                    </select>
                  </div>

                  <div className="">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => { }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Results count */}
            <div className="mt-2">
              <small className="text-muted">

              </small>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="card">
            <div className="table-responsive">
              <table
                className="table table-borderless table-hover"
                style={{ background: "none" }}
              >

                <thead className="">
                  <tr>
                    <th>Product Details</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tr>
                    <td>
                      <ListSkeletonLoader count={3} />
                    </td>
                    <td>
                      <ListSkeletonLoader count={3} />
                    </td>
                    <td>
                      <ListSkeletonLoader count={3} />
                    </td>
                    <td>
                      <ListSkeletonLoader count={3} />
                    </td>
                    <td>
                      <ListSkeletonLoader count={3} />
                    </td>
                  </tr>
                ) : (
                  data ? (
                    data?.map((product: any) => {
                      return (
                        <tr className="" key={product.id}>
                          <td className="">
                            <div className="d-flex gap-3">
                              <img
                                src={product.previewimg}
                                height={50}
                                width={90}
                                style={{ objectFit: "cover" }}
                              />
                              <div className="prod-det">
                                <p className="prodname">{product.name}</p>
                                <p className="prod-var text-wrap">{product.description.length > 30 ? product.description.slice(0, 30) + "..." : product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="prod-category">
                              {product.category && (
                                <span className="table-card text-black">
                                  {product.category.name}
                                </span>
                              )}

                            </p>
                          </td>
                          <td className="">
                            <p>{product.quantity}</p>
                          </td>

                          <td>
                            <div className="d-flex">
                              <p>{product.price}</p>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex justify-content-start">
                              {/* <p className="prod-action-btn"> */}
                              <EditIcon
                                className="prod-action-edit"
                                style={{ cursor: "pointer" }}
                                size={25}
                                strokeWidth={1.3}
                                onClick={() => handleEdit(product.id)}
                              />
                              <Trash2Icon
                                className="prod-action-del"
                                size={25}
                                style={{ cursor: "pointer" }}
                                strokeWidth={1.3}
                                onClick={() =>
                                  handleDelete(product.name, product.id)
                                }
                              />
                              {/* </p> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 py-6">
                      <ArchiveX className="mb-2" size={32} />
                      <p>No products available.</p>
                    </div>

                  )

                )}

              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
