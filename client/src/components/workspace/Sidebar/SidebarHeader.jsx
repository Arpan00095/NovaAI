import {
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const SidebarHeader = ({
  collapsed,
  setCollapsed,
  setMobileOpen,
}) => {
  return (
    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-4">

      {/* Left */}

      <div className="flex items-center gap-3">

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            hidden
            lg:flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            hover:bg-slate-800
            transition
          "
        >
          <Menu
            size={22}
            className="text-slate-300"
          />
        </button>

        <button
          onClick={() => setMobileOpen(false)}
          className="
            lg:hidden
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-lg
            hover:bg-slate-800
            transition
          "
        >
          <X
            size={22}
            className="text-slate-300"
          />
        </button>

        {!collapsed && (
          <>
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Sparkles
                size={20}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-white text-xl font-bold">
                NovaAI
              </h1>

              <p className="text-xs text-slate-500">
                AI Workspace
              </p>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default SidebarHeader;