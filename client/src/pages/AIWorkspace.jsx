import { useEffect, useState } from "react";

import ChatSidebar from "../modules/ai/chat/ChatSidebar";
import ChatWindow from "../modules/ai/chat/ChatWindow";
import { generateAIResponse } from "../modules/ai/services/ai.service";


const AIWorkspace = () => {


  const createNewChat = () => [
    {
      role: "ai",
      text: "Hello! I am NovaAI 🤖 How can I help you today?"
    }
  ];



  const [chats, setChats] = useState(() => {

    const savedChats = localStorage.getItem("nova_chats");

    return savedChats
      ? JSON.parse(savedChats)
      : [
        {
          id: 1,
          title: "Welcome to NovaAI",
          messages: createNewChat()
        }
      ];

  });



  const [activeChat, setActiveChat] = useState(() => {

    const savedActive = localStorage.getItem("nova_active_chat");

    return savedActive
      ? Number(savedActive)
      : 1;

  });



  const [messages, setMessages] = useState(() => {

    const savedChats = localStorage.getItem("nova_chats");


    if (savedChats) {

      const parsed = JSON.parse(savedChats);


      const active = parsed.find(
        (chat) =>
          chat.id ===
          Number(localStorage.getItem("nova_active_chat"))
      );


      return active
        ? active.messages
        : createNewChat();

    }


    return createNewChat();

  });



  const [isTyping, setIsTyping] = useState(false);





  // Save chats
  useEffect(() => {

    localStorage.setItem(
      "nova_chats",
      JSON.stringify(chats)
    );

  }, [chats]);





  // Save active chat
  useEffect(() => {

    localStorage.setItem(
      "nova_active_chat",
      activeChat
    );

  }, [activeChat]);







  // New Chat
  const startNewChat = () => {


    const newChat = {

      id: Date.now(),

      title: "New Conversation",

      messages: createNewChat()

    };



    setChats((prev) => [

      ...prev,

      newChat

    ]);



    setActiveChat(newChat.id);


    setMessages(newChat.messages);


  };







  // Select Chat
  const selectChat = (chat) => {


    setActiveChat(chat.id);


    setMessages(chat.messages);


  };

  // Rename Chat
  const renameChat = (id, newTitle) => {

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
            ...chat,
            title: newTitle
          }
          : chat
      )
    );

  };



  // Delete Chat
  const deleteChat = (id) => {


    const updatedChats = chats.filter(
      (chat) => chat.id !== id
    );


    if (updatedChats.length === 0) {

      const newChat = {
        id: Date.now(),
        title: "New Conversation",
        messages: createNewChat()
      };


      setChats([newChat]);

      setActiveChat(newChat.id);

      setMessages(newChat.messages);

      return;

    }



    setChats(updatedChats);



    if (activeChat === id) {

      const firstChat = updatedChats[0];


      setActiveChat(firstChat.id);


      setMessages(firstChat.messages);

    }


  };






  // Send Message
  const sendMessage = (text) => {


    const userMessage = {

      role: "user",

      text

    };



    const updatedMessages = [

      ...messages,

      userMessage

    ];



    setMessages(updatedMessages);




    setChats((prev) =>

      prev.map((chat) =>


        chat.id === activeChat

          ? {

            ...chat,

            title: text.slice(0, 25),

            messages: updatedMessages

          }

          : chat


      )

    );





    setIsTyping(true);





    setTimeout(async () => {


      const aiResult = await generateAIResponse(text);



      const aiMessage = {

        role: "ai",

        text: aiResult.response

      };



      const finalMessages = [

        ...updatedMessages,

        aiMessage

      ];



      setMessages(finalMessages);




      setChats((prev) =>

        prev.map((chat) =>


          chat.id === activeChat

            ? {

              ...chat,

              messages: finalMessages

            }

            : chat
        )

      );

      setIsTyping(false);

    }, 1500);


  };

  return (

    <div
      className="
        h-screen
        flex
        bg-slate-950
      "
    >


      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        startNewChat={startNewChat}
        selectChat={selectChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />



      <main className="flex-1">


        <ChatWindow

          messages={messages}

          sendMessage={sendMessage}

          isTyping={isTyping}

        />


      </main>


    </div>

  );

};


export default AIWorkspace;