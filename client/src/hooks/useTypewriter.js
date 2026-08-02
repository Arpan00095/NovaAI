import { useEffect, useState } from "react";

const useTypewriter = (
  text,
  speed = 12
) => {
  const [displayedText, setDisplayedText] =
    useState("");

  useEffect(() => {
    setDisplayedText("");

    if (!text) return;

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayedText(
        text.slice(0, index)
      );

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
};

export default useTypewriter;