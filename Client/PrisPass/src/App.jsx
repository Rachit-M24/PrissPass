import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" />
      <Outlet />
    </>
  );
};
export default App;
