import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Plus } from "lucide-react";

import { ConversationContext } from "../../../contexts/ConversationContext";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";

import PlusMenu from "./PlusMenu";
import VoiceButton from "./VoiceButton";
import SendButton from "./SendButton";

const PromptInput = () => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { sendPrompt, loadingMessage } = useContext(ConversationContext);

  // ===============================
  // Auto Resize & Scroll Fix
  // ===============================

  const autoResize = () => {
    if (!textareaRef.current) return;

    // Height reset karna zaroori hai scrollHeight sahi calculate karne ke liye
    textareaRef.current.style.height = "24px";
    
    const scrollHeight = textareaRef.current.scrollHeight;
    const maxHeight = 160; // Max height in pixels

    textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    
    // 160px exceed hote hi scrolling enable hogi
    if (scrollHeight > maxHeight) {
      textareaRef.current.style.overflowY = "auto";
    } else {
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  // ===============================
  // Speech Recognition
  // ===============================

  const { listening, startListening, stopListening, supported } =
    useSpeechRecognition((text) => {
      setPrompt((prev) => (prev ? `${prev} ${text}` : text));

      requestAnimationFrame(() => {
        autoResize();
      });
    });

  // ===============================
  // Send Message
  // ===============================

  const handleSend = async () => {
    if (loadingMessage || !prompt.trim()) return;

    const text = prompt.trim();
    setPrompt("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.overflowY = "hidden";
    }

    await sendPrompt(text);
  };

  // ===============================
  // Voice Handler
  // ===============================

  const handleVoice = () => {
    if (!supported) return;

    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ===============================
  // File Upload
  // ===============================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file);
  };

  // ===============================
  // Plus Menu Actions
  // ===============================

  const handleMenuSelect = (action) => {
    setMenuOpen(false);

    switch (action) {
      case "upload-file":
      case "upload-image":
        fileInputRef.current?.click();
        break;

      default:
        console.log(action);
    }
  };

  // ===============================
  // Close Plus Menu on Outside Click
  // ===============================

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="bg-[#212121] px-4 pb-4">
      <div
        className="
          mx-auto
          max-w-3xl
          rounded-3xl
          border
          border-[#3b3b3b]
          bg-[#2f2f2f]
          shadow-lg
          px-3
          py-2.5
        "
      >
        {/* Input Bar Container */}
        <div className="flex items-end gap-2">
          
          {/* Plus Menu Button */}
          <div ref={menuRef} className="relative flex-shrink-0 mb-0.5">
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-slate-300
                transition
                hover:bg-[#3b3b3b]
              "
            >
              <Plus size={18} />
            </button>

            {menuOpen && <PlusMenu onSelect={handleMenuSelect} />}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            placeholder="Ask NovaAI anything..."
            onChange={(e) => {
              setPrompt(e.target.value);
              autoResize();
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                await handleSend();
              }
            }}
            style={{
              height: "24px",
              maxHeight: "160px",
              overflowY: "hidden",
            }}
            className="
              flex-1
              resize-none
              bg-transparent
              border-0
              outline-none
              text-white
              text-[15px]
              leading-6
              placeholder:text-[#8e8ea0]
              py-0
              my-1
            "
          />

          {/* Voice Button */}
          <div className="flex-shrink-0 mb-0.5">
            <VoiceButton
              listening={listening}
              supported={supported}
              onClick={handleVoice}
            />
          </div>

          {/* Send Button */}
          <div className="flex-shrink-0 mb-0.5">
            <SendButton
              onClick={handleSend}
              disabled={loadingMessage || !prompt.trim()}
            />
          </div>

        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-500">
        NovaAI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default PromptInput;