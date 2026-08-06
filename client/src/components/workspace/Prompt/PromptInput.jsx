import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Plus, X, FileText } from "lucide-react";

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

  // File preview state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const { sendPrompt, loadingMessage } = useContext(ConversationContext);

  // ===============================
  // Auto Resize & Scroll Fix
  // ===============================

  const autoResize = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "24px";
    
    const scrollHeight = textareaRef.current.scrollHeight;
    const maxHeight = 160;

    textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    
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
  // File Upload & Preview Handler
  // ===============================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Agar Image hai toh local preview URL banayein
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }

    // Input reset karein taaki same file dubara select ho sake
    e.target.value = "";
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  // ===============================
  // Send Message
  // ===============================

  const handleSend = async () => {
    if (loadingMessage || (!prompt.trim() && !selectedFile)) return;

    const text = prompt.trim();
    const fileToSend = selectedFile;

    // Reset Input States
    setPrompt("");
    removeSelectedFile();

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.overflowY = "hidden";
    }

    // Prompt aur File dono ConversationContext me bhejein
    await sendPrompt(text, fileToSend);
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
        {/* File Preview Badge Area */}
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 pl-1 pt-1">
            <div className="relative flex items-center gap-2.5 rounded-2xl bg-[#3b3b3b] p-2 pr-8 text-xs text-white shadow-md">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="preview"
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4a4a4a]">
                  <FileText size={20} className="text-slate-300" />
                </div>
              )}

              <div className="max-w-[160px] truncate">
                <p className="truncate font-medium text-slate-200">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              {/* Remove File Button */}
              <button
                type="button"
                onClick={removeSelectedFile}
                className="
                  absolute
                  right-1.5
                  top-1.5
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#4e4e4e]
                  text-slate-300
                  transition
                  hover:bg-[#606060]
                  hover:text-white
                "
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

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
              disabled={loadingMessage || (!prompt.trim() && !selectedFile)}
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