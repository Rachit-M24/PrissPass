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
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import VaultTable from "./VaultTable";

const VaultIndex = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vaultItems = useSelector((state) => state.vault.vaultItems ?? []);
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

  const filteredItems = Array.isArray(vaultItems)
    ? vaultItems.filter(
        (item) =>
          item.siteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.url &&
            item?.url?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const handleCopy = (password) => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const handleView = async (vaultId) => {
    try {
      setModalConfig({
        isOpen: true,
        mode: "view",
        item: await dispatch(fetchVaultItemById({ vaultId })).unwrap(),
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
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    vaultId: null
  });

  const handleDelete = async (vaultId) => {
    const item = vaultItems.find(item => item.vaultId === vaultId);
    setDeleteModal({
      isOpen: true,
      item,
      vaultId // Store the vaultId explicitly
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.vaultId) {
      console.error('No vaultId provided for deletion');
      return;
    }

    try {
      const result = await dispatch(deleteVaultItem({ vaultId: deleteModal.vaultId })).unwrap();
      if (result) {
        toast.success("Password deleted successfully");
        setDeleteModal({ isOpen: false, item: null, vaultId: null });
      }
    } catch (error) {
      if (error.requiresMasterPassword) {
        setPendingAction({ type: "delete", vaultId: deleteModal.vaultId });
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
        {/* Header Section - Keep existing header */}
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

          {/* Search Bar - Keep existing search */}
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

        {/* Table View */}
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
          <VaultTable
            items={filteredItems}
            showPasswordIdx={showPasswordIdx}
            onTogglePassword={(idx) => setShowPasswordIdx(showPasswordIdx === idx ? null : idx)}
            onCopy={handleCopy}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getInitials={getInitials}
          />
        )}
      </div>

      {/* Keep existing modals */}
      <VaultModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        mode={modalConfig.mode}
        item={modalConfig.item}
        vaultId={modalConfig.vaultId}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, vaultId: null })}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.siteName}
      />
    </div>
  );
};

export default VaultIndex;
