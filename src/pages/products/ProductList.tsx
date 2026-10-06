import { EditIcon, Trash2Icon } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./admin.css";
import SearchInput from "../../components/SearchInput";
import { DataTable } from "../../components/DataTable";

interface DesignProduct {
  id: string | number;
  name: string;
  description?: string;
  price?: number | string;
  quantity?: number;
  previewimg?: string;
  category?: { name?: string };
  categories?: { name?: string };
}

const DesignList: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useApiQuery<DesignProduct[]>(["designs"], "/designer/designs");

  const designs = Array.isArray(data) ? data : [];
  const filtered = designs.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.category?.name?.toLowerCase().includes(q) ||
      d.categories?.name?.toLowerCase().includes(q)
    );
  });

  const mutation = useApiMutation<{ message: string }>(
    "/designer/designs",
    "DELETE",
    {
      onSuccess: (response) => {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["designs"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleDelete = (name: string, id: string | number) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are deleting ${name} from designs. Note: This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id });
        Swal.fire("Deleted!", "Design has been removed.", "success");
      }
    });
  };

  const handleEdit = (prodid: string | number) => {
    if (prodid !== undefined && prodid !== null) {
      navigate(`/editdesigns/${String(prodid)}`);
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
                    { label: "Design List", href: "/designs" },
                  ]}
                />
              </div>

            </div>
          </div>
        </div>


        <div className="row kf-profile mt-5">
          <div className="kf-card">
            <div className="kf-content__header">
              <div>
                <h5 className="kf-content__title mb-1">Designs</h5>
                <p className="kf-variant-help mb-0">
                  Create designs and manage your product catalog. You can add, edit or delete designs from this list.
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/adddesigns")}
              >
                Add Design
              </button>
            </div>
            <div className="kf-filters">

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search designs by name, description or category…"
              />

            </div>

            {/* <div className="table-responsive"> */}

            <DataTable
              isLoading={isLoading}
              headings={["Design Details", "Category", "Quantity", "Unit Price", "Action"]}
              data={filtered}
              renderRow={(item) => {
                const description = item.description ?? "";
                const categoryName = item.category?.name ?? item.categories?.name ?? "Uncategorized";

                return (
                  <tr key={String(item.id)}>
                    <td>
                      <div className="d-flex gap-3">
                        <img
                          src={item.previewimg || ""}
                          alt={item.name}
                          height={50}
                          width={90}
                          style={{ objectFit: "cover" }}
                        />
                        <div className="prod-det">
                          <p className="prodname">{item.name}</p>
                          <p className="prod-var text-wrap">
                            {description.length > 30
                              ? `${description.slice(0, 30)}...`
                              : description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <p className="prod-category">
                        <span className="table-card text-black">{categoryName}</span>
                      </p>
                    </td>

                    <td>
                      <p>{item.quantity ?? 0}</p>
                    </td>

                    <td>
                      <div className="d-flex">
                        <p>{item.price ?? "N/A"}</p>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex justify-content-start">
                        <EditIcon
                          className="prod-action-edit"
                          style={{ cursor: "pointer" }}
                          size={25}
                          strokeWidth={1.3}
                          onClick={() => handleEdit(item.id)}
                        />
                        <Trash2Icon
                          className="prod-action-del"
                          size={25}
                          style={{ cursor: "pointer" }}
                          strokeWidth={1.3}
                          onClick={() => handleDelete(item.name, item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              }}
            />
            {/* </div> */}
          </div>
          {/* Results count */}
          <div className="mt-2">
            <small className="text-muted">
              {isLoading
                ? "Loading…"
                : `${filtered.length} of ${designs.length} design${designs.length === 1 ? "" : "s"}`}
            </small>
          </div>
        </div>

      </div >
    </>
  );
};

export default DesignList;
