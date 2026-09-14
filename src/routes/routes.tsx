import { createBrowserRouter, Outlet } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
// import Home from "../pages/Home";
// import Details from "../pages/Details";
// import Cart from "../pages/Cart";
// import Categories from "../pages/Categories";
// import Checkout from "../pages/Checkout";
import AddProducts from "../pages/products/AddProduct";
import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/products/ProductList";
import AdminLayout from "../layouts/AdminLayout";
import EditProduct from "../pages/products/EditProduct";
import OrdersList from "../pages/orders/OrdersList";
import OrderDetails from "../pages/orders/OrderDetails";
import CustomerList from "../pages/customers/CustomerList";
import Profile from "../pages/profile/Profile";
import Login from "../pages/login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { AuthProvider } from "../context/AuthContext";
import { ProductProvider } from "../context/ProductContext";
import CategoryWrapper from "../pages/profile/Categories/CategoryWrapper";
import CollectionWrapper from "../pages/profile/Collections/CollectionWrapper";
import ShopWrapper from "../pages/profile/Shop/ShopWrapper";
import Register from "../pages/register/Register";
import VerifyEmail from "../pages/register/VerifyEmail";
import SendReset from "../pages/forgotpassword/SendReset";
import ChangePassword from "../pages/forgotpassword/ChangePAssword";

export const router = createBrowserRouter(
  [
    {
      element: (
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
              <Outlet />
          </QueryClientProvider>
        </AuthProvider>
      ),
      children: [
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        },
        {
          path: '/verify-email',
          element: <VerifyEmail />
        },
        {
          path: '/password-reset',
          element: <SendReset />
        },
        {
          path: "/reset-password",
          element: <ChangePassword />
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <AdminLayout />,
              children: [

                { index: true, element: <Dashboard /> },
                { path: "products", element: <ProductList /> },
                {
                  path: "/addproducts", element: (
                    <ProductProvider>
                      <AddProducts />
                    </ProductProvider>
                  )
                },
                { path: "/editproducts/:prodid", element: <EditProduct /> },
                { path: "/orders", element: <OrdersList /> },
                { path: "/orders/:orderid", element: <OrderDetails /> },
                { path: "/customers", element: <CustomerList /> },
                { path: "/profile", element: <Profile /> },
                { path: "/profile-category", element: <CategoryWrapper /> },
                { path: "/profile-collections", element: <CollectionWrapper /> },
                { path: "/profile-shop", element: <ShopWrapper /> },
                { path: "*", element: <div>404 Not Found</div> }
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: "/admin" }
);
