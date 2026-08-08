import { useContext, useEffect, useRef, useState } from "react";
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
  Zap,
  Cpu,
  Brain,
  Check,
} from "lucide-react";

import { ConversationContext } from "../../../contexts/ConversationContext";

const availableModels = [
  {
    id: "groq-llama",
    name: "Llama 3.3 70B",
    tagline: "Ultra-fast response for general tasks",
    provider: "Groq Engine",
    badge: "Fast",
    icon: Zap,
    iconColor: "text-amber-400",
  },
  {
    id: "nvidia-auto",
    name: "Nemotron AI",
    tagline: "Auto-routes 70B & 340B by complexity",
    provider: "NVIDIA Engine",
    badge: "Smart",
    icon: Brain,
    iconColor: "text-emerald-400",
  },
  {
    id: "nvidia-340b",
    name: "Nemotron 340B Ultra",
    tagline: "For heavy 3D WebGL, Math & Architecture",
    provider: "NVIDIA Engine",
    badge: "Pro",
    icon: Cpu,
    iconColor: "text-purple-400",
  },
];

const ChatHeader = ({ setMobileOpen, selectedModel, setSelectedModel }) => {
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
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const menuRef = useRef(null);
  const modelDropdownRef = useRef(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const isPinned = activeConversation?.is_pinned || false;
  const isArchived = activeConversation?.is_archived || false;

  const currentModel =
    availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(e.target)
      ) {
        setModelDropdownOpen(false);
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
    <header className="h-16 bg-transparent px-4 lg:px-6 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden h-10 w-10 rounded-lg hover:bg-white/5 flex items-center justify-center transition"
        >
          <Menu size={22} className="text-slate-300" />
        </button>

        {/* MODEL SWITCHER DROPDOWN */}
        <div className="relative" ref={modelDropdownRef}>
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/5 transition border border-transparent hover:border-white/10"
          >
            <Sparkles size={18} className="text-blue-500" />
            <span className="text-white font-semibold text-sm">
              {currentModel.name}
            </span>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                modelDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {modelDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#1e1f20] p-2 shadow-2xl z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Model Engine
              </div>

              <div className="space-y-1">
                {availableModels.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedModel === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedModel(item.id);
                        setModelDropdownOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition ${
                        isSelected
                          ? "bg-white/10 border border-white/10"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-white/5 text-white mt-0.5">
                          <IconComponent
                            size={16}
                            className={item.iconColor}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">
                              {item.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            {item.tagline}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Check size={16} className="text-blue-400 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MORE ACTIONS MENU */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition"
        >
          <MoreHorizontal size={22} className="text-slate-300" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-60 rounded-xl border border-white/10 bg-[#1e1f20] shadow-2xl overflow-hidden z-50">
            <button
              onClick={async () => {
                if (!activeConversationId) return;
                await pinChat(activeConversationId, !isPinned);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-white transition"
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
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-white transition"
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
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-white transition"
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
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-white transition"
            >
              <Download size={18} />
              Export PDF
            </button>

            <button
              onClick={() => {
                exportMarkdown();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-white transition"
            >
              <FileText size={18} />
              Export Markdown
            </button>

            <hr className="border-white/10" />

            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 text-red-400 transition"
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