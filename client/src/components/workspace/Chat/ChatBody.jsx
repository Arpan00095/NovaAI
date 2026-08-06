import {
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  Sparkles,
} from "lucide-react";

import { ConversationContext } from "../../../contexts/ConversationContext";
import { AuthContext } from "../../../contexts/AuthContext";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ChatBody = () => {
  const {
    messages,
    loadingMessage,
  } = useContext(ConversationContext);

  const { user } = useContext(AuthContext);

  const userName =
    user?.full_name ||
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  // Smart Scroll Handler
  useEffect(() => {
    const isNewMessageAdded = messages.length > prevMessagesLength.current;
    prevMessagesLength.current = messages.length;

    // Jab user naya message bhejega, tabhi forcefully bottom me scroll karega
    if (isNewMessageAdded) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Streaming ke dauran check karo agar user already bottom ke paas hai tabhi smooth scroll karo
    if (loadingMessage && containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

      if (isNearBottom) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, loadingMessage]);

  return (
    <main 
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth bg-[#212121]"
    >
      {messages.length === 0 ? (

        <div className="h-full flex items-center justify-center px-6">

          <div className="text-center max-w-xl">

            <div className="flex justify-center mb-8">

              <div
                className="
                  h-16
                  w-16
                  rounded-2xl
                  bg-blue-600
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >
                <Sparkles
                  size={30}
                  className="text-white"
                />
              </div>

            </div>

            <h1 className="text-5xl font-bold text-white">
              Hello, {userName} 👋
            </h1>

            <p className="mt-5 text-lg text-slate-400">
              How can I help you today?
            </p>

          </div>

        </div>

      ) : (

        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
            />
          ))}

          {loadingMessage && (
            <TypingIndicator />
          )}

          <div ref={bottomRef} />

        </div>

      )}

    </main>
  );
};

export default ChatBody;