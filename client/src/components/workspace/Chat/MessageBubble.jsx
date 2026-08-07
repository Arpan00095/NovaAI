import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const imageUrl = message.image || message.image_url;

  const handleCopy = async () => {
    if (!message.content) return;
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      className={`group flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[75%] ${
          !isUser ? "text-slate-100" : ""
        }`}
      >
        {/* USER MESSAGE UI */}
        {isUser && (
          <div className="flex flex-col items-end gap-1.5">
            {imageUrl && (
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-sm max-w-[220px]">
                <img
                  src={imageUrl}
                  alt="User upload"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {message.content && (
              /* Replaced bg-blue-600 with bg-[#2a2b2e] (subtle dark slate) */
              <div className="inline-block rounded-3xl bg-[#2a2b2e] border border-white/10 px-5 py-2.5 text-[15px] text-white whitespace-pre-wrap leading-7 shadow-sm">
                {message.content}
              </div>
            )}
          </div>
        )}

        {/* ASSISTANT MESSAGE UI */}
        {!isUser && (
          <div className="flex flex-col items-start gap-2">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Generated"
                className="
                  max-h-80
                  max-w-full
                  rounded-2xl
                  border
                  border-white/10
                  object-contain
                  shadow-lg
                "
              />
            )}

            {message.content && (
              <div
                className="
                  prose
                  prose-invert
                  max-w-none
                  prose-pre:bg-transparent
                  prose-pre:p-0
                  prose-p:text-slate-200
                  prose-li:text-slate-200
                  prose-strong:text-white
                  prose-headings:text-white
                "
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const { className, children, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      const inline = !className;

                      if (inline) {
                        return (
                          <code
                            {...rest}
                            className="rounded-md bg-white/10 px-1.5 py-1 text-pink-400"
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <CodeBlock
                          language={match?.[1] || "text"}
                          code={String(children).replace(/\n$/, "")}
                        />
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* AI Action Buttons */}
            <div
              className="
                mt-2
                flex
                items-center
                gap-1
                opacity-0
                group-hover:opacity-100
                transition
              "
            >
              <button
                onClick={handleCopy}
                className="rounded-lg p-2 hover:bg-white/5 transition text-slate-400 hover:text-white"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>

              <button className="rounded-lg p-2 hover:bg-white/5 transition text-slate-400 hover:text-white">
                <ThumbsUp size={16} />
              </button>

              <button className="rounded-lg p-2 hover:bg-white/5 transition text-slate-400 hover:text-white">
                <ThumbsDown size={16} />
              </button>

              <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5 transition text-sm text-slate-400 hover:text-white">
                <RotateCcw size={15} />
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;