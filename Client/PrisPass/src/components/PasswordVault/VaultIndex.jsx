import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Copy,
  Search,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchVaultItems,
  deleteVaultItem,
  editVaultItem,
} from "../../redux/slice/vaultSlice/VaultSlice";
import { toast } from "react-toastify";

const VaultIndex = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vaultItems = useSelector((state) => state.vault.vaultItems);
  const loading = useSelector((state) => state.vault.loading);

  useEffect(() => {
    dispatch(fetchVaultItems())
      .unwrap()
      .catch((error) => {
        console.log("Vault access error:", error);
      });
  }, [dispatch]);

  const [showPasswordIdx, setShowPasswordIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({
    siteName: "",
    password: "",
    url: "",
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = vaultItems.filter(
    (item) =>
      item.siteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.url && item?.url?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (password) => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({
      siteName: vaultItems[idx].siteName,
      password: vaultItems[idx].password,
      url: vaultItems[idx].url || "",
      notes: vaultItems[idx].notes || "",
    });
    setMasterPassword("");
  };

  const handleEditSave = async () => {
    const item = vaultItems[editIdx];
    await dispatch(
      editVaultItem({
        vaultId: item.vaultId,
        updatedItem: editData,
      })
    );
    setEditIdx(null);
    toast.success("Password updated successfully!");
  };

  const handleDelete = async (vaultId) => {
    await dispatch(
      deleteVaultItem({
        vaultId,
        token: localStorage.getItem("token"),
      })
    );
    toast.success("Password deleted successfully!");
  };

  const getInitials = (siteName) => {
    return siteName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Lock className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  Password Vault
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {vaultItems.length} password
                  {vaultItems.length !== 1 ? "s" : ""} stored
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/add-password")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Password</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Password Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md mx-auto">
              <Lock className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {searchTerm ? "No passwords found" : "No passwords yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Start by adding your first password"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/dashboard/add-password")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Add Your First Password
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.vaultId || idx}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(item.siteName)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {item.siteName}
                        </h3>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                          >
                            Visit site <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Password
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <span className="font-mono text-gray-800 dark:text-white flex-1">
                          {showPasswordIdx === idx
                            ? item.password
                            : "•".repeat(item.password.length)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setShowPasswordIdx(
                                showPasswordIdx === idx ? null : idx
                              )
                            }
                            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title={
                              showPasswordIdx === idx
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showPasswordIdx === idx ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy(item.password)}
                            className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Copy password"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.vaultId)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editIdx !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Edit Password
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name *
                </label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editData.siteName}
                  onChange={(e) =>
                    setEditData({ ...editData, siteName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL
                </label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editData.url || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, url: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editData.password}
                  onChange={(e) =>
                    setEditData({ ...editData, password: e.target.value })
                  }
                  type="text"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  value={editData.notes || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Add any additional notes about this password"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                onClick={() => setEditIdx(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                onClick={handleEditSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultIndex;
