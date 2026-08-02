import { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const useSpeechRecognition = (onResult) => {
  const recognitionRef = useRef(null);

  const [listening, setListening] =
    useState(false);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      onResult(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current =
      recognition;
  }, [onResult]);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return {
    listening,
    startListening,
    stopListening,
    supported:
      !!SpeechRecognition,
  };
};

export default useSpeechRecognition;