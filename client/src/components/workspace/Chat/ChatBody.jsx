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

  const { user, token, isAuthenticated } = useContext(AuthContext);

  // Check if User is actually logged in
  const isLoggedIn = Boolean((isAuthenticated || token) && user);

  // Dynamic Name: Logged-in user's name OR fallback to "User" for Guest Mode
  const rawName = isLoggedIn
    ? user?.full_name ||
      user?.name ||
      user?.fullName ||
      user?.username ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "User"
    : "User";

  // Format first name ("ARPAN MAJI" -> "Arpan", Guest -> "User")
  const firstName = rawName.trim().split(" ")[0];
  const formattedName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  // Smart Scroll Handler
  useEffect(() => {
    const isNewMessageAdded = messages.length > prevMessagesLength.current;
    prevMessagesLength.current = messages.length;

    if (isNewMessageAdded) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

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
      className="flex-1 overflow-y-auto scroll-smooth bg-[#131314]"
    >
      {messages.length === 0 ? (

        <div className="h-full flex items-center justify-center px-6">

          <div className="text-center max-w-2xl mx-auto flex flex-col items-center">

            {/* Glowing Gemini Badge */}
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-lg animate-pulse" />
              <div
                className="
                  relative
                  h-16
                  w-16
                  rounded-2xl
                  bg-[#1e1f20]
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  shadow-2xl
                "
              >
                <Sparkles
                  size={30}
                  className="text-blue-400"
                />
              </div>
            </div>

            {/* Gemini Multi-Color Gradient Text */}
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent">
                Hello, {formattedName}
              </span>
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-[#c4c7c5] font-normal">
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