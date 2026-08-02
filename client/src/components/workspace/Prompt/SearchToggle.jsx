import { Globe } from "lucide-react";

const SearchToggle = ({
  enabled,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        h-10
        px-3
        rounded-xl
        flex
        items-center
        gap-2
        transition
        ${
          enabled
            ? "bg-blue-600 text-white"
            : "hover:bg-slate-700 text-slate-400"
        }
      `}
      title="Web Search"
    >
      <Globe size={18} />

      <span className="text-sm font-medium">
        {enabled ? "Search ON" : "Search"}
      </span>
    </button>
  );
};

export default SearchToggle;