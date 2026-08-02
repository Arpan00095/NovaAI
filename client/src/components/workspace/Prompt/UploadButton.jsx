import { Paperclip } from "lucide-react";

const UploadButton = ({
  fileInputRef,
  onFileChange,
}) => {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="
          .pdf,
          .doc,
          .docx,
          .txt,
          .csv,
          .xlsx,
          image/*
        "
        onChange={onFileChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="
          h-10
          w-10
          rounded-xl
          hover:bg-slate-700
          flex
          items-center
          justify-center
          transition
        "
        title="Upload File"
      >
        <Paperclip
          size={20}
          className="text-slate-400"
        />
      </button>
    </>
  );
};

export default UploadButton;