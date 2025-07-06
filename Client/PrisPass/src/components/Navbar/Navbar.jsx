import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Settings, ShieldCheck, Menu, X } from "lucide-react";
import MasterPasswordModal from "../Modals/PasswordModal/MasterPasswordModal.jsx";
import SettingsModal from "../Modals/SettingsModal/SettingsModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [destination, setDestination] = React.useState("");

  const handleProtectedNavigation = (path) => {
    setDestination(path);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const handleSuccess = () => {
    navigate(destination);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <React.Fragment>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              🔐 PassVault
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-3">
            <button
              onClick={() => handleProtectedNavigation("/dashboard/vault")}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
            >
              <ShieldCheck size={20} />
              <span className="font-medium">Vault</span>
            </button>
            <button
              onClick={() => handleNavigation("/dashboard/add-password")}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
            >
              <PlusCircle size={20} />
              <span className="font-medium">Add Password</span>
            </button>
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>Secure Password Manager</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <MasterPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </React.Fragment>
  );
};

export default Navbar;
