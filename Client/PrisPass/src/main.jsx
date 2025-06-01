import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Import your page components
import LoginPage from "./pages/authPages/LoginPage.jsx";
import SignupPage from "./pages/authPages/SignupPage.jsx";
import DashboardPage from "./pages/Dashboard.jsx";

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
      // {
      //   path: "register",
      //   element: <Register />,
      // },
      // {
      //   element: <ProtectedLayout />,
      //   children: [
      //     {
      //       index: true,
      //       element: <Dashboard />,
      //     },
      //     {
      //       path: "vault",
      //       element: <Vault />,
      //     },
      //     {
      //       path: "generator",
      //       element: <Generator />,
      //     },
      //     {
      //       path: "settings",
      //       element: <Settings />,
      //     },
      //   ],
      // },
      // {
      //   path: "*",
      //   element: <NotFound />,
      // },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
