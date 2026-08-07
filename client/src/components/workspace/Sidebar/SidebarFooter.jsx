import { Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";

import UserMenu from "./UserMenu";

const SidebarFooter = ({ collapsed }) => {
  const navigate = useNavigate();

  return (
    <div className={`border-t border-white/5 space-y-2 ${collapsed ? "p-2 flex flex-col items-center" : "p-3"}`}>
      <button
        onClick={() => navigate("/archived")}
        title="Archived"
        className={`
          rounded-xl
          flex
          items-center
          justify-center
          text-slate-300
          hover:bg-white/5
          hover:text-white
          transition
          ${collapsed ? "h-10 w-10 p-0" : "w-full h-10 px-3 gap-3 justify-start"}
        `}
      >
        <Archive size={18} className="shrink-0" />

        {!collapsed && <span className="text-sm">Archived</span>}
      </button>

      <UserMenu collapsed={collapsed} />
    </div>
  );
};

export default SidebarFooter;