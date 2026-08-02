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
      className="
        h-11
        w-11
        rounded-full
        bg-blue-600
        hover:bg-blue-700
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex
        items-center
        justify-center
        transition
      "
      title="Send Message"
    >
      <ArrowUp
        size={18}
        className="text-white"
      />
    </button>
  );
};

export default SendButton;