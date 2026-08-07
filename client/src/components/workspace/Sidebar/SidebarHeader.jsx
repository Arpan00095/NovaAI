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
    <div className={`h-16 flex items-center border-none ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}>

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
            rounded-xl
            hover:bg-white/5
            transition
          "
        >
          <Menu
            size={20}
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
            rounded-xl
            hover:bg-white/5
            transition
          "
        >
          <X
            size={20}
            className="text-slate-300"
          />
        </button>

        {!collapsed && (
          <>
            <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles
                size={18}
                className="text-blue-400"
              />
            </div>

            <div>
              <h1 className="text-white text-lg font-bold tracking-tight">
                NovaAI
              </h1>

              <p className="text-[10px] text-slate-400 -mt-0.5">
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