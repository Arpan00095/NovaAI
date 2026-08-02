import { useContext, useRef, useState } from "react";

import { ConversationContext } from "../../../contexts/ConversationContext";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";

import PromptToolbar from "./PromptToolbar";

const PromptInput = () => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [mode, setMode] = useState("Auto");

  const {
    sendPrompt,
    loadingMessage,
  } = useContext(ConversationContext);

  // ----------------------------
  // Speech Recognition
  // ----------------------------

  const {
    listening,
    startListening,
    stopListening,
    supported,
  } = useSpeechRecognition((text) => {
    setPrompt((prev) =>
      prev ? `${prev} ${text}` : text
    );

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "0px";
        textareaRef.current.style.height =
          Math.min(
            textareaRef.current.scrollHeight,
            220
          ) + "px";
      }
    });
  });

  // ----------------------------
  // Auto Resize
  // ----------------------------

  const handleInput = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";

    textarea.style.height =
      Math.min(
        textarea.scrollHeight,
        220
      ) + "px";
  };

  // ----------------------------
  // Send
  // ----------------------------

  const handleSend = async () => {
    if (!prompt.trim() || loadingMessage)
      return;

    const text = prompt.trim();

    setPrompt("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
    }

    await sendPrompt(text);

    // Future
    // sendPrompt({
    //   message: text,
    //   mode,
    //   searchEnabled,
    // });
  };

  // ----------------------------
  // Upload
  // ----------------------------

  const handleFileChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    console.log(file);

    // Future
    // PDF Upload
    // OCR
    // Image Analysis
  };

  // ----------------------------
  // Voice
  // ----------------------------

  const handleVoice = () => {
    if (!supported) {
      alert(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="px-6 pb-6 bg-[#212121]">

      <div
        className="
          max-w-4xl
          mx-auto
          rounded-3xl
          border
          border-slate-700
          bg-[#2a2a2a]
          shadow-xl
        "
      >

        <textarea
          ref={textareaRef}
          rows={1}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            handleInput();
          }}
          onKeyDown={async (e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();

              await handleSend();
            }
          }}
          placeholder="Ask NovaAI anything..."
          className="
            w-full
            resize-none
            bg-transparent
            px-6
            pt-5
            text-white
            outline-none
            placeholder:text-slate-500
            overflow-y-auto
          "
        />

        <PromptToolbar
          prompt={prompt}
          mode={mode}
          setMode={setMode}
          searchEnabled={searchEnabled}
          setSearchEnabled={
            setSearchEnabled
          }
          fileInputRef={fileInputRef}
          onFileChange={
            handleFileChange
          }
          listening={listening}
          supported={supported}
          onVoiceClick={handleVoice}
          onSend={handleSend}
          loading={loadingMessage}
        />

      </div>

      <p className="mt-3 text-center text-xs text-slate-500">
        NovaAI can make mistakes.
        Verify important information.
      </p>

    </div>
  );
};

export default PromptInput;