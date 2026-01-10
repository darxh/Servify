import { Link, useLocation } from "react-router-dom";
// 1. Add 'Home' icon to imports
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Briefcase,
  LogOut,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  // 2. Add 'Home' as the first item
  const baseNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const providerNavigation = [
    { name: "My Services", href: "/dashboard/services", icon: Briefcase },
  ];

  // Logic to insert "My Services" for providers
  const navigation =
    user?.role?.toLowerCase() === "provider" || user?.role === "admin"
      ? // Note: baseNavigation has 4 items now.
        // Home(0), Dashboard(1), Bookings(2), Settings(3).
        // We want 'My Services' after Bookings(2), or maybe after Dashboard(1).
        // Let's put it after Dashboard for visibility:
        [
          ...baseNavigation.slice(0, 2),
          ...providerNavigation,
          ...baseNavigation.slice(2),
        ]
      : baseNavigation;

  const isActive = (path) => pathname === path;

  return (
    <div className="flex h-full min-h-screen w-64 flex-col border-r border-gray-200 bg-white px-6">
      <div className="flex h-16 items-center">
        {/* Keeping this logo link is fine too */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Servify
        </Link>
      </div>

      <nav className="flex flex-1 flex-col pt-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive(item.href)
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-blue-600"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mb-6 mt-auto border-t border-gray-200 pt-4">
        <button
          onClick={logout}
          className="group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-600" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
