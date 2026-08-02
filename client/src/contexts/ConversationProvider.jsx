import { useCallback, useState } from "react";

import { ConversationContext } from "./ConversationContext";

import {
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
} from "../services/conversation.service";

import { sendStreamMessage } from "../services/ai.service";

const ConversationProvider = ({ children }) => {
  const [activeConversationId, setActiveConversationId] =
    useState(null);

  const [conversations, setConversations] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [loadingConversations, setLoadingConversations] =
    useState(false);

  const [loadingMessage, setLoadingMessage] =
    useState(false);

  const refreshConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);

      const data = await getConversations();

      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const selectConversation = async (
    conversationId
  ) => {
    try {
      setActiveConversationId(conversationId);

      const data = await getConversation(
        conversationId
      );

      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const newChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    refreshConversations();
  };

  const sendPrompt = async (prompt) => {
    if (!prompt.trim()) return;

    try {
      setLoadingMessage(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: "",
        },
      ]);

      const token =
        localStorage.getItem("token");

      await sendStreamMessage({
        message: prompt,
        conversationId:
          activeConversationId,
        token,

        onMessage: (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];

            if (updated.length === 0)
              return prev;

            updated[updated.length - 1] = {
              ...updated[
                updated.length - 1
              ],
              content:
                updated[
                  updated.length - 1
                ].content + chunk,
            };

            return updated;
          });
        },

        onDone: async (
          conversationId
        ) => {
          if (
            !activeConversationId &&
            conversationId
          ) {
            setActiveConversationId(
              conversationId
            );
          }

          await refreshConversations();
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessage(false);
    }
  };

  const renameChat = async (
    conversationId,
    title
  ) => {
    try {
      await renameConversation(
        conversationId,
        title
      );

      await refreshConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteChat = async (
    conversationId
  ) => {
    try {
      await deleteConversation(
        conversationId
      );

      if (
        conversationId ===
        activeConversationId
      ) {
        setActiveConversationId(null);
        setMessages([]);
      }

      await refreshConversations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        activeConversationId,
        setActiveConversationId,

        conversations,
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
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;