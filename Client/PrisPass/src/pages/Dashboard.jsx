import { LogOut, PlusCircle, Settings, ShieldCheck, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/AuthSlice";

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dummyPasswords = [
    { site: "Google", username: "john.doe@gmail.com", password: "********" },
    { site: "GitHub", username: "johndev", password: "********" },
    { site: "Netflix", username: "johnflix", password: "********" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            🔐 PassVault
          </h2>
          <nav className="space-y-3">
            <button className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              <ShieldCheck size={18} /> Vault
            </button>
            <button className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              <PlusCircle size={18} /> Add Password
            </button>
            <button className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              <Settings size={18} /> Settings
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Welcome, {pending} 👋
        </h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Your Passwords
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                  <th className="p-3">Site</th>
                  <th className="p-3">Username</th>
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
                    <td className="p-3">{item.username}</td>
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
      </main>
    </div>
  );
};

export default DashboardPage;
