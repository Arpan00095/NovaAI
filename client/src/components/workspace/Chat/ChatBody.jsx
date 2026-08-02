import {
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  Sparkles,
  Code2,
  FileText,
  Globe,
  Image,
  Database,
} from "lucide-react";

import { ConversationContext } from "../../../contexts/ConversationContext";
import { AuthContext } from "../../../contexts/AuthContext";

import MessageBubble from "./MessageBubble";

const suggestions = [
  {
    icon: <Code2 size={22} />,
    title: "Build React Dashboard",
    subtitle: "Create a modern admin dashboard",
  },
  {
    icon: <FileText size={22} />,
    title: "Write Resume",
    subtitle: "Generate an ATS-friendly resume",
  },
  {
    icon: <Database size={22} />,
    title: "Generate SQL",
    subtitle: "Write optimized SQL queries",
  },
  {
    icon: <Globe size={22} />,
    title: "Create Website",
    subtitle: "Generate landing page ideas",
  },
  {
    icon: <Image size={22} />,
    title: "Image Prompt",
    subtitle: "Create AI image prompts",
  },
];

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loadingMessage]);

  return (
    <main className="flex-1 overflow-y-auto bg-[#212121]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {messages.length === 0 ? (
          <>
            {/* Welcome */}

            <div className="text-center mb-14">

              <div className="flex justify-center mb-5">
                <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center">
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
                What would you like to build today?
              </p>

            </div>

            {/* Suggestions */}

            <div className="grid gap-4 md:grid-cols-2">

              {suggestions.map((item) => (
                <button
                  key={item.title}
                  className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-[#2a2a2a]
                    hover:bg-[#343434]
                    transition
                    p-5
                    text-left
                  "
                >
                  <div className="text-blue-400 mb-4">
                    {item.icon}
                  </div>

                  <h3 className="text-white font-semibold text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {item.subtitle}
                  </p>

                </button>
              ))}

            </div>
          </>
        ) : (
          <div className="space-y-8">

            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
              />
            ))}

            {loadingMessage && (
              <div className="flex justify-start">
                <div
                  className="
                    rounded-2xl
                    bg-[#2a2a2a]
                    border
                    border-slate-700
                    px-5
                    py-4
                    text-slate-400
                  "
                >
                  NovaAI is thinking...
                </div>
              </div>
            )}

          </div>
        )}

        <div ref={bottomRef} />

      </div>
    </main>
  );
};

export default ChatBody;