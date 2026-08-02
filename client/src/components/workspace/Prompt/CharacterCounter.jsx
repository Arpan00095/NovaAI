const MAX_LENGTH = 8000;

const CharacterCounter = ({ value = "" }) => {
  const length = value.length;

  return (
    <span
      className={`
        text-xs
        font-medium
        ${
          length > MAX_LENGTH * 0.9
            ? "text-yellow-400"
            : "text-slate-500"
        }
      `}
    >
      {length}/{MAX_LENGTH}
    </span>
  );
};

export default CharacterCounter;