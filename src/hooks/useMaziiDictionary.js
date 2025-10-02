import { useState } from "react";

export const useMaziiDictionary = () => {
  const [selectedWord, setSelectedWord] = useState("");

  const handleTextSelection = () => {
    const selection = window.getSelection().toString().trim();
    if (
      selection &&
      /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(selection)
    ) {
      setSelectedWord(selection);
    }
  };

  const openMazii = (word) => {
    const url = `https://mazii.net/vi-VN/search/word/javi/${encodeURIComponent(
      word
    )}`;
    window.open(url, "_blank");
  };

  return {
    selectedWord,
    handleTextSelection,
    openMazii,
  };
};

export default useMaziiDictionary;
