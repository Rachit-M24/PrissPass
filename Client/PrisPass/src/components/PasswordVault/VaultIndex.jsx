import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Lock } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import VaultTable from "./VaultTable";
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
    mode: "add",
    item: null,
    vaultId: null,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = Array.isArray(vaultItems)
    ? vaultItems.filter(
        (item) =>
          item.siteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.url && item?.url?.toLowerCase().includes(searchTerm.toLowerCase()))
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 font-sans">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white p-6 flex items-center justify-between shadow-xl rounded-b-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 dark:bg-gray-800/20 rounded-xl shadow-md">
            <Lock className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Password Vault</h1>
            <p className="text-blue-100 dark:text-blue-300 text-sm">
              {vaultItems.length} password{vaultItems.length !== 1 ? "s" : ""} stored
            </p>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-700 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Password</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mt-6">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={20}
        />
        <input
          type="text"
          placeholder="Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-700 dark:text-gray-300"
        />
      </div>

      {/* Table or Empty State */}
      <div className="mt-8 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 dark:border-blue-400"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl max-w-md mx-auto">
                <Lock className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {searchTerm ? "No passwords found" : "No passwords yet"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Start by adding your first password"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={handleAdd}
                    className="bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-900 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Add Your First Password
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <VaultTable
              items={filteredItems}
              showPasswordIdx={showPasswordIdx}
              onTogglePassword={(idx) => setShowPasswordIdx(idx === showPasswordIdx ? null : idx)}
              onCopy={handleCopy}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getInitials={getInitials}
            />
          )}
        </div>
      </div>

      {/* Modals */}
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
