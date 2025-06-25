import React from "react";

const AddPassword = () => {
  return (
    <React.Fragment>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
          Add New Password
        </h2>
        <form className="space-y-4" method="POST"  action="/api/AddVaultItem">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
              Site
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="e.g., Google"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
              URL
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="e.g., https://google.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
              Encrypted Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Enter encrypted password"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
              Notes
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Add notes"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Password
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default AddPassword;