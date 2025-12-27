import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

//Temporary Placeholders
const LoginPlaceholder = () => <h1 className="text-2xl">Login Page</h1>;
const RegisterPlaceholder = () => <h1 className="text-2xl">Register Page</h1>;
const DashboardPlaceholder = () => <h1 className="text-2xl">Dashboard Home</h1>;
const SigupPlaceholder = () => <h1 className="text-2x1">SingUp</h1>;

//Router Definition
const router = createBrowserRouter([
  {
    // Root Redirect
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    //Auth Routes Group
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPlaceholder />,
      },
      {
        path: "register",
        element: <RegisterPlaceholder />,
      },
      {
        path: "signup",
        element: <SigupPlaceholder />,
      },
    ],
  },
  {
    //Dashboard Routes Group
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPlaceholder />,
      },
    ],
  },
]);

export default router;
