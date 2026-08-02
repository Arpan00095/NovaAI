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
    await navigator.clipboard.writeText(message.content);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          relative
          group
          max-w-[90%]
          rounded-2xl
          px-5
          py-4
          ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-[#2a2a2a] border border-slate-700 text-slate-100"
          }
        `}
      >
        {!isUser && (
          <button
            onClick={handleCopy}
            className="
              absolute
              top-3
              right-3
              opacity-0
              group-hover:opacity-100
              transition
              text-slate-400
              hover:text-white
            "
          >
            {copied ? (
              <Check size={18} />
            ) : (
              <Copy size={18} />
            )}
          </button>
        )}

        {isUser ? (
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <>
            <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0">
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
                      /language-(\w+)/.exec(className || "");

                    const isInline = !className;

                    if (isInline) {
                      return (
                        <code
                          {...rest}
                          className="
                            rounded
                            bg-slate-800
                            px-1.5
                            py-0.5
                            text-pink-400
                          "
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

            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                border-t
                border-slate-700
                pt-4
              "
            >
              <button
                className="
                  h-9
                  w-9
                  rounded-lg
                  hover:bg-slate-700
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <ThumbsUp size={16} />
              </button>

              <button
                className="
                  h-9
                  w-9
                  rounded-lg
                  hover:bg-slate-700
                  transition
                  flex
                  items-center
                  justify-center
                "
              >
                <ThumbsDown size={16} />
              </button>

              <button
                className="
                  h-9
                  px-3
                  rounded-lg
                  hover:bg-slate-700
                  transition
                  flex
                  items-center
                  gap-2
                "
              >
                <RotateCcw size={15} />
                <span className="text-sm">
                  Regenerate
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;