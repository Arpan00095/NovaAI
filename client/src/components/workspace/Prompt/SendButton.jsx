import { ArrowUp } from "lucide-react";

const SendButton = ({
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="Send message"
      className={`
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        transition-all
        duration-200
        ${
          disabled
            ? "bg-[#3a3a3a] text-slate-500 cursor-not-allowed"
            : "bg-white text-black hover:scale-105 active:scale-95"
        }
      `}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
};

export default SendButton;