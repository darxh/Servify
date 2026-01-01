import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/auth/LoginPage"; // 1. Import the Real Page

const RegisterPlaceholder = () => <h1 className="text-2xl">Register Page</h1>;
const DashboardPlaceholder = () => <h1 className="text-2xl">Dashboard Home</h1>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPlaceholder />,
      },
    ],
  },
  {
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