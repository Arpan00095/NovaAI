import { useContext, useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

import UserDropdown from "./UserDropdown";
import { AuthContext } from "../../../contexts/AuthContext";

const UserMenu = ({ collapsed }) => {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const rawName = user?.full_name || user?.name || "User";
  const profilePic = user?.avatar_url || user?.picture || user?.photo_url || user?.avatar;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(rawName)}&background=282a2c&color=3b82f6&bold=true`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  return (
    <div ref={menuRef} className="relative w-full flex justify-center">
      <button
        onClick={() => setOpen((prev) => !prev)}
        title={isAuthenticated ? rawName : "Guest"}
        className={`
          flex
          items-center
          transition-all
          duration-200
          rounded-xl
          hover:bg-white/5
          ${collapsed ? "h-10 w-10 justify-center p-0" : "w-full px-3 py-2 gap-3 border border-white/5 bg-white/5"}
        `}
      >
        {/* Safe Image Component */}
        <img
          src={!imgError && profilePic ? profilePic : fallbackAvatar}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          alt=""
          className="h-8 w-8 shrink-0 rounded-full object-cover border border-white/10 bg-[#282a2c]"
        />

        {!collapsed && (
          <>
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate text-xs font-medium text-white">
                {isAuthenticated ? rawName : "Guest"}
              </p>

              <p className="truncate text-[10px] text-slate-400">
                {isAuthenticated ? user?.email || "No Email" : "Not Logged In"}
              </p>
            </div>

            <ChevronUp
              size={16}
              className={`
                text-slate-400
                transition-transform
                duration-300
                ${open ? "rotate-180" : ""}
              `}
            />
          </>
        )}
      </button>

      {open && (
        <div className={`absolute z-50 ${collapsed ? "bottom-12 left-12 w-56" : "bottom-14 left-0 w-full"}`}>
          <UserDropdown onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
};

export default UserMenu;