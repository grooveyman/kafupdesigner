import { useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiQuery } from "../../hooks/useApi";
import { OrderType } from "../../types/types";
import SearchInput from "../../components/SearchInput";
import { DataTable } from "../../components/DataTable";
import { User, EyeIcon, MoreVertical, Motorbike, Ban } from "lucide-react";
import { useSwal } from "../../hooks/swal";
import { useNavigate } from "react-router-dom";
import { handleOrderStatus } from "../../hooks/helper";

interface Response {
    data?: OrderType[];
    // orders?: OrderType[];
    results?: OrderType[];
    meta?: { page: number, limit: number, total: number, totalPage: number };
}

const OrderList: React.FC = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const navigate = useNavigate();

    const { data, isLoading } = useApiQuery<Response | OrderType[]>(
        ["orders"],
        "/designer/orders"
    );

    const orders = useMemo(() => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        // if (Array.isArray(data?.orders)) return data.orders;
        if (Array.isArray(data?.results)) return data.results;
        return [];
    }, [data]);
    console.log("order", orders);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return orders;

        return orders.filter((order) => {
            
            const orderNo = order.trck_no?.toLowerCase() ?? "";
            const customerName = (order.customer?.fullname ?? order.customer_email ?? "").toLowerCase();
            return orderNo.includes(query) || customerName.includes(query);
        });
    }, [orders, search]);

    const getCustomerName = (item: OrderType) => item.customer?.fullname || item.customer_email || "Unknown customer";

    const { confirmThenRun } = useSwal();

    const handleDropdownToggle = (id: string) => {
        setOpenDropdown((current) => (current === id ? null : id));
    };

    const handleDropdownAction = (product: OrderType, action: "view" | "ship" | "cancel") => {
        setOpenDropdown(null);

        if (action === "view") {
            navigate(`/orders/${product.id}`);
            return;
        }

        const status = action === "ship" ? "ship" : action === "cancel" ? "cancelled" : "";
        const orderName = product?.trck_no ?? "this order";
        console.log("Action",action);
        if (status) {
            confirmThenRun({
                confirm: {
                    title: "Confirm action",
                    text: `Are you sure you want to ${action === "ship" ? "ship" : "cancel"} ${orderName}?`,
                    confirmButtonText: "Yes, continue",
                },
                action: async () => ({ name: orderName, status }),
            });
        }
    };


    return (
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between pt-4">
                    <Breadcrumb
                        crumbs={[
                            { label: "Dashboard", href: "/" },
                            { label: "Orders List", href: "/orders" },
                        ]}
                    />
                </div>
            </div>

            <div className="row kf-profile mt-5">
                <div className="kf-card">
                    <div className="kf-content__header">
                        <div>
                            <h5 className="kf-content__title mb-1">Orders</h5>
                            <p className="kf-variant-help mb-0">
                                Track customer orders, update shipping status, and manage cancellations from one place.
                            </p>
                        </div>
                    </div>

                    <div className="kf-filters" style={{ width: "100%" }}>
                        <SearchInput
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by order # or customer..."
                        />
                    </div>

                    {!isLoading && filteredOrders.length === 0 && (
                        <div className="d-flex justify-content-center py-5">
                            <p className="mb-0 text-gray-400">No orders found.</p>
                        </div>
                    )}
                    <DataTable
                        headings={["Order", "Customer", "Quantity", "Status", "Total Price", "Action"]}
                        data={filteredOrders}
                        isLoading={isLoading}
                        renderRow={(item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="d-flex gap-3 align-items-center">
                                        {/* <User size={18} /> */}
                                        <div className="prod-det">{item.trck_no}</div>
                                    </div>
                                </td>

                                <td>{getCustomerName(item)}</td>
                                <td>{item.quantity ?? 0}</td>
                                <td>{handleOrderStatus(item.status)}</td>
                                <td>{item.total ?? 0}</td>
                                <td>
                                    <div className="d-flex justify-content-start align-items-center">
                                        <div className="d-block d-md-none" style={{ position: "relative" }}>
                                            <MoreVertical
                                                style={{ cursor: "pointer" }}
                                                size={22}
                                                onClick={() => handleDropdownToggle(item.id)}
                                            />
                                            {openDropdown === item.id && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "28px",
                                                        right: 0,
                                                        background: "#fff",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "4px",
                                                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                                        zIndex: 10,
                                                        minWidth: "120px",
                                                        color: "#000",
                                                    }}
                                                >
                                                    <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleDropdownAction(item, "view")}>View</div>
                                                    <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleDropdownAction(item, "ship")}>Ship</div>
                                                    <div style={{ padding: "8px", cursor: "pointer", color: "red" }} onClick={() => handleDropdownAction(item, "cancel")}>Cancel</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-none d-md-flex gap-2">
                                           
                                            <EyeIcon
                                                className="prod-action-edit"
                                                style={{ cursor: "pointer" }}
                                                size={22}
                                                strokeWidth={1.3}
                                                onClick={() => handleDropdownAction(item, "view")}
                                            />
                                            {item.status !== "-1" && item.status !== "3" && item.status !== "1" && (
                                                <Motorbike
                                                    className="prod-action-edit"
                                                    style={{ cursor: "pointer" }}
                                                    size={22}
                                                    strokeWidth={1.3}
                                                    onClick={() => handleDropdownAction(item, "ship")}
                                                />
                                            )}
                                            {item.status !== "-1" && item.status !== "1" && (
                                                <Ban
                                                    className="prod-action-del"
                                                    style={{ cursor: "pointer", color: "red" }}
                                                    size={22}
                                                    strokeWidth={1.3}
                                                    onClick={() => handleDropdownAction(item, "cancel")}
                                                />
                                            )}
                                       
                                            {/* <Motorbike
                                                className="prod-action-edit"
                                                style={{ cursor: "pointer" }}
                                                size={22}
                                                strokeWidth={1.3}
                                                onClick={() => handleDropdownAction(item, "ship")}
                                            />
                                            <Ban
                                                className="prod-action-del"
                                                style={{ cursor: "pointer", color: "red" }}
                                                size={22}
                                                strokeWidth={1.3}
                                                onClick={() => handleDropdownAction(item, "cancel")}
                                            /> */}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderList;