import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  // Database se `image_url` milta hai aur Local State se `image`
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
        {/* ======================= */}
        {/* USER MESSAGE UI         */}
        {/* ======================= */}
        {isUser && (
          <div className="flex flex-col items-end gap-1.5">
            {/* ChatGPT Style Small Image Thumbnail (Handles both local image & DB image_url) */}
            {imageUrl && (
              <div className="relative overflow-hidden rounded-2xl border border-[#3b3b3b] shadow-sm max-w-[220px]">
                <img
                  src={imageUrl}
                  alt="User upload"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Text inside the bubble */}
            {message.content && (
              <div className="inline-block rounded-3xl bg-blue-600 px-5 py-2.5 text-[15px] text-white whitespace-pre-wrap leading-7 shadow-sm">
                {message.content}
              </div>
            )}
          </div>
        )}

        {/* ======================= */}
        {/* ASSISTANT MESSAGE UI    */}
        {/* ======================= */}
        {!isUser && (
          <div className="flex flex-col items-start gap-2">
            {/* AI Generated Image (if any) */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Generated"
                className="
                  max-h-80
                  max-w-full
                  rounded-2xl
                  border
                  border-slate-700
                  object-contain
                  shadow-lg
                "
              />
            )}

            {/* AI Text Response */}
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
                            className="rounded-md bg-slate-800 px-1.5 py-1 text-pink-400"
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

            {/* AI Message Action Buttons */}
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
                className="rounded-lg p-2 hover:bg-slate-800 transition text-slate-400 hover:text-white"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>

              <button className="rounded-lg p-2 hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <ThumbsUp size={16} />
              </button>

              <button className="rounded-lg p-2 hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <ThumbsDown size={16} />
              </button>

              <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-800 transition text-sm text-slate-400 hover:text-white">
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