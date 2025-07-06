import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to vault since settings are now handled via modal
    navigate("/dashboard/vault");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
};

export default Settings;
