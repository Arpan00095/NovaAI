import { Search } from "lucide-react";

const SidebarSearch = () => {
  return (
    <div className="px-3 py-2">
      <div
        className="
          flex
          items-center
          gap-3
          rounded-xl
          bg-slate-800
          px-4
          py-3
        "
      >
        <Search
          size={18}
          className="text-slate-400"
        />

        <input
          type="text"
          placeholder="Search chats..."
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            text-white
            placeholder:text-slate-500
          "
        />
      </div>
    </div>
  );
};

export default SidebarSearch;