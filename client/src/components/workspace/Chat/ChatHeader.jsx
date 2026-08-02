import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
  Pin,
  Pencil,
  Download,
  Trash2,
  Share2,
} from "lucide-react";

const ChatHeader = ({
  setMobileOpen,
}) => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  return (
    <header
      className="
        h-16
        border-b
        border-slate-800
        bg-[#171717]
        px-4
        lg:px-6
        flex
        items-center
        justify-between
        relative
      "
    >
      {/* Left */}

      <div className="flex items-center gap-3">

        {/* Mobile Sidebar */}

        <button
          onClick={() => setMobileOpen(true)}
          className="
            lg:hidden
            h-10
            w-10
            rounded-lg
            hover:bg-slate-800
            flex
            items-center
            justify-center
            transition
          "
        >
          <Menu
            size={22}
            className="text-slate-300"
          />
        </button>

        {/* Model */}

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            hover:bg-slate-800
            transition
          "
        >
          <Sparkles
            size={18}
            className="text-blue-400"
          />

          <span className="text-white font-semibold">
            NovaAI
          </span>

          <ChevronDown
            size={16}
            className="text-slate-400"
          />
        </button>

      </div>

      {/* Right */}

      <div
        className="relative"
        ref={menuRef}
      >
        <button
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="
            h-10
            w-10
            rounded-xl
            hover:bg-slate-800
            flex
            items-center
            justify-center
            transition
          "
        >
          <MoreHorizontal
            size={22}
            className="text-slate-300"
          />
        </button>

        {menuOpen && (
          <div
            className="
              absolute
              right-0
              mt-2
              w-56
              rounded-xl
              border
              border-slate-700
              bg-[#222]
              shadow-2xl
              overflow-hidden
              z-50
            "
          >
            <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-white">
              <Pin size={18} />
              Pin Chat
            </button>

            <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-white">
              <Pencil size={18} />
              Rename Chat
            </button>

            <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-white">
              <Share2 size={18} />
              Share Chat
            </button>

            <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-white">
              <Download size={18} />
              Export Chat
            </button>

            <hr className="border-slate-700" />

            <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-600 text-red-400 hover:text-white">
              <Trash2 size={18} />
              Delete Chat
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;