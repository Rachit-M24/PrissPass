import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    console.log('Registered:', user);
    alert('Account created! Now go sign in 😎');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Create an Account</h2>

        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            required
            value={user.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a strong one 💪"
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
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/')}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
