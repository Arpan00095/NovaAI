import { Mic, MicOff } from "lucide-react";

const VoiceButton = ({
  onClick,
  listening = false,
  supported = true,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!supported}
      title={
        supported
          ? listening
            ? "Stop Recording"
            : "Start Voice Input"
          : "Speech Recognition is not supported"
      }
      className={`
        relative
        h-10
        w-10
        rounded-xl
        flex
        items-center
        justify-center
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${
          listening
            ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
            : "hover:bg-slate-700 text-slate-400"
        }
      `}
    >
      {listening ? (
        <>
          <span className="absolute inset-0 rounded-xl animate-ping bg-red-500 opacity-20"></span>
          <MicOff size={20} className="relative z-10" />
        </>
      ) : (
        <Mic size={20} />
      )}
    </button>
  );
};

export default VoiceButton;