import { Copy, HistoryIcon, MoreVertical, Motorbike, CheckCircle, Truck, Package, XCircle, ArrowLeftIcon, CircleAlert } from "lucide-react";


import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "../../hooks/useApi";
import { OrderType } from "../../types/types";
import OrderDetailSkeleton from "./Skeletons/OrderDetails";
import { hexToColorName } from "../../components/Products/Review";
import { toast } from "react-toastify";
import { queryClient } from "../../queryClient";

const DropdownMoreVertical = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const handleToggle = () => setOpen((prev) => !prev);
    const navigate = useNavigate();
    const { orderid } = useParams();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const mutation = useApiMutation<{ message: string }>(
        `/orders/order/${orderid}`,
        "PUT",
        {
            onSuccess: async (data) => {
                toast.success(data.message);
                await queryClient.refetchQueries({ queryKey: ["orders"] });
                navigate("/orders");
                
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }
    );

    const handleMarkAsAction = (action: string) => {
        mutation.mutate({ status: action });
        setOpen(false);
    }

    return (
        <div style={{ position: 'relative' }} ref={menuRef}>
            <MoreVertical
                style={{ cursor: 'pointer', color: 'white' }}
                size={24}
                onClick={handleToggle}
            />
            {open && (
                <div style={{
                    position: 'absolute',
                    top: '32px',
                    right: 0,
                    background: '#302d2d',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                    zIndex: 100,
                    minWidth: '200px',
                    padding: '8px 0',
                    fontFamily: 'Roboto, Arial, sans-serif',
                }}>
                    <style>{`
                        .material-dropdown-btn {
                            display: flex;
                            align-items: center;
                            width: 100%;
                            border: none;
                            background: none;
                            padding: 12px 20px;
                            cursor: pointer;
                            font-size: 15px;
                            color: #333;
                            transition: background 0.2s;
                        }
                        .material-dropdown-btn:hover {
                            background: #918e8e;
                        }
                    `}</style>

                    <button className="material-dropdown-btn" style={{ color: "white" }} onClick={() => handleMarkAsAction('shipped')}>
                        <Truck size={20} color="#e2e4e6" style={{ marginRight: 12 }} /> Mark as Shipped
                    </button>
                    <button className="material-dropdown-btn" style={{ color: "white" }} onClick={() => handleMarkAsAction('delivered')}>
                        <Package size={20} color="#e2e4e6" style={{ marginRight: 12 }} /> Mark as Delivered
                    </button>
                    <button className="material-dropdown-btn" style={{ color: "#d32f2f" }} onClick={() => handleMarkAsAction('cancelled')}>
                        <XCircle size={20} color="#d32f2f" style={{ marginRight: 12 }} /> Cancel Order
                    </button>
                </div>
            )}
        </div>
    );
};

const checkedStatus = () => {
    return <span style={{
        width: 18, height: 18, borderRadius: '50%',
        background: '#28a745', display: 'inline-block', marginRight: 12,
        border: '2px solid #28a745', color: '#fff', textAlign: 'center', lineHeight: '14px', fontWeight: 'bold', fontSize: 12
    }}>✓</span>;

};

const uncheckedStatus = () => {
    return <span style={{
        width: 18, height: 18, borderRadius: '50%',
        background: '#6c757d', display: 'inline-block', marginRight: 12,
        border: '2px solid #6c757d', color: '#fff', textAlign: 'center', lineHeight: '14px', fontWeight: 'bold', fontSize: 12
    }}>•</span>;

};

const uncheckedStatusCancel = () => {
    return <span style={{
        width: 18, height: 18, borderRadius: '50%',
        background: '#712e22', display: 'inline-block', marginRight: 12,
        border: '2px solid #712e22', color: '#fff', textAlign: 'center', lineHeight: '14px', fontWeight: 'bold', fontSize: 12
    }}>x</span>;

};

const OrderDetails = () => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const formatTime = (dateString: string) => {
        //format in PM or AM

        const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    }

    //get data from backend
    const { orderid } = useParams();

    const { data, isLoading, error } = useApiQuery<OrderType>(["orders_" + orderid], `/orders/order/${orderid}`);
    
    //calculate summary
    const subtotal = data?.orderItems.reduce((acc, item) => acc + Number(item.total || 0), 0) || 0;
    const total = subtotal + 10 || 0; // Assuming a flat shipping rate of $10
    console.log("Order details data:", data, "Loading:", isLoading, "Error:", error);
    return (
        <>
            {isLoading && (
                <OrderDetailSkeleton />
            )}

            {data && (
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-start gap-3">
                                <div className="" style={{ backgroundColor: "black", borderRadius: "10px" }}>
                                    <button className="btn btn-sm" onClick={() => navigate("/orders")}>
                                        <ArrowLeftIcon style={{ color: "white" }} />
                                    </button>

                                </div>
                                <h5>Order Number: {data.tck_no}</h5>
                                {/* status */}
                                
                                <span className="" style={{ color: "white" }}>{formatDate(data.created_at)}</span>
                                <span className="" style={{ color: "white" }}>{formatTime(data.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* actions on order */}
                    <div className="row mt-2">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-end gap-3" style={{ position: 'relative' }}>
                                <DropdownMoreVertical />
                            </div>
                        </div>
                    </div>

                    {/* information on order */}
                    <div className="row mt-4">
                        {/* customer information */}
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h6 className="card-title">Customer Information</h6>
                                        <div className="" style={{ backgroundColor: "gray", padding: "10px" }}>
                                            <Copy
                                                style={{ cursor: 'pointer', color: 'white' }}
                                                size={18}
                                            />
                                        </div>
                                    </div>
                                    <div className="details mt-3">
                                        <div className="d-flex justify-content-between">
                                            <p className="card-text"><strong>Name:</strong> </p>
                                            <p>{data.customer.name}</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <p className="card-text"><strong>Email:</strong> </p>
                                            <p>{data.customer.email}</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <p className="card-text"><strong>Phone:</strong> </p>
                                            <p>{data.customer.contact}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h6 className="card-title">Delivery Address</h6>
                                        <div className="" style={{ backgroundColor: "gray", padding: "10px" }}>
                                            <Motorbike
                                                style={{ cursor: 'pointer', color: 'white' }}
                                                size={18}
                                            />
                                        </div>
                                    </div>
                                    <div className="details mt-3">
                                        <div className="d-flex justify-content-between">
                                            <p className="card-text"><strong>Delivery Address:</strong> </p>
                                            <p>{data.customer.delivery_address}</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <p className="card-text"><strong>Region:</strong> </p>
                                            <p>{data.customer.region}</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <p className="card-text"><strong>City:</strong> </p>
                                            <p>{data.customer.city}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h6 className="card-title mb-4">Order History</h6>
                                        <div className="" style={{ backgroundColor: "gray", padding: "10px" }}>
                                            <HistoryIcon
                                                style={{ cursor: 'pointer', color: 'white' }}
                                                size={18}
                                            />
                                        </div>
                                    </div>
                                    {/* Simple Timeline */}
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {/* Example steps */}
                                        <li style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="d-flex justify-content-start">
                                                {data.status === "0" ? checkedStatus() : uncheckedStatus()}
                                                <div>
                                                    <p style={{ fontWeight: 500, margin: "0" }}>Order Placed</p>
                                                    <span style={{ fontSize: 12, color: '#888' }}>2026-02-18</span>
                                                </div>
                                            </div>

                                        </li>

                                        <li style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="d-flex justify-content-start">
                                                {data.status === "3" ? checkedStatus() : uncheckedStatus()}
                                                <div>
                                                    <p style={{ fontWeight: 500, margin: "0" }}>Shipped</p>
                                                    <span style={{ fontSize: 12, color: '#888' }}>Pending</span>
                                                </div>
                                            </div>

                                        </li>


                                        <li style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="d-flex justify-content-start">
                                                {data.status === "1" ? checkedStatus() : uncheckedStatus()}
                                                <div>
                                                    <p style={{ fontWeight: 500, margin: "0" }}>Delivered</p>
                                                    <span style={{ fontSize: 12, color: '#888' }}>{data.status === '1' ? formatDate(data.delivery_date) : 'Not Delivered'}</span>
                                                </div>
                                            </div>

                                        </li>

                                        <li style={{ display: 'flex', alignItems: 'center' }}>

                                            <div className="d-flex justify-content-start">
                                                {data.status === "-1" ? uncheckedStatusCancel() : uncheckedStatus()}
                                                <div>
                                                    <p style={{ fontWeight: 500, margin: "0" }}>Cancelled</p>
                                                    <span style={{ fontSize: 12, color: '#888' }}>{formatDate(data.created_at)}</span>
                                                </div>
                                            </div>

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        {/* item summary */}
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title mb-4">Order Items</h6>
                                    <div className="table-responsive">
                                        <table className="table table-striped text-gray text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Qty</th>
                                                    <th>Price (GHS)</th>
                                                    <th>Total (GHS)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Example item */}
                                                {data.orderItems.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <div className="d-flex gap-3">
                                                                    <img
                                                                        src={item.design.previewimg}
                                                                        height={50}
                                                                        width={90}
                                                                        style={{ objectFit: "cover" }}
                                                                    />
                                                                    <div className="prod-det">
                                                                        <p className="prodname">{item.design.name}</p>
                                                                        <p className="prod-var">{hexToColorName(item.orderItemVariation.color)} - {item.orderItemVariation.size}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className="prod-category">
                                                                    <p className="prodname">{item.quantity}</p>
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p>{item.amount}</p>
                                                            </td>
                                                            <td>
                                                                <p>{item.total}</p>
                                                            </td>
                                                        </tr>
                                                    );

                                                })}


                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title mb-4">Order Summary</h6>
                                    <div className="d-flex justify-content-between">
                                        <p>Subtotal</p>
                                        <p>{subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p>Shipping</p>
                                        <p>{10.00.toFixed(2)}</p>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <p style={{ fontWeight: 500 }}>Total</p>
                                        <p style={{ fontWeight: 500 }}>{total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!data && !isLoading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                    <div className="">
                        <div className="mt-2 d-flex justify-content-center">
                            <CircleAlert className="text-danger" size={100} color="gray" />
                        </div>
                        <p style={{ color: "white", fontSize: 18, marginTop: 20 }} className="text-center">
                            Failed to load order details. Please try again later.</p>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-secondary mt-3" onClick={() => window.location.reload()}>
                                Retry
                            </button>
                            <button className="btn btn-tertiary mt-3" onClick={() => navigate("/orders")}>
                                Back to Orders
                            </button>
                        </div>

                    </div>

                </div>
            )}
        </>
    );
};

export default OrderDetails;