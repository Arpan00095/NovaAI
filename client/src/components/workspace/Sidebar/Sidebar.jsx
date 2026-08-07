import { useContext, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import ConversationList from "./ConversationList";
import SidebarFooter from "./SidebarFooter";

import { ConversationContext } from "../../../contexts/ConversationContext";

const Sidebar = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const {
    conversations,
    loadingConversations,
    refreshConversations,
    newChat,
  } = useContext(ConversationContext);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - BORDER NONE for Gemini Seamless Look */}
      <aside
        className={`
          fixed
          lg:static
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          bg-[#131314]
          border-none
          transition-all
          duration-300
          ease-in-out
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${
            collapsed
              ? "lg:w-[64px]"
              : "lg:w-[260px]"
          }
          w-[260px]
        `}
      >
        <SidebarHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        {/* Action Buttons Area */}
        <div className={`py-3 flex flex-col gap-2 ${collapsed ? "px-2 items-center" : "px-3"}`}>
          {/* New Chat Button */}
          <button
            onClick={newChat}
            title="New Chat"
            className={`
              h-10
              rounded-xl
              bg-white/5
              hover:bg-white/10
              transition-all
              duration-200
              flex
              items-center
              justify-center
              gap-2.5
              text-white
              font-medium
              ${collapsed ? "w-10 p-0" : "w-full px-3"}
            `}
          >
            <Plus size={18} className="shrink-0 text-slate-200" />

            {!collapsed && (
              <span className="text-sm truncate">New Chat</span>
            )}
          </button>

          {/* Search Icon Shortcut when Collapsed (Opens Sidebar or Focuses Search) */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              title="Search"
              className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <Search size={18} />
            </button>
          )}
        </div>

        {/* Search Bar when Expanded */}
        {!collapsed && (
          <SidebarSearch
            search={search}
            setSearch={setSearch}
          />
        )}

        {/* Conversation List / Library */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            collapsed={collapsed}
            conversations={conversations}
            loading={loadingConversations}
            search={search}
          />
        </div>

        {/* Footer */}
        <SidebarFooter
          collapsed={collapsed}
        />
      </aside>
    </>
  );
};

export default Sidebar;