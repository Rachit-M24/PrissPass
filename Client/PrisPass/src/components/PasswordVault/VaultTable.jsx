import React from "react";
import {
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  ViewIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const VaultTable = ({
  items,
  showPasswordIdx,
  onTogglePassword,
  onCopy,
  onView,
  onEdit,
  onDelete,
  getInitials,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="p-4">
      <div className="grid gap-4">
        {items.map((item, idx) => (
          <div
            key={item.vaultItemId}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Site Info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {getInitials(item.siteName)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {item.siteName}
                  </h4>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      {new URL(item.url).hostname}
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.notes}
                  </p>
                </div>
              </div>

              {/* Password Section */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {showPasswordIdx === idx
                    ? item.password
                    : "•".repeat(item.password.length)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePassword(idx)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPasswordIdx === idx ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(item.password)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <Copy size={16} />
                </Button>
              </div>

              {/* Dates and Actions */}
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {formatDate(item.createdDate)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Updated: {formatDate(item.modifiedDate)}
                </p>
                <div className="flex gap-2 mt-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(item.vaultItemId)}
                    className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <ViewIcon size={14} className="mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <PencilIcon size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.vaultItemId)}
                    className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2Icon size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultTable;
