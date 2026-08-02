import { useContext, useEffect, useState } from "react";
import { Plus } from "lucide-react";

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

      {/* Sidebar */}

      <aside
        className={`
          fixed
          lg:static
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          bg-[#171717]
          border-r
          border-slate-800
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
              ? "lg:w-20"
              : "lg:w-[280px]"
          }
          w-[280px]
        `}
      >
        <SidebarHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        {/* New Chat */}

        <div className="px-3 py-3">

          <button
            onClick={newChat}
            className="
              w-full
              h-11
              rounded-xl
              bg-[#202123]
              hover:bg-[#2b2c2f]
              transition
              flex
              items-center
              justify-center
              gap-2
              text-white
              font-medium
            "
          >
            <Plus size={18} />

            {!collapsed && (
              <span>New Chat</span>
            )}
          </button>

        </div>

        {/* Search */}

        {!collapsed && (
          <SidebarSearch
            search={search}
            setSearch={setSearch}
          />
        )}

        {/* Conversation List */}

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