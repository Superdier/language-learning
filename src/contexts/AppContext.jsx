import React, { createContext, useContext, useState, useEffect } from "react";
import { STORAGE_KEYS } from "../utils/constants";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(null);

  // Grammar state
  const [grammarItems, setGrammarItems] = useState([]);
  const [contrastCards, setContrastCards] = useState([]);

  // Vocabulary state
  const [vocabularyItems, setVocabularyItems] = useState([]);
  const [kanjiItems, setKanjiItems] = useState([]);

  // Review state
  const [reviewHistory, setReviewHistory] = useState([]);
  const [errorLog, setErrorLog] = useState([]);

  // Writing and Diary state
  const [savedSentences, setSavedSentences] = useState([]);
  const [savedDiaries, setSavedDiaries] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
    const sentencesData = localStorage.getItem("japanese_app_sentences");
    const diariesData = localStorage.getItem("japanese_app_diaries");

    if (sentencesData) setSavedSentences(JSON.parse(sentencesData));
    if (diariesData) setSavedDiaries(JSON.parse(diariesData));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage();
    localStorage.setItem(
      "japanese_app_sentences",
      JSON.stringify(savedSentences)
    );
    localStorage.setItem("japanese_app_diaries", JSON.stringify(savedDiaries));
  }, [
    user,
    grammarItems,
    vocabularyItems,
    kanjiItems,
    reviewHistory,
    errorLog,
    savedSentences,
    savedDiaries,
  ]);

  const loadFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const grammarData = localStorage.getItem(STORAGE_KEYS.GRAMMAR_DATA);
      const vocabData = localStorage.getItem(STORAGE_KEYS.VOCABULARY_DATA);
      const historyData = localStorage.getItem(STORAGE_KEYS.REVIEW_HISTORY);
      const errorData = localStorage.getItem(STORAGE_KEYS.ERROR_LOG);

      if (userData) setUser(JSON.parse(userData));
      if (grammarData) {
        const parsed = JSON.parse(grammarData);
        setGrammarItems(parsed.grammar || []);
        setContrastCards(parsed.contrast || []);
      }
      if (vocabData) {
        const parsed = JSON.parse(vocabData);
        setVocabularyItems(parsed.vocabulary || []);
        setKanjiItems(parsed.kanji || []);
      }
      if (historyData) setReviewHistory(JSON.parse(historyData));
      if (errorData) setErrorLog(JSON.parse(errorData));
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  const saveToLocalStorage = () => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
      localStorage.setItem(
        STORAGE_KEYS.GRAMMAR_DATA,
        JSON.stringify({
          grammar: grammarItems,
          contrast: contrastCards,
        })
      );
      localStorage.setItem(
        STORAGE_KEYS.VOCABULARY_DATA,
        JSON.stringify({
          vocabulary: vocabularyItems,
          kanji: kanjiItems,
        })
      );
      localStorage.setItem(
        STORAGE_KEYS.REVIEW_HISTORY,
        JSON.stringify(reviewHistory)
      );
      localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(errorLog));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Add review record
  const addReviewRecord = (record) => {
    setReviewHistory((prev) => [
      ...prev,
      {
        ...record,
        date: new Date().toISOString(),
        id: `${Date.now()}-${Math.random()}`,
      },
    ]);
  };

  // Add error log
  const addErrorLog = (error) => {
    setErrorLog((prev) => [
      ...prev,
      {
        ...error,
        date: new Date().toISOString(),
        id: `${Date.now()}-${Math.random()}`,
      },
    ]);
  };

  // Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Clear all data
  const clearAllData = () => {
    setGrammarItems([]);
    setContrastCards([]);
    setVocabularyItems([]);
    setKanjiItems([]);
    setReviewHistory([]);
    setErrorLog([]);
    localStorage.clear();
    showNotification("Đã xóa tất cả dữ liệu", "success");
  };

  const value = {
    // State
    user,
    grammarItems,
    contrastCards,
    vocabularyItems,
    kanjiItems,
    reviewHistory,
    errorLog,
    loading,
    notification,

    // Setters
    setUser,
    setGrammarItems,
    setContrastCards,
    setVocabularyItems,
    setKanjiItems,
    setReviewHistory,
    setErrorLog,
    setLoading,
    setSavedSentences,
    setSavedDiaries,

    // Methods
    addReviewRecord,
    addErrorLog,
    showNotification,
    clearAllData,
    savedSentences,
    savedDiaries,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
