import { Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";

import UserMenu from "./UserMenu";

const SidebarFooter = ({
  collapsed,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        border-t
        border-slate-800
        p-4
        space-y-3
      "
    >
      <button
        onClick={() => navigate("/archived")}
        className="
          w-full
          h-11
          rounded-xl
          flex
          items-center
          gap-3
          px-3
          text-slate-300
          hover:bg-slate-800
          transition
        "
      >
        <Archive size={18} />

        {!collapsed && (
          <span>Archived</span>
        )}
      </button>

      <UserMenu
        collapsed={collapsed}
      />
    </div>
  );
};

export default SidebarFooter;