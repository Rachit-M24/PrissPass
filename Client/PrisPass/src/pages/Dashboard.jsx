import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Navbar />
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Welcome, 👋
        </h1>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;