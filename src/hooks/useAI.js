import { useState } from "react";
import * as aiService from "../services/aiService";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkSentence = async (
    sentence,
    grammarPoints = [],
    vocabulary = []
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.checkSentence(
        sentence,
        grammarPoints,
        vocabulary
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const explainError = async (question, userAnswer, correctAnswer) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.explainError(
        question,
        userAnswer,
        correctAnswer
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateExamples = async (grammarPoint, vocabulary, difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.generateExampleSentences(
        grammarPoint,
        vocabulary,
        difficulty
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const suggestTopic = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.suggestWritingTopic();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkDiary = async (content) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.checkDiaryEntry(content);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkSentence,
    explainError,
    generateExamples,
    suggestTopic,
    checkDiary,
  };
};
