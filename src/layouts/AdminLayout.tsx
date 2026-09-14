import { Outlet, Navigate } from "react-router-dom";
import MainNavBar from "../components/MainNavBar";

const AdminLayout: React.FC = () => {
  const isAdmin = true; // replace with real auth/role check

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <MainNavBar items={[
        { label: "Dashboard", to: "/" },
        { label: "Products", to: "/products" },
        { label: "Orders", to: "/orders" },
        { label: "Customers", to: "/customers" },
        { label: "Profile", to: "/profile"},
      ]} />
      <main>
        <Outlet /> {/* renders nested admin routes */}
      </main>
    </div>
  );
};

export default AdminLayout;