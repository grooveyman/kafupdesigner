import {
    Grid,
    ShoppingCart,
    Star,
    Wallet,
} from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import "../assets/css/dashboard.css";


const salesData = [
    { month: "Jan", sales: 120 },
    { month: "Feb", sales: 180 },
    { month: "Mar", sales: 150 },
    { month: "Apr", sales: 230 },
    { month: "May", sales: 280 },
    { month: "Jun", sales: 320 },
    { month: "Jul", sales: 290 },
    { month: "Aug", sales: 380 },
];

const designData = [
    { name: "Sold", value: 25 },
    { name: "Unsold", value: 15 },
];

const trendingProducts = [
    { name: "Sunset Muse", category: "Print", sales: 128, revenue: "GHS 4,860", change: "+24%" },
    { name: "Urban Lines", category: "Digital", sales: 96, revenue: "GHS 3,420", change: "+18%" },
    { name: "Soft Geometry", category: "Canvas", sales: 74, revenue: "GHS 2,960", change: "+12%" },
    { name: "Earthbound", category: "Print", sales: 52, revenue: "GHS 1,840", change: "+8%" },
];

const newOrders = [
    { id: "#KF-1048", customer: "Ama Owusu", amount: "GHS 240", status: "Processing" },
    { id: "#KF-1047", customer: "Kojo Mensah", amount: "GHS 180", status: "Shipped" },
    { id: "#KF-1046", customer: "Nana Adjei", amount: "GHS 320", status: "Delivered" },
    { id: "#KF-1045", customer: "Abena Boateng", amount: "GHS 95", status: "Processing" },
];

const COLORS = ["#f5c400", "#eeeeee"];

const Dashboard: React.FC = () => {
    return (
        <div className="container">

            {/* Statistics */}
            <div className="row mt-5">

                <div className="col-md-3">
                    <div className="dashboard-card card">
                        <div className="card-body">
                            <div className="d-flex justify-content-start">
                                <Wallet
                                    className="me-2"
                                    fill="yellow"
                                    size={45}
                                />

                                <div className="dashboard-stats">
                                    <h5>GHS 400.90</h5>
                                    <p>Total Profit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="dashboard-card card">
                        <div className="card-body">
                            <div className="d-flex justify-content-start">
                                <Grid
                                    className="me-2"
                                    fill="yellow"
                                    size={45}
                                />

                                <div className="dashboard-stats">
                                    <h5>40</h5>
                                    <p>Total Designs (Sold & Unsold)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="dashboard-card card">
                        <div className="card-body">
                            <div className="d-flex justify-content-start">
                                <ShoppingCart
                                    className="me-2"
                                    fill="yellow"
                                    size={45}
                                    stroke="none"
                                />

                                <div className="dashboard-stats">
                                    <h5>4</h5>
                                    <p>New Orders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="dashboard-card card">
                        <div className="card-body">
                            <div className="d-flex justify-content-start">
                                <Star
                                    className="me-2"
                                    fill="yellow"
                                    size={45}
                                />

                                <div className="dashboard-stats">
                                    <h5>4.0</h5>
                                    <p>Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            {/* Sales Chart */}
            <div className="row mt-5">

                <div className="col-md-8">
                    <div className="dashboard-chart card border-0">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className="mb-1">
                                        Sales Overview
                                    </h5>

                                    <p className="text-muted mb-0">
                                        Monthly sales performance
                                    </p>
                                </div>

                                <span className="badge bg-light text-dark px-3 py-2">
                                    This Year
                                </span>
                            </div>


                            <div style={{ width: "100%", height: "300px" }}>

                                <ResponsiveContainer>

                                    <LineChart
                                        data={salesData}
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -20,
                                            bottom: 0,
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#eeeeee"
                                        />

                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12 }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12 }}
                                        />

                                        <Tooltip
                                            contentStyle={{
                                                border: "none",
                                                borderRadius: "10px",
                                                boxShadow:
                                                    "0 5px 20px rgba(0,0,0,0.08)",
                                            }}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#f5c400"
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 6 }}
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                    </div>

                </div>
                <div className="col-md-4">
                    <div className="dashboard-chart card border-0">
                        <div className="card-body p-4">

                            <div className="mb-3">
                                <h5 className="mb-1">Designs</h5>
                                <p className="text-muted mb-0">
                                    Sold vs unsold designs
                                </p>
                            </div>

                            <div style={{ width: "100%", height: "280px" }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={designData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={3}
                                        >
                                            {Array.from({ length: designData.length }, (_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="d-flex justify-content-center gap-4">
                                <div>
                                    <span className="text-white">●</span> <span className="text-white">Sold</span>
                                </div>

                                <div>
                                    <span className="text-secondary">●</span> <span className="text-white">Unsold</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="dashboard-table-card card border-0">
                        <div className="card-body p-4">
                            <div className="dashboard-table-header">
                                <div>
                                    <h5 className="mb-1">Trending products</h5>
                                    <p className="text-muted mb-0">Your best-performing designs this month</p>
                                </div>
                                <button type="button" className="dashboard-table-link">View all</button>
                            </div>

                            <div className="table-responsive">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Product</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Sales</th>
                                            <th scope="col">Revenue</th>
                                            <th scope="col">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trendingProducts.map((product, index) => (
                                            <tr key={product.name}>
                                                <td>
                                                    <div className="dashboard-product-cell">
                                                        <span className="dashboard-product-rank">0{index + 1}</span>
                                                        <strong>{product.name}</strong>
                                                    </div>
                                                </td>
                                                <td><span className="dashboard-category">{product.category}</span></td>
                                                <td>{product.sales}</td>
                                                <td><strong>{product.revenue}</strong></td>
                                                <td>
                                                    <div className="dashboard-trend-cell">
                                                        <span>{product.change}</span>
                                                        <div className="dashboard-trend-bar">
                                                            <span style={{ width: `${product.sales / 1.4}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="dashboard-table-card dashboard-orders-card card">
                        <div className="card-body p-4">
                            <div className="dashboard-table-header">
                                <div>
                                    <h5 className="mb-1">New orders</h5>
                                    <p className="text-muted mb-0">Latest customer activity</p>
                                </div>
                                <button type="button" className="dashboard-table-link">View all</button>
                            </div>

                            <div className="table-responsive">
                                <table className="dashboard-table dashboard-orders-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Order</th>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="dashboard-order-id">{order.id}</td>
                                                <td>
                                                    <span className="dashboard-customer-name">{order.customer}</span>
                                                </td>
                                                <td><strong>{order.amount}</strong></td>
                                                <td>
                                                    <span className={`dashboard-order-status dashboard-order-status-${order.status.toLowerCase()}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;