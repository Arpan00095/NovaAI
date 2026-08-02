import UploadButton from "./UploadButton";
import SearchToggle from "./SearchToggle";
import ModeSelector from "./ModeSelector";
import VoiceButton from "./VoiceButton";
import SendButton from "./SendButton";
import CharacterCounter from "./CharacterCounter";

const PromptToolbar = ({
  prompt,
  mode,
  setMode,
  searchEnabled,
  setSearchEnabled,
  fileInputRef,
  onFileChange,

  listening,
  supported,

  onVoiceClick,
  onSend,
  loading,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">

      {/* Left */}

      <div className="flex items-center gap-2 flex-wrap">

        <UploadButton
          fileInputRef={fileInputRef}
          onFileChange={onFileChange}
        />

        <SearchToggle
          enabled={searchEnabled}
          onToggle={() =>
            setSearchEnabled(!searchEnabled)
          }
        />

        <ModeSelector
          mode={mode}
          setMode={setMode}
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <CharacterCounter value={prompt} />

        <VoiceButton
          listening={listening}
          supported={supported}
          onClick={onVoiceClick}
        />

        <SendButton
          onClick={onSend}
          disabled={
            loading || !prompt.trim()
          }
        />

      </div>

    </div>
  );
};

export default PromptToolbar;