import { useContext } from "react";
import { Link } from "react-router-dom";

import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  Palette,
  LogIn,
  UserPlus,
} from "lucide-react";

import { AuthContext } from "../../../contexts/AuthContext";

const UserDropdown = ({ onLogout }) => {
  const { user, token } = useContext(AuthContext);
  const isGuest = !token || !user;

  return (
    <div
      className="
        w-full
        rounded-2xl
        bg-[#1e1f20]
        border
        border-white/10
        shadow-2xl
        overflow-hidden
        backdrop-blur-xl
        text-sm
      "
    >
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-xs font-semibold text-white">
          {isGuest ? "Welcome" : "Account"}
        </p>

        <p className="text-[10px] text-slate-400 mt-0.5">
          {isGuest
            ? "Login to save chats"
            : "Manage your account"}
        </p>
      </div>

      {isGuest ? (
        <>
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/5 transition"
          >
            <LogIn size={16} />
            <span>Login</span>
          </Link>

          <Link
            to="/signup"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/5 transition"
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </Link>

          <div className="border-t border-white/5" />

          <Link
            to="/about"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/5 transition"
          >
            <HelpCircle size={16} />
            <span>About</span>
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/5 transition"
          >
            <User size={16} />
            <span>Profile</span>
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/5 transition"
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>

          <Link
            to="/appearance"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/5 transition"
          >
            <Palette size={16} />
            <span>Appearance</span>
          </Link>

          <Link
            to="/about"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-200 hover:bg-white/5 transition"
          >
            <HelpCircle size={16} />
            <span>About</span>
          </Link>

          <div className="border-t border-white/5" />

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </>
      )}
    </div>
  );
};

export default UserDropdown;