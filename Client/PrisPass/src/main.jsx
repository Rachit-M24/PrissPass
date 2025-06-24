import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { PrissStore } from "./redux/store/PrissStore.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Import your page components
import LoginPage from "./pages/authPages/LoginPage.jsx";
import SignupPage from "./pages/authPages/SignupPage.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import VaultIndex from "./components/PasswordVault/VaultIndex.jsx";
import AddPassword from "./components/Modals/AddPasswordModal/AddPassword.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    children: [
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "vault",
        element: <VaultIndex />,
      },
      {
        path: "add-password",
        element: <AddPassword />,
      },
      //{
      //  path: "vault",
      //  element: <Vault />,
      //},
      //{
      //  path: "generator",
      //  element: <Generator />,
      //},
      //{
      //  path: "settings",
      //  element: <Settings />,
      //},
      //   ],
      // },
      // {
      //   path: "*",
      //   element: <NotFound />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={PrissStore}>
      <RouterProvider router={router} />
      <App />
    </Provider>
  </React.StrictMode>
);
