import { ArchiveX, EyeIcon, User, MoreVertical, Motorbike, Ban, ChevronLeft, ChevronRight, Truck, X } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ListSkeletonLoader from "../../components/ListSkeletonLoader";
import { toast } from "react-toastify";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "../products/admin.css";
import { OrderType } from "../../types/types";

// Status label map
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

    // --- Filter state ---
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priceRangeIndex, setPriceRangeIndex] = useState(0);

    // --- Pagination state ---
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

    // --- Selection state ---
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const { data, isLoading } = useApiQuery<OrderType[]>(["orders"], "/orders/DES740410");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const updateMutation = useApiMutation<{ message: string }>(
        `/orders/order`,
        "PUT",
        {
            onSuccess: async (data) => {
                toast.success(data.message);
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
        }
    };

    const handleEdit = (prodid: string) => {
        if (prodid) navigate(`/orders/${prodid}`);
    };

    const handleDropdownToggle = (id: string) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleDropdownAction = (action: string, product: any) => {
        setOpenDropdown(null);
        if (action === "view") {
            handleEdit(product.id);
        } else if (action === "ship") {
            handleOrderAction(product.tck_no, product.id, "shipped");
        } else if (action === "delete") {
            handleOrderAction(product.tck_no, product.id, "cancelled");
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

    // --- Filtered + searched data ---
    const filteredData = useMemo(() => {
        if (!data) return [];
        const { min, max } = PRICE_RANGES[priceRangeIndex];

        return data.filter((order: any) => {
            const matchesSearch =
                order.tck_no?.toLowerCase().includes(search.toLowerCase()) ||
                order.customer?.name?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || order.status === statusFilter;

            const amount = parseFloat(order.totalamount ?? "0");
            const matchesPrice = amount >= min && amount < max;

            return matchesSearch && matchesStatus && matchesPrice;
        });
    }, [data, search, statusFilter, priceRangeIndex]);

    // --- Pagination logic ---
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

    // --- Selection handlers ---
    const pageIds = paginatedData.map((o: any) => o.id as string);
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    const somePageSelected = pageIds.some((id) => selectedIds.has(id)) && !allPageSelected;

    const handleSelectAll = () => {
        if (allPageSelected) {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                pageIds.forEach((id) => next.delete(id));
                return next;
            });
        } else {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                pageIds.forEach((id) => next.add(id));
                return next;
            });
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const clearSelection = () => setSelectedIds(new Set());

    // --- Bulk actions ---
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
    const startEntry = filteredData.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const endEntry = Math.min(safeCurrentPage * pageSize, filteredData.length);

    return (
        <>
            <div className="container">
                <div className="row">
                    
                        <div className="d-flex justify-content-between pt-4">
                            <div>
                                <Breadcrumb
                                    crumbs={[
                                        { label: "Dashboard", href: "/" },
                                        { label: "Orders List", href: "/orders" },
                                    ]}
                                />
                            </div>
                        
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="row filter-bar">
                    <div className="mt-3 mb-3">
                        <div className="row g-2 align-items-center">
                            <div className="d-flex justify-content-end gap-2">
                                {/* Search */}
                                <div className="">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Search by order # or customer..."
                                            className="form-control border-start-0"
                                            value={search}
                                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                        />
                                    </div>
                                </div>
                                {/* Status Filter */}
                                <div className="">
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
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
                                        value={priceRangeIndex}
                                        onChange={(e) => { setPriceRangeIndex(Number(e.target.value)); setCurrentPage(1); }}
                                    >
                                        {PRICE_RANGES.map((range, i) => (
                                            <option key={i} value={i}>{range.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <div className="col-md-2">
                                {hasActiveFilters && (
                                    <button
                                        className="btn btn-outline-danger w-100"
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

                        {/* Results count */}
                        <div className="mt-2">
                            <small className="text-muted">
                                {filteredData.length === 0
                                    ? "No orders found"
                                    : `Showing ${startEntry}–${endEntry} of ${filteredData.length} orders`}
                            </small>
                        </div>
                    </div>
                </div>

                {/* Bulk Action Toolbar — appears when rows are selected */}
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

                {/* Table */}
                <div className="row">
                    <div className="">
                        <div className="table-responsive">
                            <table
                                className="table table-borderless table-hover"
                                style={{ background: "none" }}
                            >
                                <thead>
                                    <tr>
                                        {/* Select-all checkbox */}
                                        <th style={{ width: "44px" }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={allPageSelected}
                                                ref={(el) => {
                                                    if (el) el.indeterminate = somePageSelected;
                                                }}
                                                onChange={handleSelectAll}
                                                title="Select all on this page"
                                            />
                                        </th>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Total Price (GHS)</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            {[...Array(7)].map((_, i) => (
                                                <td key={i}><ListSkeletonLoader count={3} /></td>
                                            ))}
                                        </tr>
                                    ) : paginatedData.length === 0 ? (
                                        <tr>
                                            <td colSpan={7}>
                                                <div className="d-flex flex-column align-items-center text-muted py-5">
                                                    <ArchiveX className="mb-2" size={32} />
                                                    <p className="mb-0">No orders match your filters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((product: any) => {
                                            const isSelected = selectedIds.has(product.id);
                                            return (
                                                <tr
                                                    key={product.id}
                                                    style={isSelected
                                                        ? { outline: "2px solid var(--bs-primary)", outlineOffset: "-1px" }
                                                        : {}
                                                    }
                                                >
                                                    {/* Row checkbox */}
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={isSelected}
                                                            onChange={() => handleSelectRow(product.id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-3">
                                                            <User />
                                                            <div className="prod-det">{product.tck_no}</div>
                                                        </div>
                                                    </td>
                                                    <td>{product.customer.name}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{handleOrderStatus(product.status)}</td>
                                                    <td>{product.totalamount}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-start align-items-center">
                                                            {/* Mobile: 3-dot dropdown */}
                                                            <div className="d-block d-md-none" style={{ position: "relative" }}>
                                                                <MoreVertical
                                                                    style={{ cursor: "pointer" }}
                                                                    size={22}
                                                                    onClick={() => handleDropdownToggle(product.id)}
                                                                />
                                                                {openDropdown === product.id && (
                                                                    <div style={{
                                                                        position: "absolute", top: "28px", right: 0,
                                                                        background: "#fff", border: "1px solid #ddd",
                                                                        borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                                                        zIndex: 10, minWidth: "120px", color: "#000",
                                                                    }}>
                                                                        <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleDropdownAction("view", product)}>View</div>
                                                                        <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => handleDropdownAction("ship", product)}>Ship</div>
                                                                        <div style={{ padding: "8px", cursor: "pointer", color: "red" }} onClick={() => handleDropdownAction("delete", product)}>Cancel</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Desktop: icon actions */}
                                                            <div className="d-none d-md-flex gap-2">
                                                                <EyeIcon
                                                                    className="prod-action-edit"
                                                                    style={{ cursor: "pointer" }}
                                                                    size={22} strokeWidth={1.3}
                                                                    onClick={() => handleDropdownAction("view", product)}
                                                                />
                                                                <Motorbike
                                                                    className="prod-action-edit"
                                                                    style={{ cursor: "pointer" }}
                                                                    size={22} strokeWidth={1.3}
                                                                    onClick={() => handleDropdownAction("ship", product)}
                                                                />
                                                                <Ban
                                                                    className="prod-action-del"
                                                                    style={{ cursor: "pointer", color: "red" }}
                                                                    size={22} strokeWidth={1.3}
                                                                    onClick={() => handleDropdownAction("delete", product)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {!isLoading && filteredData.length > 0 && (
                            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 mb-4 gap-2">
                                {/* Page size selector */}
                                <div className="d-flex align-items-center gap-2">
                                    <small className="text-muted">Rows per page:</small>
                                    <select
                                        className="form-select form-select-sm"
                                        style={{ width: "75px", borderRadius: "8px" }}
                                        value={pageSize}
                                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                    >
                                        {PAGE_SIZE_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Page buttons */}
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
                                                    <span className="page-link" style={{ border: "none", background: "transparent" }}>…</span>
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
            </div>
        </>
    );
};

export default OrdersList;