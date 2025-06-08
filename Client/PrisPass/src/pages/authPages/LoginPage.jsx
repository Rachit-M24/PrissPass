import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/AuthSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    masterPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(credentials)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          Login
        </h2>

        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="masterPassword"
            id="masterPassword"
            required
            value={credentials.masterPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          <div
            className="absolute top-9 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
