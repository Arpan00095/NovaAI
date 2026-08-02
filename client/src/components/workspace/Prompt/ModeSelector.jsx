import { ChevronDown, Sparkles } from "lucide-react";

const MODES = [
  "Auto",
  "Coding",
  "Writing",
  "Resume",
  "Website",
  "SQL",
  "Image",
  "Translate",
];

const ModeSelector = ({
  mode,
  setMode,
}) => {
  return (
    <div className="relative">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="
          appearance-none
          bg-transparent
          border
          border-slate-700
          rounded-xl
          h-10
          pl-10
          pr-10
          text-sm
          text-white
          outline-none
          hover:border-slate-500
          transition
          cursor-pointer
        "
      >
        {MODES.map((item) => (
          <option
            key={item}
            value={item}
            className="bg-[#2a2a2a]"
          >
            {item}
          </option>
        ))}
      </select>

      <Sparkles
        size={16}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-blue-400
          pointer-events-none
        "
      />

      <ChevronDown
        size={16}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-slate-400
          pointer-events-none
        "
      />
    </div>
  );
};

export default ModeSelector;