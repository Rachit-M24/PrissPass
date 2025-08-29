import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-y-auto">
        <div className="px-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
