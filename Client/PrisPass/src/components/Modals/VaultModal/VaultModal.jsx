import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Save, X } from "lucide-react";
import {
  addVaultItem,
  editVaultItem,
  fetchVaultItemById,
  fetchVaultItems,
} from "../../../redux/slice/vaultSlice/VaultSlice";
import { toast } from "react-toastify";
import MasterPasswordModal from "../PasswordModal/MasterPasswordModal";

const VaultModal = ({
  isOpen,
  onClose,
  mode = "add", // "add", "edit", "view"
  item = null,
  vaultId = null,
}) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "",
    password: "",
    url: "",
    notes: "",
  });
  const [masterPasswordData, setMasterPasswordData] = useState({
    showModal: false,
    password: "",
  });

  useEffect(() => {
    if (isOpen && mode === "edit" && item) {
      setFormData({
        siteName: item.siteName || "",
        password: item.password || "",
        url: item.url || "",
        notes: item.notes || "",
      });
    } else if (isOpen && mode === "view" && item) {
      setFormData({
        siteName: item.siteName || "",
        password: item.password || "",
        url: item.url || "",
        notes: item.notes || "",
      });
    } else if (isOpen && mode === "add") {
      setFormData({
        siteName: "",
        password: "",
        url: "",
        notes: "",
      });
    }
  }, [isOpen, mode, item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.siteName.trim() || !formData.password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        siteName: formData.siteName,
        url: formData.url,
        password: formData.password,
        notes: formData.notes,
      };

      if (masterPasswordData.password) {
        payload.masterPassword = masterPasswordData.password;
      }

      if (mode === "add") {
        const result = await dispatch(addVaultItem({ item: payload })).unwrap();
        if (result) {
          toast.success("Password added successfully!");
          dispatch(fetchVaultItems())
            .unwrap()
            .catch((error) => {
              console.log("Vault access error:", error);
            });
          onClose();
        }
      } else if (mode === "edit") {
        const result = await dispatch(
          editVaultItem({
            vaultId: item.vaultItemId,
            updatedItem: payload,
          })
        ).unwrap();
        if (result) {
          toast.success("Password updated successfully!");
          onClose();
        }
      }
    } catch (error) {
      if (error.requiresMasterPassword) {
        setMasterPasswordData((prev) => ({ ...prev, showModal: true }));
      } else {
        toast.error(error.message || "Operation failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Password";
      case "edit":
        return "Edit Password";
      case "view":
        return "Password Details";
      default:
        return "Password";
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case "add":
        return "Add Password";
      case "edit":
        return "Update Password";
      default:
        return "Save";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {masterPasswordData.showModal && (
        <MasterPasswordModal
          isOpen={masterPasswordData.showModal}
          onClose={() =>
            setMasterPasswordData((prev) => ({ ...prev, showModal: false }))
          }
          onSubmit={async (password) => {
            setMasterPasswordData({ showModal: false, password });
            handleSubmit(new Event("submit"));
          }}
        />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md h-auto transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">
              {getModalTitle()}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 tracking-wide">
                Site Name *
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                placeholder="e.g., Google, Facebook, GitHub"
                required
                readOnly={mode === "view"}
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 tracking-wide">
                URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                placeholder="https://example.com"
                readOnly={mode === "view"}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 tracking-wide">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                  readOnly={mode === "view"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 tracking-wide">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none"
                placeholder="Add any additional notes about this password"
                readOnly={mode === "view"}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="flex-1 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              {mode !== "view" && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {getSubmitButtonText()}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VaultModal;
