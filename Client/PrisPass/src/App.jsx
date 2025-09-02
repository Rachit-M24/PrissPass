import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "./styles/theme.css";

const App = () => {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.add("theme-initializing");

    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("theme-initializing");
    });
  }, [theme]);
  return (
    <>
      <ToastContainer position="top-right" />
      <Outlet />
    </>
  );
};
export default App;
