import { useState } from "react";

import Sidebar from "../components/workspace/Sidebar/Sidebar";
import ChatHeader from "../components/workspace/Chat/ChatHeader";
import ChatBody from "../components/workspace/Chat/ChatBody";
import PromptInput from "../components/workspace/Prompt/PromptInput";

const Workspace = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] overflow-hidden select-none">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 bg-[#131314] border-none shadow-none">
        <ChatHeader setMobileOpen={setMobileSidebarOpen} />

        <ChatBody />

        <PromptInput />
      </div>
    </div>
  );
};

export default Workspace;