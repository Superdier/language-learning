// JLPT Levels
export const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];

// SRS Intervals (in days)
export const SRS_INTERVALS = [1, 3, 7, 14, 30, 60, 120];

// Content Types
export const CONTENT_TYPES = {
  GRAMMAR: "grammar",
  VOCABULARY: "vocabulary",
  KANJI: "kanji",
  READING: "reading",
  LISTENING: "listening",
};

// Quiz Types
export const QUIZ_TYPES = {
  FILL_BLANK: "fill_blank",
  MULTIPLE_CHOICE: "multiple_choice",
  USAGE: "usage",
  MEANING: "meaning",
};

// Error Tags
export const ERROR_TAGS = {
  FREQUENT: "hay_sai",
  SIMILAR: "tuong_tu",
  FIXED: "da_sua",
  NEED_REVIEW: "can_on",
};

// Review Status
export const REVIEW_STATUS = {
  NEW: "new",
  LEARNING: "learning",
  REVIEWING: "reviewing",
  MASTERED: "mastered",
};

// AI Prompt Templates
export const AI_PROMPTS = {
  CHECK_SENTENCE: `Bạn là giáo viên tiếng Nhật. Kiểm tra câu sau và chỉ ra lỗi ngữ pháp, từ vựng nếu có:`,
  EXPLAIN_ERROR: `Giải thích lỗi sai trong câu sau và đưa ra đáp án đúng:`,
  GENERATE_EXAMPLE: `Tạo câu ví dụ sử dụng ngữ pháp và từ vựng sau:`,
  SUGGEST_WRITING: `Gợi ý cách viết câu hay hơn với nội dung:`,
};

// Mazii Dictionary URL
export const MAZII_SEARCH_URL = "https://mazii.net/vi-VN/search/word/javi/";

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: "japanese_app_user",
  GRAMMAR_DATA: "japanese_app_grammar",
  VOCABULARY_DATA: "japanese_app_vocabulary",
  REVIEW_HISTORY: "japanese_app_review_history",
  ERROR_LOG: "japanese_app_error_log",
};

// Chart Colors
export const CHART_COLORS = {
  grammar: "#dc3545",
  vocabulary: "#0dcaf0",
  kanji: "#ffc107",
  reading: "#198754",
  listening: "#6f42c1",
};

// File Upload Settings
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: [".xlsx", ".xls", ".csv"],
  SHEET_NAMES: {
    GRAMMAR: "grammar",
    VOCABULARY: "vocabulary",
    KANJI: "kanji",
    CONTRAST: "contrast_card",
  },
};

// Daily Review Time for AI Analysis
export const DAILY_REVIEW_TIME = {
  HOUR: 21,
  MINUTE: 30,
};
