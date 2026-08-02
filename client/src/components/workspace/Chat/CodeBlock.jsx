import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Copy,
  Check,
} from "lucide-react";

const CodeBlock = ({
  language = "text",
  code = "",
}) => {
  const [copied, setCopied] =
    useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="
        my-5
        overflow-hidden
        rounded-xl
        border
        border-slate-700
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          bg-slate-900
          px-4
          py-2
        "
      >
        <span
          className="
            text-xs
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="
            flex
            items-center
            gap-2
            text-xs
            text-slate-400
            hover:text-white
            transition
          "
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy Code
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "#111827",
          fontSize: "14px",
          padding: "20px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;