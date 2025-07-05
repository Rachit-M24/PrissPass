import React, { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, Pencil, Trash2, Copy } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteVaultItem,
  editVaultItem,
} from "../../redux/slice/vaultSlice/VaultSlice";
import { toast } from "react-toastify";

const VaultIndex = () => {
  const dispatch = useDispatch();
  const vaultItems = useSelector((state) => state.vault.vaultItems);
  const loading = useSelector((state) => state.vault.loading);

  const [showPasswordIdx, setShowPasswordIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({ siteName: "", password: "" });

  const handleCopy = (password) => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied!");
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({
      siteName: vaultItems[idx].siteName,
      password: vaultItems[idx].password,
    });
  };

  const handleEditSave = async () => {
    const item = vaultItems[editIdx];
    await dispatch(
      editVaultItem({
        masterPassword: "",
        itemId: item.id,
        updatedItem: editData,
      })
    );
    setEditIdx(null);
    toast.success("Password updated!");
  };

  // Delete item
  const handleDelete = async (itemId) => {
    await dispatch(deleteVaultItem({ itemId }));
    toast.success("Deleted!");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-6 flex items-center  gap-2">
        <Lock size={24} /> Your Passwords
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
              <th className="p-4">Site</th>
              <th className="p-4">URL</th>
              <th className="p-4">Password</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaultItems.map((item, idx) => (
              <tr
                key={item.id || idx}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="p-4 font-medium align-middle">
                  <div className="flex items-center gap-2">
                    <Lock size={16} /> {item.siteName}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {item.url}
                  </a>
                </td>
                <td className="p-4 font-mono align-middle">
                  <div className="flex items-center gap-2">
                    {showPasswordIdx === idx ? (
                      <span>{item.password}</span>
                    ) : (
                      <span>{"*".repeat(item.password.length)}</span>
                    )}
                    <button
                      className="ml-2 text-gray-500 hover:text-blue-600"
                      onClick={() =>
                        setShowPasswordIdx(showPasswordIdx === idx ? null : idx)
                      }
                      aria-label="Toggle password visibility"
                    >
                      {showPasswordIdx === idx ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                    <button
                      className="ml-2 text-gray-500 hover:text-green-600"
                      onClick={() => handleCopy(item.password)}
                      aria-label="Copy password"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex gap-3">
                    <button
                      className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full p-2 transition"
                      onClick={() => setShowPasswordIdx(idx)}
                      aria-label="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-full p-2 transition"
                      onClick={() => handleEdit(idx)}
                      aria-label="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full p-2 transition"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vaultItems.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  {loading ? "Loading..." : "No passwords found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editIdx !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Password</h3>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-200">
                Site Name
              </label>
              <input
                className="w-full p-2 border rounded"
                value={editData.siteName}
                onChange={(e) =>
                  setEditData({ ...editData, siteName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-200">
                URL
              </label>
              <input
                className="w-full p-2 border rounded"
                value={editData.url || ""}
                onChange={(e) =>
                  setEditData({ ...editData, url: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                className="w-full p-2 border rounded font-mono"
                value={editData.password}
                onChange={(e) =>
                  setEditData({ ...editData, password: e.target.value })
                }
                type="text"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setEditIdx(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultIndex;
