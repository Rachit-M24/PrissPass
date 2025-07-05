import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getVault } from "../../../redux/slice/vaultSlice/VaultSlice";

const MasterPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password) {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const resultAction = await dispatch(
          getVault({ masterPassword: password, token })
        );
        if (resultAction.meta.requestStatus === "fulfilled") {
          setPassword("");
          onSuccess && onSuccess();
          onClose && onClose();
          navigate("/dashboard/vault", {
            state: { vaultItems: resultAction.payload.data },
          });
        } else {
          setError("Incorrect master password");
        }
      } catch (err) {
        setError("An error occurred");
      }
    } else {
      setError("Incorrect master password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Enter Master Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Master Password"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterPasswordModal;
