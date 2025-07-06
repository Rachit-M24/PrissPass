import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Save, ArrowLeft } from "lucide-react";
import { addVaultItem } from "../../../redux/slice/vaultSlice/VaultSlice";
import { toast } from "react-toastify";

const AddPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "",
    url: "",
    password: "",
    notes: "",
    masterPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.siteName.trim() ||
      !formData.password.trim() ||
      !formData.masterPassword.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", formData);
      await dispatch(
        addVaultItem({
          masterPassword: formData.masterPassword,
          item: {
            siteName: formData.siteName,
            url: formData.url,
            password: formData.password,
            notes: formData.notes,
          },
          token: localStorage.getItem("token"),
        })
      );

      toast.success("Password added successfully!");
      navigate("/dashboard/vault");
    } catch (error) {
      console.error("Add password error:", error);
      const errorMessage =
        error.payload?.message ||
        error.message ||
        "Failed to add password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/vault")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Vault
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Lock className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Add New Password
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Store a new password securely in your vault
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name *
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Google, Facebook, GitHub"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Master Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Master Password *
              </label>
              <div className="relative">
                <input
                  type={showMasterPassword ? "text" : "password"}
                  name="masterPassword"
                  value={formData.masterPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your master password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {showMasterPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your master password is required to encrypt this password
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add any additional notes about this password"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate("/dashboard/vault")}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPassword;
