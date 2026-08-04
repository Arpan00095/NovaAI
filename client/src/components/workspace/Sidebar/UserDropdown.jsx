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
          {isGuest ? "Welcome" : "Account"}
        </p>

        <p className="text-xs text-slate-400">
          {isGuest
            ? "Login to save chats and access all features"
            : "Manage your NovaAI account"}
        </p>
      </div>

      {isGuest ? (
        <>
          {/* Login */}

          <Link
            to="/login"
            className="
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
            <LogIn size={18} />
            <span>Login</span>
          </Link>

          {/* Signup */}

          <Link
            to="/signup"
            className="
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
            <UserPlus size={18} />
            <span>Create Account</span>
          </Link>

          <div className="border-t border-slate-700" />

          {/* About */}

          <Link
            to="/about"
            className="
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
            <span>About</span>
          </Link>
        </>
      ) : (
        <>
          {/* Profile */}

          <Link
            to="/profile"
            className="
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
          </Link>

          {/* Settings */}

          <Link
            to="/settings"
            className="
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
          </Link>

          {/* Appearance */}

          <Link
            to="/appearance"
            className="
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
          </Link>

          {/* About */}

          <Link
            to="/about"
            className="
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
            <span>About</span>
          </Link>

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
        </>
      )}
    </div>
  );
};

export default UserDropdown;