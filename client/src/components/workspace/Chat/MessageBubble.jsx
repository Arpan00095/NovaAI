import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";

import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  const [copied, setCopied] = useState(false);

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
        className={`max-w-[90%] ${
          isUser
            ? "rounded-3xl bg-blue-600 px-5 py-4 text-white"
            : "text-slate-100"
        }`}
      >
        {/* USER MESSAGE (With Image + Text Support) */}
        {isUser && (
          <div className="flex flex-col gap-2">
            {message.image && (
              <img
                src={message.image}
                alt="User upload"
                className="max-h-72 w-auto max-w-full rounded-2xl border border-blue-400/30 object-cover shadow-md"
              />
            )}
            {message.content && (
              <div className="whitespace-pre-wrap leading-7">
                {message.content}
              </div>
            )}
          </div>
        )}

        {/* AI GENERATED IMAGE */}
        {!isUser && message.image && (
          <img
            src={message.image}
            alt="Generated"
            className="
              rounded-2xl
              border
              border-slate-700
              max-w-full
              shadow-lg
            "
          />
        )}

        {/* ASSISTANT TEXT RESPONSE */}
        {!isUser && !message.image && (
          <>
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
                    const {
                      className,
                      children,
                      ...rest
                    } = props;

                    const match =
                      /language-(\w+)/.exec(
                        className || ""
                      );

                    const inline = !className;

                    if (inline) {
                      return (
                        <code
                          {...rest}
                          className="
                            rounded-md
                            bg-slate-800
                            px-1.5
                            py-1
                            text-pink-400
                          "
                        >
                          {children}
                        </code>
                      );
                    }

                    return (
                      <CodeBlock
                        language={
                          match?.[1] || "text"
                        }
                        code={String(children).replace(
                          /\n$/,
                          ""
                        )}
                      />
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Actions */}
            <div
              className="
                mt-3
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
                className="
                  rounded-lg
                  p-2
                  hover:bg-slate-800
                  transition
                "
              >
                {copied ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>

              <button
                className="
                  rounded-lg
                  p-2
                  hover:bg-slate-800
                  transition
                "
              >
                <ThumbsUp size={16} />
              </button>

              <button
                className="
                  rounded-lg
                  p-2
                  hover:bg-slate-800
                  transition
                "
              >
                <ThumbsDown size={16} />
              </button>

              <button
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  px-3
                  py-2
                  hover:bg-slate-800
                  transition
                  text-sm
                "
              >
                <RotateCcw size={15} />
                Regenerate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;