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
import SettingsPage from "./pages/dashboard/SettingsPage";
import ServicesPage from "./pages/services/ServicesPage";
import EditServicePage from "./pages/dashboard/EditServicePage";

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>Oops! The page you are looking for does not exist.</p>
      <a href="/" style={{ marginTop: '1rem', color: 'blue', textDecoration: 'underline' }}>Go back Home</a>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
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
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "services/edit/:id",
        element: <EditServicePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
