import { useState } from "react";


const ChatSidebar = ({
  chats,
  activeChat,
  startNewChat,
  selectChat,
  renameChat,
  deleteChat
}) => {


  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");



  const handleRename = (id) => {

    if (!title.trim()) return;


    renameChat(id, title);


    setEditingId(null);

    setTitle("");

  };




  return (
    <aside
      className="
        w-72
        h-full
        bg-slate-900
        border-r
        border-slate-800
        flex
        flex-col
      "
    >


      {/* Header */}
      <div
        className="
          p-5
          border-b
          border-slate-800
        "
      >

        <h2 className="text-xl font-bold text-white">
          NovaAI 🤖
        </h2>

      </div>





      {/* New Chat */}
      <div className="p-4">

        <button
          onClick={startNewChat}
          className="
            w-full
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-medium
          "
        >
          + New Chat
        </button>

      </div>






      {/* Chat List */}
      <div
        className="
          flex-1
          overflow-y-auto
          px-4
          space-y-2
        "
      >


        {chats.map((chat) => (

          <div
            key={chat.id}
            className={`
              group
              flex
              items-center
              justify-between
              rounded-lg
              px-3
              py-2
              ${
                activeChat === chat.id
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }
            `}
          >


            {
              editingId === chat.id ? (

                <input
                  autoFocus
                  value={title}
                  onChange={(e)=>setTitle(e.target.value)}
                  onBlur={()=>handleRename(chat.id)}
                  onKeyDown={(e)=>{

                    if(e.key==="Enter"){
                      handleRename(chat.id);
                    }

                  }}
                  className="
                    bg-slate-700
                    text-white
                    px-2
                    rounded
                    w-full
                    outline-none
                  "
                />

              ) : (

                <button
                  onClick={() => selectChat(chat)}
                  className="
                    text-left
                    text-sm
                    text-white
                    flex-1
                    truncate
                  "
                >
                  💬 {chat.title}
                </button>

              )

            }





            <div
              className="
                hidden
                group-hover:flex
                gap-2
                ml-2
              "
            >

              {/* Rename */}
              <button
                onClick={() => {

                  setEditingId(chat.id);

                  setTitle(chat.title);

                }}
                className="text-xs"
              >
                ✏️
              </button>



              {/* Delete */}
              <button
                onClick={() => deleteChat(chat.id)}
                className="text-xs"
              >
                🗑️
              </button>


            </div>


          </div>


        ))}


      </div>






      {/* User */}
      <div
        className="
          p-4
          border-t
          border-slate-800
        "
      >

        <div className="text-sm text-slate-300">
          👤 Arpan
        </div>

      </div>


    </aside>
  );
};


export default ChatSidebar;