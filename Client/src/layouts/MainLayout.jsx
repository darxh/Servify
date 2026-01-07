import { Outlet } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default MainLayout;