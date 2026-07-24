import { useState } from "react";

const MessageInput = ({ sendMessage }) => {

  const [text, setText] = useState("");


  const handleSend = () => {

    if (!text.trim()) return;


    sendMessage(text);

    setText("");

  };


  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      handleSend();
    }

  };


  return (
    <div
      className="
        flex
        items-center
        gap-3
        max-w-5xl
        mx-auto
      "
    >

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message NovaAI..."
        className="
          flex-1
          px-5
          py-4
          rounded-2xl
          bg-slate-800
          border
          border-slate-700
          text-white
          placeholder:text-slate-400
          outline-none
          focus:border-blue-500
        "
      />


      <button
        onClick={handleSend}
        className="
          px-6
          py-4
          rounded-2xl
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-semibold
          transition
        "
      >
        Send
      </button>


    </div>
  );
};


export default MessageInput;