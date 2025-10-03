import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { useAuth } from "./AuthContext";
import { syncToCloud } from "../services/cloudSyncService";
import {
  scheduleDailyAnalysis,
  stopDailyAnalysis,
} from "../services/dailyErrorAnalysis";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user, cloudData } = useAuth();
  const syncTimeoutRef = useRef(null);

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

  // AI Analysis state
  const [aiAnalyses, setAiAnalyses] = useState([]);

  // Imported error logs from last import session
  const [importedErrorLogs, setImportedErrorLogs] = useState([]);

  // Auto sync to cloud when data changes (debounced)
  useEffect(() => {
    if (!user?.uid) return;

    // Clear previous timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout to sync after 5 seconds of inactivity
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await syncToCloud(user.uid, {
          grammarCount: grammarItems.length,
          vocabularyCount: vocabularyItems.length,
          kanjiCount: kanjiItems.length,
          reviewCount: reviewHistory.length,
          lastModified: new Date().toISOString(),
        });
        console.log("Auto-synced to cloud");
      } catch (error) {
        console.error("Auto-sync failed:", error);
      }
    }, 5000);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [user?.uid, grammarItems, vocabularyItems, kanjiItems, reviewHistory]);

  // Load data from cloud when user logs in or cloudData changes
  useEffect(() => {
    if (cloudData) {
      console.log("Loading data from cloud...", cloudData);
      setGrammarItems(cloudData.grammarItems || []);
      setVocabularyItems(cloudData.vocabularyItems || []);
      setKanjiItems(cloudData.kanjiItems || []);
      setContrastCards(cloudData.contrastCards || []);
      setReviewHistory(cloudData.reviewHistory || []);
      setErrorLog(cloudData.errorLog || []);
      setSavedSentences(cloudData.savedSentences || []);
      setSavedDiaries(cloudData.savedDiaries || []);
    }
    // If there's no cloud data, load from local storage as a fallback
    else loadFromLocalStorage();
  }, [cloudData]);

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
  }, [
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
      const grammarData = localStorage.getItem(STORAGE_KEYS.GRAMMAR_DATA);
      const vocabData = localStorage.getItem(STORAGE_KEYS.VOCABULARY_DATA);
      const historyData = localStorage.getItem(STORAGE_KEYS.REVIEW_HISTORY);
      const errorData = localStorage.getItem(STORAGE_KEYS.ERROR_LOG);

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

      const sentencesData = localStorage.getItem("japanese_app_sentences");
      const diariesData = localStorage.getItem("japanese_app_diaries");
      if (sentencesData) setSavedSentences(JSON.parse(sentencesData));
      if (diariesData) setSavedDiaries(JSON.parse(diariesData));
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  const saveToLocalStorage = () => {
    // Don't save to local storage if there is no user, to avoid conflicts on login
    if (!user) return;
    try {
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
      localStorage.setItem(
        "japanese_app_sentences",
        JSON.stringify(savedSentences)
      );
      localStorage.setItem(
        "japanese_app_diaries",
        JSON.stringify(savedDiaries)
      );
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

  // Schedule daily error analysis
  useEffect(() => {
    const handleAnalysisComplete = (analyses, errors) => {
      setAiAnalyses((prev) => [
        ...prev,
        {
          date: new Date().toISOString(),
          analyses,
          errors,
        },
      ]);
      showNotification("AI đã phân tích lỗi hôm nay!", "info");
    };

    scheduleDailyAnalysis(errorLog, handleAnalysisComplete);

    return () => {
      stopDailyAnalysis();
    };
  }, [errorLog]);

  // Load AI analyses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("japanese_app_ai_analyses");
    if (saved) {
      setAiAnalyses(JSON.parse(saved));
    }
  }, []);

  // Save AI analyses to localStorage
  useEffect(() => {
    localStorage.setItem(
      "japanese_app_ai_analyses",
      JSON.stringify(aiAnalyses)
    );
  }, [aiAnalyses]);

  // Load imported error logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("japanese_app_imported_error_logs");
    if (saved) {
      setImportedErrorLogs(JSON.parse(saved));
    }
  }, []);

  // Save imported error logs to localStorage
  useEffect(() => {
    localStorage.setItem(
      "japanese_app_imported_error_logs",
      JSON.stringify(importedErrorLogs)
    );
  }, [importedErrorLogs]);

  // Merge imported error logs with app error log
  const allErrorLogs = useMemo(() => {
    return [...errorLog, ...importedErrorLogs];
  }, [errorLog, importedErrorLogs]);

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

    // AI Analysis
    aiAnalyses,
    setAiAnalyses,

    // Imported Error Logs
    importedErrorLogs,
    setImportedErrorLogs,
    allErrorLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
