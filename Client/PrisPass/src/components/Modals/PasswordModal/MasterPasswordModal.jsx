import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVaultItems } from "../../../redux/slice/vaultSlice/VaultSlice";
import { validateSession } from "../../../utils/sessionManager";

const MasterPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      checkSessionAndAccess();
    }
  }, [isOpen]);

  const checkSessionAndAccess = async () => {
    try {
      console.log("Checking session validity...");

      // we need to check the session time as your brain is synonymous of cloud
      const isSessionValid = await validateSession();

      if (isSessionValid) {
        console.log("Session is valid, attempting direct vault access...");
        const resultAction = await dispatch(fetchVaultItems({}));

        if (resultAction.meta.requestStatus === "fulfilled") {
          console.log("Direct access successful with valid session");
          onSuccess?.();
          onClose?.();
          navigate("/dashboard/vault", {
            state: { vaultItems: resultAction.payload },
          });
          return;
        }
      }

      // Keep modal open for password input
    } catch (err) {
      console.log("Session check error:", {
        status: err?.response?.status,
        message: err?.response?.data?.message,
      });

      if (err?.response?.status === 401) {
        navigate("/");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your master password");
      return;
    }

    try {
      const resultAction = await dispatch(
        fetchVaultItems({ masterPassword: password })
      );

      if (resultAction.meta.requestStatus === "fulfilled") {
        setPassword("");
        onSuccess?.();
        onClose?.();
        navigate("/dashboard/vault", {
          state: { vaultItems: resultAction.payload },
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Incorrect master password");
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
