import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Briefcase, 
  Settings, 
  LogOut, 
  PlusCircle,
  User,
  Home
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
    ${isActive(path) 
      ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
    }
  `;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 z-50">
      
      <div className="p-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          {/* <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">S</div> */}
          <span className="text-xl font-bold text-gray-900 tracking-tight">Servify</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
          Overview
        </p>
        
        <Link to="/" className={linkClass("/")}>
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/dashboard/bookings" className={linkClass("/dashboard/bookings")}>
          <CalendarCheck size={20} />
          <span>My Bookings</span>
        </Link>

        {(user?.role === "provider" || user?.role === "admin") && (
          <>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">
              Provider Tools
            </p>
            
            <Link to="/dashboard/services" className={linkClass("/dashboard/services")}>
              <Briefcase size={20} />
              <span>My Services</span>
            </Link>

            <Link to="/dashboard/services/new" className={linkClass("/dashboard/services/new")}>
              <PlusCircle size={20} />
              <span>Post New Service</span>
            </Link>
          </>
        )}

        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">
          Account
        </p>

        <Link to="/dashboard/settings" className={linkClass("/dashboard/settings")}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>

      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-white flex items-center justify-center">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user?.role || "Member"}
            </p>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;