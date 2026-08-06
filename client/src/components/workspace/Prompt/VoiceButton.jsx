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
            ? "Stop recording"
            : "Voice input"
          : "Speech recognition not supported"
      }
      className={`
        relative
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        transition-all
        duration-200
        disabled:opacity-40
        disabled:cursor-not-allowed
        ${
          listening
            ? "bg-red-500/15 text-red-400"
            : "text-slate-400 hover:bg-[#404040] hover:text-white"
        }
      `}
    >
      {listening && (
        <span
          className="
            absolute
            h-2
            w-2
            rounded-full
            bg-red-500
            top-2
            right-2
          "
        />
      )}

      {listening ? (
        <MicOff size={18} />
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
};

export default VoiceButton;