import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, CalendarCheck, Briefcase, Settings,
  LogOut, PlusCircle, User, Home, X
} from "lucide-react";
 
const Sidebar = ({ isOpen, onClose }) => {
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
    ${isActive(path) ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}
  `;

  return (
    <> 
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
 
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block
      `}>
 
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">Servify</span>
          </Link> 
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>
 
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Overview</p>
          <Link to="/" className={linkClass("/")} onClick={onClose}><Home size={20} /><span>Home</span></Link>
          <Link to="/dashboard" className={linkClass("/dashboard")} onClick={onClose}><LayoutDashboard size={20} /><span>Dashboard</span></Link>
          <Link to="/dashboard/bookings" className={linkClass("/dashboard/bookings")} onClick={onClose}><CalendarCheck size={20} /><span>My Bookings</span></Link>

          {(user?.role === "provider" || user?.role === "admin") && (
            <>
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Provider Tools</p>
              <Link to="/dashboard/services" className={linkClass("/dashboard/services")} onClick={onClose}><Briefcase size={20} /><span>My Services</span></Link>
              <Link to="/dashboard/services/new" className={linkClass("/dashboard/services/new")} onClick={onClose}><PlusCircle size={20} /><span>Post Service</span></Link>
            </>
          )}

          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Account</p>
          <Link to="/dashboard/settings" className={linkClass("/dashboard/settings")} onClick={onClose}><Settings size={20} /><span>Settings</span></Link>
        </nav>
 
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-white flex items-center justify-center">
              {user?.profileImage ? <img src={user.profileImage} className="h-full w-full object-cover" /> : <User size={20} className="text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;