import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Menu,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
  Pin,
  Archive,
  Download,
  Trash2,
  Share2,
  FileText,
} from "lucide-react";

import { ConversationContext } from "../../../contexts/ConversationContext";

const ChatHeader = ({
  setMobileOpen,
}) => {
  const {
    activeConversationId,
    conversations,
    deleteChat,
    pinChat,
    shareChat,
    archiveChat,
    exportPdf,
    exportMarkdown,
  } = useContext(ConversationContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const isPinned = activeConversation?.is_pinned || false;
  const isArchived = activeConversation?.is_archived || false;

  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDelete = async () => {
    if (!activeConversationId) return;

    const ok = window.confirm("Delete this conversation?");
    if (!ok) return;

    await deleteChat(activeConversationId);
    setMenuOpen(false);
  };

  return (
    <header
      className="
        h-16
        bg-transparent
        px-4
        lg:px-6
        flex
        items-center
        justify-between
        relative
        z-10
      "
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="
            lg:hidden
            h-10
            w-10
            rounded-lg
            hover:bg-white/5
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

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            hover:bg-white/5
            transition
          "
        >
          <Sparkles
            size={18}
            className="text-blue-500"
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

      <div
        className="relative"
        ref={menuRef}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            h-10
            w-10
            rounded-xl
            hover:bg-white/5
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
              w-60
              rounded-xl
              border
              border-white/10
              bg-[#1e1f20]
              shadow-2xl
              overflow-hidden
              z-50
            "
          >
            <button
              onClick={async () => {
                if (!activeConversationId) return;
                await pinChat(activeConversationId, !isPinned);
                setMenuOpen(false);
              }}
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                hover:bg-white/5
                text-white
                transition
              "
            >
              <Pin size={18} />
              {isPinned ? "Unpin Chat" : "Pin Chat"}
            </button>

            <button
              onClick={async () => {
                if (!activeConversationId) return;
                await shareChat(activeConversationId);
                setMenuOpen(false);
              }}
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                hover:bg-white/5
                text-white
                transition
              "
            >
              <Share2 size={18} />
              Share Chat
            </button>

            <button
              onClick={async () => {
                if (!activeConversationId) return;
                await archiveChat(activeConversationId, !isArchived);
                setMenuOpen(false);
              }}
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                hover:bg-white/5
                text-white
                transition
              "
            >
              <Archive size={18} />
              {isArchived ? "Restore Chat" : "Archive Chat"}
            </button>

            <hr className="border-white/10" />

            <button
              onClick={() => {
                exportPdf();
                setMenuOpen(false);
              }}
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                hover:bg-white/5
                text-white
                transition
              "
            >
              <Download size={18} />
              Export PDF
            </button>

            <button
              onClick={() => {
                exportMarkdown();
                setMenuOpen(false);
              }}
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                hover:bg-white/5
                text-white
                transition
              "
            >
              <FileText size={18} />
              Export Markdown
            </button>

            <hr className="border-white/10" />

            <button
              onClick={handleDelete}
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                hover:bg-red-500/10
                text-red-400
                transition
              "
            >
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