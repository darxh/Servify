import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
import ServiceDetailsPage from "./pages/services/ServiceDetailsPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MyServicesPage from "./pages/dashboard/MyServicesPage";
import CreateServicePage from "./pages/dashboard/CreateServicePage";
import MyBookingsPage from "./pages/dashboard/MyBookingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/services/:id",
    element: <ServiceDetailsPage />,
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
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "services",
        element: <MyServicesPage />,
      },
      {
        path: "services/new",
        element: <CreateServicePage />,
      },
      {
        path: "bookings",
        element: <MyBookingsPage />,
      },
    ],
  },
]);

export default router;
