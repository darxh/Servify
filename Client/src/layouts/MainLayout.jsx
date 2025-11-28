import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
        
      <aside className="hidden w-64 bg-white shadow-md md:flex md:flex-col">
        <div className="flex h-16 items-center justify-center border-b px-4">
          <h2 className="text-2xl font-bold text-blue-600">Servify</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-gray-500">Navigation Placeholder</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-700">Dashboard</div>

          <div className="h-8 w-8 rounded-full bg-blue-100"></div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
