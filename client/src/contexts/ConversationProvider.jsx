import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ConversationContext } from "./ConversationContext";
import { AuthContext } from "./AuthContext";

import toast from "react-hot-toast";

import {
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  togglePinConversation,
  shareConversation,
  archiveConversation,
} from "../services/conversation.service";

import { sendStreamMessage } from "../services/ai.service";

import {
  exportChatAsPdf,
  exportChatAsMarkdown,
} from "../services/export.service";

// File ko Base64 me convert karne ka helper function
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ConversationProvider = ({ children }) => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);

  const archivedConversations = conversations.filter(
    (chat) => chat.is_archived
  );

  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const { isGuest } = useContext(AuthContext);

  const refreshConversations = useCallback(async () => {
    if (isGuest) {
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
      return;
    }

    try {
      setLoadingConversations(true);

      const data = await getConversations();
      const chats = data.conversations || [];

      // Pinned chats always on top
      chats.sort((a, b) => {
        if (a.is_pinned === b.is_pinned) return 0;
        return a.is_pinned ? -1 : 1;
      });

      setConversations(chats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConversations(false);
    }
  }, [isGuest]);

  useEffect(() => {
    if (isGuest) {
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
    } else {
      refreshConversations();
    }
  }, [isGuest, refreshConversations]);

  const selectConversation = async (conversationId) => {
    if (isGuest) return;
    try {
      setActiveConversationId(conversationId);

      const data = await getConversation(conversationId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const newChat = () => {
    setActiveConversationId(null);
    setMessages([]);

    if (!isGuest) {
      refreshConversations();
    }
  };

  // ==========================================
  // Updated sendPrompt (Supports Text + File)
  // ==========================================
  const sendPrompt = async (prompt, file = null) => {
    if (!prompt.trim() && !file) return;

    try {
      setLoadingMessage(true);

      let fileBase64 = null;
      let filePreviewUrl = null;

      if (file) {
        if (file.type.startsWith("image/")) {
          filePreviewUrl = URL.createObjectURL(file);
          fileBase64 = await convertToBase64(file);
        }
      }

      // User Message + Image Preview Chat Box me append karein
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          image: filePreviewUrl,
        },
        {
          role: "assistant",
          content: "",
          image: null,
        },
      ]);

      const token = localStorage.getItem("token");

      await sendStreamMessage({
        message: prompt,
        file: fileBase64,
        fileType: file?.type,
        conversationId: activeConversationId,
        token,

        onMessage: (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length === 0) return prev;

            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + chunk,
            };

            return updated;
          });
        },

        onImage: (imageUrl) => {
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length === 0) return prev;

            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              image: imageUrl,
              content: "",
            };

            return updated;
          });
        },

        onDone: async (conversationId) => {
          if (!isGuest) {
            if (!activeConversationId && conversationId) {
              setActiveConversationId(conversationId);
            }

            await refreshConversations();
          }
        },
      });
    } catch (err) {
      console.error(err);

      toast.error(err.message || "Something went wrong.");

      setMessages((prev) => {
        const updated = [...prev];

        if (updated.length > 0) {
          const last = updated[updated.length - 1];

          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content:
                err.message ||
                "Something went wrong. Please try again.",
            };
          } else {
            updated.push({
              role: "assistant",
              content:
                err.message ||
                "Something went wrong. Please try again.",
            });
          }
        } else {
          updated.push({
            role: "assistant",
            content:
              err.message ||
              "Something went wrong. Please try again.",
          });
        }

        return updated;
      });
    } finally {
      setLoadingMessage(false);
    }
  };

  const renameChat = async (conversationId, title) => {
    if (isGuest) return;
    try {
      await renameConversation(conversationId, title);
      await refreshConversations();

      toast.success("Chat renamed ✨");
    } catch (err) {
      console.error(err);
      toast.error("Unable to rename chat");
    }
  };

  const deleteChat = async (conversationId) => {
    if (isGuest) return;
    try {
      await deleteConversation(conversationId);

      if (conversationId === activeConversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }

      await refreshConversations();

      toast.success("Chat deleted 🗑️");
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete chat");
    }
  };

  // ============================
  // Pin / Unpin Chat
  // ============================
  const pinChat = async (conversationId, isPinned) => {
    if (isGuest) return;

    try {
      await togglePinConversation(conversationId, isPinned);
      await refreshConversations();

      toast.success(isPinned ? "Chat pinned 📌" : "Chat unpinned");
    } catch (err) {
      console.error(err);
      toast.error("Unable to update pin");
    }
  };

  // ============================
  // Share Chat
  // ============================
  const shareChat = async (conversationId) => {
    if (isGuest) return;

    try {
      const data = await shareConversation(conversationId);
      await navigator.clipboard.writeText(data.shareUrl);

      toast.success("Share link copied 📋");

      return data.shareUrl;
    } catch (err) {
      console.error(err);
      toast.error("Unable to share chat");
    }
  };

  // ============================
  // Archive Chat
  // ============================
  const archiveChat = async (conversationId, isArchived) => {
    if (isGuest) return;

    try {
      await archiveConversation(conversationId, isArchived);

      if (conversationId === activeConversationId && isArchived) {
        setActiveConversationId(null);
        setMessages([]);
      }

      await refreshConversations();

      toast.success(isArchived ? "Chat archived 📦" : "Chat restored");
    } catch (err) {
      console.error(err);
      toast.error("Unable to archive chat");
    }
  };

  // ============================
  // Export Chat
  // ============================
  const exportPdf = () => {
    try {
      exportChatAsPdf(messages);
      toast.success("PDF exported successfully 📄");
    } catch (err) {
      console.error(err);
      toast.error("Unable to export PDF");
    }
  };

  const exportMarkdown = () => {
    try {
      exportChatAsMarkdown(messages);
      toast.success("Markdown exported successfully 📝");
    } catch (err) {
      console.error(err);
      toast.error("Unable to export Markdown");
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        activeConversationId,
        setActiveConversationId,

        conversations,
        archivedConversations,

        refreshConversations,
        loadingConversations,

        messages,
        setMessages,

        loadingMessage,

        sendPrompt,

        selectConversation,

        newChat,

        renameChat,

        deleteChat,

        pinChat,

        shareChat,

        archiveChat,

        exportPdf,

        exportMarkdown,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;