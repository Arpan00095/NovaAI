import { useContext } from "react";
import { FolderClock } from "lucide-react";

import { ConversationContext } from "../../../contexts/ConversationContext";
import ConversationItem from "./ConversationItem";

const DAY = 1000 * 60 * 60 * 24;

const getGroups = (conversations = []) => {
  const now = new Date();

  const groups = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Older: [],
  };

  conversations.forEach((chat) => {
    const date = new Date(chat.updated_at || chat.created_at);
    const diff = Math.floor((now - date) / DAY);

    if (diff === 0) {
      groups.Today.push(chat);
    } else if (diff === 1) {
      groups.Yesterday.push(chat);
    } else if (diff <= 7) {
      groups["Previous 7 Days"].push(chat);
    } else if (diff <= 30) {
      groups["Previous 30 Days"].push(chat);
    } else {
      groups.Older.push(chat);
    }
  });

  return groups;
};

const ConversationList = ({
  collapsed,
  conversations = [],
  loading,
  search = "",
}) => {
  const {
    activeConversationId,
    selectConversation,
  } = useContext(ConversationContext);

  const filteredChats = conversations
    .filter((chat) => !chat?.is_archived)
    .filter((chat) =>
      chat?.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  const groupedChats = getGroups(filteredChats);

  // Collapsed Mode: Single Clean Library Icon (Gemini Style)
  if (collapsed) {
    const activeChat = filteredChats.find((c) => c.id === activeConversationId) || filteredChats[0];

    return (
      <div className="flex-1 flex flex-col items-center py-2 px-2 gap-2">
        <button
          onClick={() => activeChat && selectConversation(activeChat.id)}
          title={activeChat ? activeChat.title : "Recent Chats"}
          className="
            h-10
            w-10
            rounded-xl
            flex
            items-center
            justify-center
            bg-[#282a2c]
            text-white
            shadow-sm
            hover:bg-[#333537]
            transition
          "
        >
          <FolderClock size={18} className="text-blue-400" />
        </button>
      </div>
    );
  }

  // Expanded Mode: Full History List
  return (
    <div className="flex-1 overflow-y-auto scroll-smooth px-3 py-4">
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

      {!loading &&
        Object.entries(groupedChats).map(([group, chats]) => {
          if (chats.length === 0) return null;

          return (
            <div key={group} className="mb-6">
              <h3 className="px-3 mb-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {group}
              </h3>

              <div className="space-y-1">
                {chats.map((chat) => (
                  <ConversationItem
                    key={chat.id}
                    chat={chat}
                    active={activeConversationId === chat.id}
                    onClick={() => selectConversation(chat.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ConversationList;