import { useContext, useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

import UserDropdown from "./UserDropdown";
import { AuthContext } from "../../../contexts/AuthContext";

const UserMenu = ({ collapsed }) => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  const {
    user,
    logout,
    isAuthenticated,
  } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    setOpen(false);

    logout();

    navigate("/");
  };

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          flex
          items-center
          gap-3
          px-3
          py-3
          rounded-2xl
          border
          border-slate-800
          hover:bg-slate-800
          transition-all
          duration-200
        "
      >
        <div
          className="
            h-11
            w-11
            shrink-0
            rounded-full
            bg-blue-600
            flex
            items-center
            justify-center
            text-white
            font-bold
            text-lg
          "
        >
          {isAuthenticated
            ? user?.full_name?.charAt(0)?.toUpperCase() || "U"
            : "G"}
        </div>

        {!collapsed && (
          <>
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate font-semibold text-white">
                {isAuthenticated
                  ? user?.full_name || "User"
                  : "Guest"}
              </p>

              <p className="truncate text-sm text-slate-400">
                {isAuthenticated
                  ? user?.email || "No Email"
                  : "Not Logged In"}
              </p>
            </div>

            <ChevronUp
              size={18}
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

      {open && !collapsed && (
        <div className="absolute bottom-16 left-0 w-full z-50">
          <UserDropdown
            onLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
};

export default UserMenu;