import {
  EyeIcon,
  User,
  MoreVertical,
  Motorbike,
  Ban,
  ChevronLeft,
  ChevronRight,
  Truck,
  X,
} from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "../products/admin.css";
import { OrderType } from "../../types/types";
import { DataTable } from "../../components/DataTable";
import SearchInput from "../../components/SearchInput";

const STATUS_MAP: Record<string, string> = {
  "0": "Pending",
  "1": "Delivered",
  "2": "Processing",
  "3": "Shipped",
  "4": "Cancelled",
};

const PRICE_RANGES = [
  { label: "Price Range", min: 0, max: Infinity },
  { label: "Under GHS 100", min: 0, max: 100 },
  { label: "GHS 100 – 500", min: 100, max: 500 },
  { label: "GHS 500 – 1000", min: 500, max: 1000 },
  { label: "Over GHS 1000", min: 1000, max: Infinity },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const OrdersList: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRangeIndex, setPriceRangeIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useApiQuery<OrderType[] | { data?: OrderType[]; orders?: OrderType[] }>(
    ["orders"],
    "/designer/orders"
  );

  const orders = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.orders)
        ? data.orders
        : [];

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateMutation = useApiMutation<{ message: string }>(
    "/orders/order",
    "PATCH",
    {
      onSuccess: async (response) => {
        toast.success(response.message);
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        navigate("/orders");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleSwal = (name: string, status: string, onConfirm: () => void) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are updating the status of ${name} to ${status}. Note: This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
        Swal.fire("Updated!", "Order status has been updated.", "success");
      }
    });
  };

  const handleOrderAction = (name: string, id: string, status: string) => {
    switch (status) {
      case "shipped":
        handleSwal(name, status, () => updateMutation.mutate({ id, status: "shipped" }));
        break;
      case "cancelled":
        handleSwal(name, status, () => updateMutation.mutate({ id, status: "cancelled" }));
        break;
      default:
        break;
    }
  };

  const handleEdit = (prodid: string) => {
    if (prodid) navigate(`/orders/${prodid}`);
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown((current) => (current === id ? null : id));
  };

  const handleDropdownAction = (action: string, product: OrderType) => {
    setOpenDropdown(null);

    if (action === "view") {
      handleEdit(product.id);
    } else if (action === "ship") {
      handleOrderAction(product.trck_no, product.id, "shipped");
    } else if (action === "delete") {
      handleOrderAction(product.trck_no, product.id, "cancelled");
    }
  };

  const handleOrderStatus = (status: string) => {
    const badges: Record<string, string> = {
      "0": "bg-warning",
      "1": "bg-success",
      "2": "bg-danger",
      "3": "bg-secondary",
      "4": "bg-danger",
    };

    return (
      <span className={`badge ${badges[status] ?? "bg-danger"}`}>
        {STATUS_MAP[status] ?? "Cancelled"}
      </span>
    );
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    const { min, max } = PRICE_RANGES[priceRangeIndex];

    return orders.filter((order) => {
      const matchesSearch =
        order.trck_no?.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.fullname?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const amount = Number(order.total ?? 0);
      const matchesPrice = amount >= min && amount < max;

      return matchesSearch && matchesStatus && matchesPrice;
    });
  }, [orders, search, statusFilter, priceRangeIndex]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safeCurrentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const pages: (number | "...")[] = [];
    const left = Math.max(2, safeCurrentPage - delta);
    const right = Math.min(totalPages - 1, safeCurrentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkShip = () => {
    const ids = Array.from(selectedIds);
    Swal.fire({
      title: "Ship selected orders?",
      text: `You are marking ${ids.length} order(s) as Shipped. This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, ship them!",
    }).then((result) => {
      if (result.isConfirmed) {
        ids.forEach((id) => updateMutation.mutate({ id, status: "shipped" }));
        clearSelection();
        Swal.fire("Shipped!", "Selected orders have been marked as shipped.", "success");
      }
    });
  };

  const handleBulkCancel = () => {
    const ids = Array.from(selectedIds);
    Swal.fire({
      title: "Cancel selected orders?",
      text: `You are cancelling ${ids.length} order(s). This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, cancel them!",
    }).then((result) => {
      if (result.isConfirmed) {
        ids.forEach((id) => updateMutation.mutate({ id, status: "cancelled" }));
        clearSelection();
        Swal.fire("Cancelled!", "Selected orders have been cancelled.", "success");
      }
    });
  };

  const hasActiveFilters = search || statusFilter !== "all" || priceRangeIndex !== 0;

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
            <div
              className="d-flex gap-2 align-items-center justify-content-between"
              style={{ width: "100%", flexWrap: "nowrap" }}
            >
              <div style={{ flex: "1 1 320px", minWidth: 220 }}>
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by order # or customer..."
                />
              </div>

              <div className="d-flex gap-2 align-items-center" style={{ flexWrap: "nowrap" }}>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ minWidth: 150 }}
                >
                  <option value="all">All Statuses</option>
                  <option value="0">Pending</option>
                  <option value="2">Processing</option>
                  <option value="3">Shipped</option>
                  <option value="1">Delivered</option>
                  <option value="4">Cancelled</option>
                </select>

                <select
                  className="form-select"
                  value={priceRangeIndex}
                  onChange={(e) => {
                    setPriceRangeIndex(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ minWidth: 180 }}
                >
                  {PRICE_RANGES.map((range, index) => (
                    <option key={index} value={index}>
                      {range.label}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setPriceRangeIndex(0);
                      setCurrentPage(1);
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedIds.size > 0 && (
            <div
              className="d-flex align-items-center gap-3 px-3 py-2 mb-3 rounded-3"
              style={{
                background: "var(--card-background-color)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <span style={{ fontSize: "0.875rem", color: "var(--text-color)" }}>
                <strong>{selectedIds.size}</strong> order{selectedIds.size !== 1 ? "s" : ""} selected
              </span>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                  style={{ borderRadius: "8px" }}
                  onClick={handleBulkShip}
                >
                  <Truck size={15} />
                  Ship selected
                </button>
                <button
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                  style={{ borderRadius: "8px" }}
                  onClick={handleBulkCancel}
                >
                  <Ban size={15} />
                  Cancel selected
                </button>
              </div>

              <button
                className="btn btn-sm btn-link text-muted ms-auto p-0 d-flex align-items-center gap-1"
                style={{ textDecoration: "none" }}
                onClick={clearSelection}
              >
                <X size={14} />
                Deselect all
              </button>
            </div>
          )}

          <DataTable
            headings={["Select", "Order", "Customer", "Quantity", "Status", "Total Price", "Action"]}
            data={paginatedData}
            isLoading={isLoading}
            renderRow={(item) => {
              const isSelected = selectedIds.has(item.id);

              return (
                <tr
                  key={item.id}
                  style={
                    isSelected
                      ? { outline: "2px solid var(--bs-primary)", outlineOffset: "-1px" }
                      : {}
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isSelected}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>

                  <td>
                    <div className="d-flex gap-3 align-items-center">
                      <User size={18} />
                      <div className="prod-det">{item.tck_no}</div>
                    </div>
                  </td>

                  <td>{item.customer?.fullname || "Unknown customer"}</td>
                  <td>{item.quantity ?? 0}</td>
                  <td>{handleOrderStatus(String(item.status))}</td>
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
                            <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleDropdownAction("view", item)}>View</div>
                            <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleDropdownAction("ship", item)}>Ship</div>
                            <div style={{ padding: "8px", cursor: "pointer", color: "red" }} onClick={() => handleDropdownAction("delete", item)}>Cancel</div>
                          </div>
                        )}
                      </div>

                      <div className="d-none d-md-flex gap-2">
                        <EyeIcon
                          className="prod-action-edit"
                          style={{ cursor: "pointer" }}
                          size={22}
                          strokeWidth={1.3}
                          onClick={() => handleDropdownAction("view", item)}
                        />
                        <Motorbike
                          className="prod-action-edit"
                          style={{ cursor: "pointer" }}
                          size={22}
                          strokeWidth={1.3}
                          onClick={() => handleDropdownAction("ship", item)}
                        />
                        <Ban
                          className="prod-action-del"
                          style={{ cursor: "pointer", color: "red" }}
                          size={22}
                          strokeWidth={1.3}
                          onClick={() => handleDropdownAction("delete", item)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }}
          />
        </div>

        {!isLoading && filteredData.length > 0 && (
          <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 mb-4 gap-2">
            <div className="d-flex align-items-center gap-2">
              <small className="text-muted">Rows per page:</small>
              <select
                className="form-select form-select-sm"
                style={{ width: "75px", borderRadius: "8px" }}
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <nav>
              <ul className="pagination pagination-sm mb-0" style={{ gap: "4px" }}>
                <li className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    style={{ borderRadius: "8px", border: "none" }}
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                </li>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <li key={`ellipsis-${idx}`} className="page-item disabled">
                      <span className="page-link" style={{ border: "none", background: "transparent" }}>
                        …
                      </span>
                    </li>
                  ) : (
                    <li key={page} className={`page-item ${page === safeCurrentPage ? "active" : ""}`}>
                      <button
                        className="page-link"
                        style={{ borderRadius: "8px", border: "none", minWidth: "36px" }}
                        onClick={() => handlePageChange(page as number)}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                <li className={`page-item ${safeCurrentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    style={{ borderRadius: "8px", border: "none" }}
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;