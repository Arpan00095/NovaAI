import { useContext } from "react";

import { ConversationContext } from "../../../contexts/ConversationContext";

import ConversationItem from "./ConversationItem";

const ConversationList = ({
  collapsed,
  conversations,
  loading,
  search,
}) => {
  const {
    activeConversationId,
    selectConversation,
  } = useContext(ConversationContext);

  const filteredChats = conversations.filter((chat) =>
    chat.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4">

      {!collapsed && (
        <h2 className="px-3 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recent Chats
        </h2>
      )}

      {loading && (
        <div className="px-3 text-sm text-slate-500">
          Loading conversations...
        </div>
      )}

      {!loading && filteredChats.length === 0 && (
        <div className="px-3 text-sm text-slate-500">
          No conversations found
        </div>
      )}

      {!loading && filteredChats.length > 0 && (
        <div className="space-y-1">

          {!collapsed ? (
            <>
              <p className="px-3 pt-2 pb-2 text-xs text-slate-500">
                Today
              </p>

              {filteredChats.map((chat) => (
                <ConversationItem
                  key={chat.id}
                  chat={chat}
                  active={
                    activeConversationId === chat.id
                  }
                  onClick={() =>
                    selectConversation(chat.id)
                  }
                />
              ))}
            </>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() =>
                  selectConversation(chat.id)
                }
                className={`
                  w-full
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  p-3
                  transition
                  ${
                    activeConversationId === chat.id
                      ? "bg-blue-600"
                      : "hover:bg-slate-800"
                  }
                `}
              >
                💬
              </button>
            ))
          )}

        </div>
      )}

    </div>
  );
};

export default ConversationList;