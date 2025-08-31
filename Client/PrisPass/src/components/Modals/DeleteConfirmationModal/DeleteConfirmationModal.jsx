import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="text-red-600 dark:text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Password
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the password for{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {itemName}
                </span>
                ?
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This action cannot be undone. This will permanently delete the password
            from your vault.
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
