import React from "react";
import { Lock } from "lucide-react";

const VaultIndex = () => {
  const dummyPasswords = [
    { site: "Google", password: "********" },
    { site: "GitHub", password: "********" },
    { site: "Netflix", password: "********" },
  ];
  return (
    <React.Fragment>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
          Your Passwords
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                <th className="p-3">Site</th>
                <th className="p-3">Password</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyPasswords.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="p-3 flex items-center gap-2">
                    <Lock size={16} /> {item.site}
                  </td>
                  <td className="p-3">{item.password}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-blue-600 hover:underline text-sm">
                      View
                    </button>
                    <button className="text-yellow-600 hover:underline text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VaultIndex;