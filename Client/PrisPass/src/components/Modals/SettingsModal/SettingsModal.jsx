import React, { useState } from "react";
import { X, LogOut, User, Shield, Bell, HelpCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slice/AuthSlice/AuthSlice";
import { toggleTheme } from "../../../redux/slice/themeSlice/ThemeSlice";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosConfig";

const SettingsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { theme } = useSelector((state) => state.theme);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await axios.post("/api/Auth/logout");
    dispatch(logout());
    navigate("/");
    toast.success("Logged out successfully!");
    setShowLogoutConfirm(false);
    onClose();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <User size={20} />
                Profile
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300">
                    Account Type
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Premium
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300">
                    Last Login
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Today
                  </span>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Shield size={20} />
                Security
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">
                    Change Master Password
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    →
                  </span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">
                    Two-Factor Authentication
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Disabled
                  </span>
                </button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Bell size={20} />
                Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </span>
                  <button
                    onClick={() => dispatch(toggleTheme())}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      theme === "dark" ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">
                    Auto-Lock Timeout
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    5 minutes
                  </span>
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <HelpCircle size={20} />
                Help & Support
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">
                    Documentation
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    →
                  </span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-700 dark:text-gray-300">
                    Contact Support
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* Logout Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-all duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <LogOut
                    className="text-red-600 dark:text-red-400"
                    size={24}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Confirm Logout
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to log out? You'll need to enter your
                master password again to access your vault.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
