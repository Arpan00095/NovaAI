import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";


const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">

      <Navbar />

      <main className="pt-20">
        <Outlet />
      </main>

    </div>
  );
};


export default MainLayout;