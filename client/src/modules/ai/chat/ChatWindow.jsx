import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatWindow = ({ messages, sendMessage, isTyping }) => {

    return (
        <section
            className="
        h-full
        flex
        flex-col
        bg-slate-950
      "
        >


            {/* Header */}
            <div
                className="
          h-16
          flex
          items-center
          px-6
          border-b
          border-slate-800
          bg-slate-900
        "
            >

                <div>

                    <h1
                        className="
              text-lg
              font-semibold
              text-white
            "
                    >
                        NovaAI Assistant 🤖
                    </h1>


                    <p
                        className="
              text-sm
              text-slate-400
            "
                    >
                        Your AI productivity companion
                    </p>

                </div>

            </div>



            {/* Messages */}
            <div
                className="
          flex-1
          overflow-y-auto
        "
            >

                <MessageList
                    messages={messages}
                    isTyping={isTyping}
                />

            </div>



            {/* Input */}
            <div
                className="
          border-t
          border-slate-800
          bg-slate-900
          p-4
        "
            >

                <MessageInput
                    sendMessage={sendMessage}
                />

            </div>


        </section>
    );
};


export default ChatWindow;