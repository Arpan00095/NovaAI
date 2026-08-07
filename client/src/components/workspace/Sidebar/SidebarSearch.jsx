import { Search } from "lucide-react";

const SidebarSearch = ({
  search,
  setSearch,
}) => {
  return (
    <div className="px-3 py-1 mb-1">
      <div
        className="
          flex
          items-center
          gap-2.5
          rounded-xl
          bg-white/5
          border
          border-white/5
          px-3
          py-2
        "
      >
        <Search
          size={16}
          className="text-slate-400 shrink-0"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats..."
          className="
            flex-1
            bg-transparent
            outline-none
            text-xs
            text-white
            placeholder:text-slate-500
          "
        />
      </div>
    </div>
  );
};

export default SidebarSearch;