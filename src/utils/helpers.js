import { SRS_INTERVALS } from "./constants";
import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns";

/**
 * Calculate next review date based on SRS level
 */
export const calculateNextReviewDate = (srsLevel) => {
  const interval = SRS_INTERVALS[srsLevel] || SRS_INTERVALS[0];
  return addDays(new Date(), interval);
};

/**
 * Check if item needs review today
 */
export const needsReview = (nextReviewDate) => {
  if (!nextReviewDate) return true;
  const today = startOfDay(new Date());
  const reviewDate = startOfDay(new Date(nextReviewDate));
  return (
    isBefore(reviewDate, today) || reviewDate.getTime() === today.getTime()
  );
};

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (!dateStr || isNaN(date.getTime())) return "N/A";
  return format(new Date(dateStr), "dd/MM/yyyy");
}

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Get random items from array
 */
export const getRandomItems = (array, count) => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Calculate study streak
 */
export const calculateStreak = (reviewHistory) => {
  if (!reviewHistory || reviewHistory.length === 0) return 0;

  const sortedHistory = [...reviewHistory].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let streak = 0;
  let currentDate = startOfDay(new Date());

  for (const record of sortedHistory) {
    const recordDate = startOfDay(new Date(record.date));
    if (recordDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate = addDays(currentDate, -1);
    } else if (isBefore(recordDate, currentDate)) {
      break;
    }
  }

  return streak;
};

/**
 * Get items due for review
 */
export const getItemsDueForReview = (items) => {
  return items.filter((item) => needsReview(item.nextReviewDate));
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (current, total) => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Create Mazii dictionary URL
 */
export const createMaziiUrl = (word) => {
  const MAZII_BASE_URL = "https://mazii.net/vi-VN/search/word/javi/";
  return `${MAZII_BASE_URL}${encodeURIComponent(word)}`;
};

/**
 * Parse Excel date to JS date
 */
export const parseExcelDate = (excelDate) => {
  if (typeof excelDate === "number") {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date;
  }
  return new Date(excelDate);
};

/**
 * Validate file upload
 */
export const validateFile = (file, maxSize, acceptedTypes) => {
  if (file.size > maxSize) {
    return { valid: false, error: "File quá lớn" };
  }

  const fileExtension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();
  if (!acceptedTypes.includes(fileExtension)) {
    return { valid: false, error: "Định dạng file không được hỗ trợ" };
  }

  return { valid: true };
};

/**
 * Get error frequency
 */
export const getErrorFrequency = (errorLog) => {
  const frequency = {};
  errorLog.forEach((error) => {
    const key = error.itemId;
    frequency[key] = (frequency[key] || 0) + 1;
  });
  return frequency;
};

/**
 * Sort by SRS level
 */
export const sortBySRSLevel = (items) => {
  return [...items].sort((a, b) => {
    if (a.srsLevel !== b.srsLevel) {
      return a.srsLevel - b.srsLevel;
    }
    return new Date(a.nextReviewDate) - new Date(b.nextReviewDate);
  });
};

/**
 * Get study statistics
 */
export const getStudyStatistics = (reviewHistory, days = 7) => {
  const stats = {};
  const startDate = addDays(new Date(), -days + 1);

  for (let i = 0; i < days; i++) {
    const date = format(addDays(startDate, i), "yyyy-MM-dd");
    stats[date] = {
      grammar: 0,
      vocabulary: 0,
      kanji: 0,
      reading: 0,
      listening: 0,
    };
  }

  reviewHistory.forEach((record) => {
    const dateKey = format(new Date(record.date), "yyyy-MM-dd");
    if (stats[dateKey] && record.correct) {
      stats[dateKey][record.type] = (stats[dateKey][record.type] || 0) + 1;
    }
  });

  return stats;
};
