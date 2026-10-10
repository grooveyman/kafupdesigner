import { createBrowserRouter, Outlet } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
// import Home from "../pages/Home";
// import Details from "../pages/Details";
// import Cart from "../pages/Cart";
// import Categories from "../pages/Categories";
// import Checkout from "../pages/Checkout";
import AddDesigns from "../pages/products/AddProduct";
import Dashboard from "../pages/Dashboard";
import DesignList from "../pages/products/ProductList";
import AdminLayout from "../layouts/AdminLayout";
import EditDesign from "../pages/products/EditProduct";
import OrdersList from "../pages/orders/List";
import OrderDetails from "../pages/orders/OrderDetails";
import CustomerList from "../pages/customers/CustomerList";
import Profile from "../pages/profile/Profile";
import Login from "../pages/login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { AuthProvider } from "../context/AuthContext";
import { DesignProvider } from "../context/ProductContext";
import CategoryWrapper from "../pages/profile/Categories/CategoryWrapper";
import CollectionWrapper from "../pages/profile/Collections/CollectionWrapper";
import CollectionDetails from "../pages/profile/Collections/CollectionDetails";
import ShopWrapper from "../pages/profile/Shop/ShopWrapper";
import Register from "../pages/register/Register";
import VerifyEmail from "../pages/register/VerifyEmail";
import SendReset from "../pages/forgotpassword/SendReset";
import ChangePassword from "../pages/forgotpassword/ChangePassword";
import AccountSetup from "../pages/accountsetup/AccountSetup";
import { AddToCollection } from "../pages/profile/Collections/AddToCollection";

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
                { path: "/designs", element: <DesignList /> },
                {
                  path: "/adddesigns", element: (
                    <DesignProvider>
                      <AddDesigns />
                    </DesignProvider>
                  )
                },
                {
                  path: "/editdesigns/:prodid", element: (
                    <DesignProvider>
                      <EditDesign />
                    </DesignProvider>

                  )
                },
                { path: "/orders", element: <OrdersList /> },
                { path: "/orders/:orderid", element: <OrderDetails /> },
                { path: "/customers", element: <CustomerList /> },
                { path: "/profile", element: <Profile /> },
                { path: "/categories", element: <CategoryWrapper /> },
                { path: "/collections", element: <CollectionWrapper /> },
                { path: "/collections/:id", element: <CollectionDetails /> },
                { path: "/add-to-collection/:id", element: <AddToCollection /> },
                { path: "/profile-shop", element: <ShopWrapper /> },
                { path: "/accountsetup", element: <AccountSetup /> },
                { path: "*", element: <div>404 Not Found</div> }
              ],
            },
          ],
        },
      ],
    },
  ]
);
