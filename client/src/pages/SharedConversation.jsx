import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { Sparkles } from "lucide-react";

import { getSharedConversation } from "../services/conversation.service";

const SharedConversation = () => {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const data = await getSharedConversation(token);

        setConversation(data.conversation);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Conversation not found."
        );
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#171717] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          {error}
        </h2>

        <Link
          to="/"
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-[#171717] text-white">
      <header className="border-b border-slate-800 bg-[#171717]">
        <div className="max-w-4xl mx-auto h-16 flex items-center gap-2 px-6">
          <Sparkles className="text-blue-400" size={20} />

          <span className="font-bold text-lg">
            NovaAI Shared Chat
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 pb-24">
        <h1 className="text-2xl font-bold mb-8">
          {conversation.title}
        </h1>

        <div className="space-y-6">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl p-5 ${
                msg.role === "user"
                  ? "bg-slate-800"
                  : "bg-[#222]"
              }`}
            >
              <p className="text-xs uppercase text-slate-400 mb-2">
                {msg.role}
              </p>

              {msg.content && (
                <p className="whitespace-pre-wrap leading-7">
                  {msg.content}
                </p>
              )}

              {msg.image_url && (
                <img
                  src={msg.image_url}
                  alt=""
                  className="rounded-xl mt-4 max-w-full"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
          >
            Try NovaAI
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SharedConversation;