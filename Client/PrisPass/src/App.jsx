import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

const App = () => {
   const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <>
      <ToastContainer position="top-right" />
      <Outlet />
    </>
  );
};
export default App;
