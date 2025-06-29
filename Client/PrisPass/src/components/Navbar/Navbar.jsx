import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut, PlusCircle, Settings, ShieldCheck } from "lucide-react";
import { logout } from "../../redux/slice/AuthSlice/AuthSlice";
import MasterPasswordModal from "../Modals/PasswordModal/MasterPasswordModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [destination, setDestination] = React.useState("");

  const handleProtectedNavigation = (path) => {
    setDestination(path);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    navigate(destination);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <React.Fragment>
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            🔐 PassVault
          </h2>
          <nav className="space-y-3">
            <button
              onClick={() => handleProtectedNavigation("/dashboard/vault")}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ShieldCheck size={18} /> Vault
            </button>
            <button
              onClick={() => navigate("/dashboard/add-password")}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <PlusCircle size={18} /> Add Password
            </button>
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Settings size={18} /> Settings
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <MasterPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </React.Fragment>
  );
};

export default Navbar;