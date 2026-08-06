import {
  FileText,
  Image,
  Globe,
  Brain,
  Sparkles,
  FileSearch,
  Code2,
  FileUser,
  Mail,
} from "lucide-react";

const menuItems = [
  { icon: FileText, title: "Upload File", action: "upload-file" },
  { icon: Image, title: "Upload Image", action: "upload-image" },
  { divider: true },
  { icon: Globe, title: "Search Web", action: "search-web" },
  { icon: Brain, title: "Deep Research", action: "deep-research" },
  { divider: true },
  { icon: Sparkles, title: "Auto", action: "auto" },
  { icon: FileSearch, title: "PDF Chat", action: "pdf-chat" },
  { icon: Code2, title: "Code Assistant", action: "code" },
  { icon: FileUser, title: "Resume Builder", action: "resume" },
  { icon: Mail, title: "AI Email Writer", action: "email" },
];

const PlusMenu = ({ onSelect }) => {
  return (
    <div
      className="
        absolute
        bottom-12
        left-0
        w-64
        py-1.5
        rounded-2xl
        border
        border-[#3b3b3b]
        bg-[#212121]
        shadow-2xl
        z-50
        animate-in
        fade-in
        zoom-in-95
      "
    >
      {menuItems.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="border-t border-[#3b3b3b] my-1.5"
            />
          );
        }

        const Icon = item.icon;

        return (
          <button
            key={item.action}
            type="button"
            onClick={() => onSelect(item.action)}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3.5
              py-2
              text-left
              text-slate-200
              hover:bg-[#2f2f2f]
              rounded-xl
              transition-colors
            "
          >
            <Icon size={18} className="text-slate-400" />
            <span className="text-sm font-medium">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlusMenu;