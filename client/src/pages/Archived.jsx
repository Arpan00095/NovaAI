import { useContext } from "react";
import { ArchiveRestore } from "lucide-react";

import { ConversationContext } from "../contexts/ConversationContext";

const Archived = () => {
  const {
    archivedConversations,
    archiveChat,
  } = useContext(ConversationContext);

  return (
    <div className="min-h-screen bg-[#171717] text-white p-8">

      <h1 className="text-3xl font-bold mb-8">
        Archived Chats
      </h1>

      {archivedConversations.length === 0 ? (
        <div className="text-slate-400">
          No archived chats.
        </div>
      ) : (
        <div className="space-y-4">

          {archivedConversations.map((chat) => (

            <div
              key={chat.id}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-slate-700
                bg-[#222]
                p-4
              "
            >

              <div>

                <h2 className="font-semibold">
                  {chat.title}
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  {new Date(
                    chat.updated_at
                  ).toLocaleString()}
                </p>

              </div>

              <button
                onClick={() =>
                  archiveChat(
                    chat.id,
                    false
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  hover:bg-blue-700
                  px-4
                  py-2
                  transition
                "
              >
                <ArchiveRestore size={18} />

                Restore

              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Archived;