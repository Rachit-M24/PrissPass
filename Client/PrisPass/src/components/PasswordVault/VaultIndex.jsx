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
  Eye as ViewIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteVaultItem,
  fetchVaultItems,
  fetchVaultItemById,
} from "../../redux/slice/vaultSlice/VaultSlice";
import { toast } from "react-toastify";
import VaultModal from "../Modals/VaultModal/VaultModal";
import { Button } from "@/components/ui/button";


const VaultIndex = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vaultItems = useSelector((state) => state.vault.vaultItems);
  const loading = useSelector((state) => state.vault.loading);
  const selectedItem = useSelector((state) => state.vault.selectedItem);

  useEffect(() => {
    dispatch(fetchVaultItems())
      .unwrap()
      .catch((error) => {
        console.log("Vault access error:", error);
      });
  }, [dispatch]);

  const [showPasswordIdx, setShowPasswordIdx] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "add", // "add", "edit", "view"
    item: null,
    vaultId: null,
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

  const handleView = async (vaultId) => {
    try {
      await dispatch(fetchVaultItemById({ vaultId })).unwrap();
      setModalConfig({
        isOpen: true,
        mode: "view",
        item: selectedItem,
        vaultId,
      });
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Failed to fetch item details");
    }
  };

  const handleEdit = (item) => {
    setModalConfig({
      isOpen: true,
      mode: "edit",
      item,
      vaultId: item.vaultId,
    });
  };

  const handleAdd = () => {
    setModalConfig({
      isOpen: true,
      mode: "add",
      item: null,
      vaultId: null,
    });
  };

  const [masterPasswordModalOpen, setMasterPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleDelete = async (vaultId) => {
    try {
      const result = await dispatch(deleteVaultItem({ vaultId })).unwrap();
      if (result) {
        toast.success("Password deleted successfully");
      }
    } catch (error) {
      if (error.requiresMasterPassword) {
        setPendingAction({ type: "delete", vaultId });
        setMasterPasswordModalOpen(true);
      } else {
        toast.error(error.message || "Failed to delete password");
      }
    }
  };

  const handleMasterPasswordSubmit = async (password) => {
    if (!pendingAction) return;

    try {
      switch (pendingAction.type) {
        case "delete":
          await dispatch(
            deleteVaultItem({
              vaultId: pendingAction.vaultId,
              masterPassword: password,
            })
          ).unwrap();
          toast.success("Password deleted successfully");
          break;
        case "view":
          await handleView(pendingAction.vaultId, password);
          break;
        case "edit":
          await handleEdit(pendingAction.item, password);
          break;
      }
      setMasterPasswordModalOpen(false);
      setPendingAction(null);
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, mode: "add", item: null, vaultId: null });
    setMasterPasswordModalOpen(false);
    setPendingAction(null);
  };

  const getInitials = (siteName) => {
    if (!siteName) return "";
    return siteName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4">
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
              onClick={handleAdd}
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

        {/* Password Grid */}
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
                  onClick={handleAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Add Your First Password
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item, idx) => (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden group transition-all duration-300" key={item.vaultItemId}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(item.siteName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate">
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
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Password
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="font-mono text-gray-800 dark:text-white flex-1 text-sm">
                        {showPasswordIdx === idx
                          ? item.password
                          : "•".repeat(Math.min(item.password.length, 12))}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setShowPasswordIdx(
                              showPasswordIdx === idx ? null : idx
                            )
                          }
                        >
                          {showPasswordIdx === idx ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(item.password)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleView(item.vaultItemId)}
                    >
                      <ViewIcon size={14} /> View
                    </Button>
                    <Button variant="outline" onClick={() => handleEdit(item)}>
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(item.vaultItemId)}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Common Modal */}
      <VaultModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        mode={modalConfig.mode}
        item={modalConfig.item}
        vaultId={modalConfig.vaultId}
      />
    </div>
  );
};

export default VaultIndex;
