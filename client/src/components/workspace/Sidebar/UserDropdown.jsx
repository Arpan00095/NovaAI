import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  Palette,
} from "lucide-react";

const UserDropdown = ({ onLogout }) => {
  return (
    <div
      className="
        w-full
        rounded-2xl
        bg-slate-900
        border
        border-slate-700
        shadow-2xl
        overflow-hidden
        backdrop-blur-xl
      "
    >
      {/* Header */}

      <div className="px-4 py-3 border-b border-slate-700">
        <p className="text-sm font-semibold text-white">
          Account
        </p>

        <p className="text-xs text-slate-400">
          Manage your NovaAI account
        </p>
      </div>

      {/* Menu */}

      <button
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          text-slate-200
          hover:bg-slate-800
          transition
        "
      >
        <User size={18} />

        <span>Profile</span>
      </button>

      <button
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          text-slate-200
          hover:bg-slate-800
          transition
        "
      >
        <Settings size={18} />

        <span>Settings</span>
      </button>

      <button
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          text-slate-200
          hover:bg-slate-800
          transition
        "
      >
        <Palette size={18} />

        <span>Appearance</span>
      </button>

      <button
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          text-slate-200
          hover:bg-slate-800
          transition
        "
      >
        <HelpCircle size={18} />

        <span>Help</span>
      </button>

      <div className="border-t border-slate-700" />

      {/* Logout */}

      <button
        onClick={onLogout}
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          text-red-400
          hover:bg-red-500/10
          transition
        "
      >
        <LogOut size={18} />

        <span>Logout</span>
      </button>
    </div>
  );
};

export default UserDropdown;