import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="h-screen bg-slate-950 overflow-hidden">
      <Outlet />
    </div>
  );
};

export default MainLayout;