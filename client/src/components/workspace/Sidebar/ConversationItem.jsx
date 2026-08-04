import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { ConversationContext } from "../../../contexts/ConversationContext";

const ConversationItem = ({
  chat,
  active,
  onClick,
}) => {
  const {
    renameChat,
    deleteChat,
  } = useContext(ConversationContext);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const inputRef = useRef(null);
  const menuRef = useRef(null);

  // ==========================
  // Sync Title
  // ==========================

  useEffect(() => {
    setTitle(chat.title);
  }, [chat.title]);

  // ==========================
  // Focus Input
  // ==========================

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  // ==========================
  // Close Menu Outside Click
  // ==========================

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);

  // ==========================
  // Save Rename
  // ==========================

  const saveRename = async () => {
    const newTitle = title.trim();

    if (
      !newTitle ||
      newTitle === chat.title
    ) {
      setTitle(chat.title);
      setEditing(false);
      return;
    }

    try {
      await renameChat(chat.id, newTitle);
    } finally {
      setEditing(false);
    }
  };

  // ==========================
  // Delete Chat
  // ==========================

  const handleDelete = async () => {
    const ok = window.confirm(
      "Delete this conversation?"
    );

    if (!ok) return;

    await deleteChat(chat.id);
  };

  return (
    <div
      ref={menuRef}
      className="relative group"
    >
      <button
        onClick={
          editing ? undefined : onClick
        }
        className={`
          w-full
          flex
          items-center
          gap-3
          rounded-xl
          px-3
          py-3
          text-left
          transition-all
          duration-200
          ${active
            ? "bg-blue-600 text-white"
            : "hover:bg-slate-800 text-slate-200"
          }
        `}
      >
        <MessageSquare
          size={18}
          className={
            active
              ? "text-white shrink-0"
              : "text-slate-400 shrink-0"
          }
        />

        {editing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            onBlur={saveRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveRename();
              }

              if (e.key === "Escape") {
                setTitle(chat.title);
                setEditing(false);
              }
            }}
            className="
              flex-1
              bg-transparent
              outline-none
              border-b
              border-blue-500
              text-white
            "
          />
        ) : (
          <span
            className="flex-1 truncate"
            onDoubleClick={() =>
              setEditing(true)
            }
          >
            {chat.title}
          </span>
        )}

        {!editing && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className={`
                 cursor-pointer
                 transition
                 ${active
                ? "text-white"
                : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white"
              }
            `}
          >
            <MoreHorizontal size={18} />
          </div>
        )}
      </button>

      {open && (
        <div
          className="
            absolute
            top-12
            right-2
            w-44
            rounded-xl
            bg-[#202123]
            border
            border-slate-700
            shadow-2xl
            overflow-hidden
            z-50
          "
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setEditing(true);
            }}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              hover:bg-slate-800
              text-white
            "
          >
            <Pencil size={16} />
            Rename
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              handleDelete();
            }}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              text-red-400
              hover:bg-red-500/10
            "
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationItem;