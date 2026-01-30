import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import { Menu } from "lucide-react";

const MainLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  if (isDashboard) {
    return (
      <div className="flex min-h-screen bg-gray-50">
         
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
 
        <div className="flex-1 flex flex-col min-w-0">
           
          <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
             <div className="font-bold text-lg text-gray-900">Servify Dashboard</div>
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition"
             >
               <Menu size={24} />
             </button>
          </div>
 
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */} 
      <Outlet />
    </div>
  );
};

export default MainLayout;