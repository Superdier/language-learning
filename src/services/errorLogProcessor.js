import { generateId } from "../utils/helpers";
import { PART_TYPES } from "../utils/constants";

/**
 * Process Error Log data from Google Sheets
 */
export const processErrorLogData = (sheetData) => {
  if (!sheetData || sheetData.length < 2) return [];

  const headers = sheetData[0].map((h) => h.toString().trim().toLowerCase());
  const errorLogs = [];

  // Find column indices
  const getColumnIndex = (possibleNames) => {
    for (const name of possibleNames) {
      const index = headers.indexOf(name.toLowerCase());
      if (index !== -1) return index;
    }
    return -1;
  };

  const indices = {
    no: getColumnIndex(["no.", "no", "number"]),
    date: getColumnIndex(["date", "ngày"]),
    type: getColumnIndex(["type", "loại"]),
    source: getColumnIndex(["source", "nguồn"]),
    part: getColumnIndex(["part", "phần"]),
    passage: getColumnIndex([
      "passage or question (short)",
      "passage",
      "question",
      "câu hỏi",
    ]),
    yourAnswer: getColumnIndex([
      "your answer",
      "câu trả lời của bạn",
      "your answer",
    ]),
    correctAnswer: getColumnIndex(["correct answer", "đáp án đúng", "correct"]),
    explain: getColumnIndex([
      "explain error reason",
      "explain",
      "giải thích",
      "explanation",
    ]),
    action: getColumnIndex(["action", "hành động"]),
    srs: getColumnIndex(["srs?", "srs", "srs card"]),
    plannedReview: getColumnIndex([
      "planned review date",
      "review date",
      "ngày ôn",
    ]),
    status: getColumnIndex(["status", "trạng thái"]),
    notes: getColumnIndex(["notes", "ghi chú"]),
  };

  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (!row || row.length === 0) continue;

    // Skip if no passage/question
    if (indices.passage === -1 || !row[indices.passage]) continue;

    const errorLog = {
      id: generateId(),
      no: indices.no !== -1 ? row[indices.no] : i,
      date:
        indices.date !== -1
          ? parseErrorLogDate(row[indices.date])
          : new Date().toISOString(),
      type: indices.type !== -1 ? row[indices.type] : "",
      source: indices.source !== -1 ? row[indices.source] : "Unknown",
      part:
        indices.part !== -1
          ? normalizePartType(row[indices.part])
          : PART_TYPES.GRAMMAR,
      question: indices.passage !== -1 ? row[indices.passage] : "",
      userAnswer: indices.yourAnswer !== -1 ? row[indices.yourAnswer] : "",
      correctAnswer:
        indices.correctAnswer !== -1 ? row[indices.correctAnswer] : "",
      explanation: indices.explain !== -1 ? row[indices.explain] : "",
      action: indices.action !== -1 ? row[indices.action] : "",
      needsSRS: indices.srs !== -1 ? parseSRSValue(row[indices.srs]) : false,
      plannedReviewDate:
        indices.plannedReview !== -1
          ? parseErrorLogDate(row[indices.plannedReview])
          : null,
      status: indices.status !== -1 ? row[indices.status] : "New",
      notes: indices.notes !== -1 ? row[indices.notes] : "",
      importedAt: new Date().toISOString(),
      itemId: null, // Will be linked later if found in grammar/vocab
    };

    errorLogs.push(errorLog);
  }

  return errorLogs;
};

/**
 * Parse date from various formats
 */
const parseErrorLogDate = (dateValue) => {
  if (!dateValue) return new Date().toISOString();

  try {
    // Try parsing DD/MM/YYYY format
    if (typeof dateValue === "string" && dateValue.includes("/")) {
      const [day, month, year] = dateValue.split("/");
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }

    // Try Excel serial date
    if (typeof dateValue === "number") {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toISOString();
    }

    // Try direct date parse
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }

    return new Date().toISOString();
  } catch (error) {
    console.error("Error parsing date:", error);
    return new Date().toISOString();
  }
};

/**
 * Normalize part type to standard values
 */
const normalizePartType = (part) => {
  if (!part) return PART_TYPES.GRAMMAR;

  const partLower = part.toLowerCase();

  if (partLower.includes("grammar") || partLower.includes("ngữ pháp")) {
    return PART_TYPES.GRAMMAR;
  }
  if (partLower.includes("vocab") || partLower.includes("từ vựng")) {
    return PART_TYPES.VOCABULARY;
  }
  if (partLower.includes("kanji") || partLower.includes("chữ hán")) {
    return PART_TYPES.KANJI;
  }
  if (partLower.includes("reading") || partLower.includes("đọc")) {
    return PART_TYPES.READING;
  }
  if (partLower.includes("listening") || partLower.includes("nghe")) {
    return PART_TYPES.LISTENING;
  }

  return part;
};

/**
 * Parse SRS value (Yes/No, true/false, etc.)
 */
const parseSRSValue = (value) => {
  if (!value) return false;

  const valueLower = value.toString().toLowerCase().trim();
  return (
    valueLower === "yes" ||
    valueLower === "true" ||
    valueLower === "1" ||
    valueLower === "có"
  );
};

/**
 * Convert error log to review items based on part type
 */
export const convertErrorLogToReviewItems = (
  errorLogs,
  existingGrammar,
  existingVocab,
  existingKanji
) => {
  const newItems = {
    grammar: [],
    vocabulary: [],
    kanji: [],
  };

  errorLogs.forEach((log) => {
    if (log.status === "Done" || log.status === "Archived") return;
    if (!log.needsSRS) return;

    const baseItem = {
      id: generateId(),
      source: log.source,
      question: log.question,
      correctAnswer: log.correctAnswer,
      errorReason: log.explanation,
      srsLevel: 0,
      nextReviewDate: log.plannedReviewDate || new Date().toISOString(),
      errorCount: 1,
      errorReasons: [log.explanation],
      createdAt: log.date,
      importedFrom: "error_log",
    };

    switch (log.part) {
      case PART_TYPES.GRAMMAR:
        // Try to extract grammar structure from question
        const grammarStructure = extractGrammarStructure(
          log.question,
          log.correctAnswer
        );

        // Check if already exists
        const existsGrammar = existingGrammar.find(
          (g) =>
            g.structure === grammarStructure ||
            g.example?.includes(log.question)
        );

        if (!existsGrammar) {
          newItems.grammar.push({
            ...baseItem,
            structure: grammarStructure,
            meaning: log.explanation,
            example: log.question,
            translation: "",
            usage: log.action || "",
            level: guessJLPTLevel(log.source),
          });
        }
        break;

      case PART_TYPES.VOCABULARY:
        // Extract vocabulary from question
        const vocab = extractVocabulary(log.question, log.correctAnswer);

        const existsVocab = existingVocab.find((v) => v.word === vocab.word);

        if (!existsVocab && vocab.word) {
          newItems.vocabulary.push({
            ...baseItem,
            word: vocab.word,
            reading: vocab.reading || "",
            meaning: log.explanation || log.correctAnswer,
            example: log.question,
            translation: "",
            partOfSpeech: "",
            level: guessJLPTLevel(log.source),
          });
        }
        break;

      case PART_TYPES.KANJI:
        const kanji = extractKanji(log.question, log.correctAnswer);

        const existsKanji = existingKanji.find((k) => k.kanji === kanji.kanji);

        if (!existsKanji && kanji.kanji) {
          newItems.kanji.push({
            ...baseItem,
            kanji: kanji.kanji,
            onyomi: kanji.onyomi || "",
            kunyomi: kanji.kunyomi || "",
            meaning: log.explanation || log.correctAnswer,
            example: log.question,
            translation: "",
            level: guessJLPTLevel(log.source),
          });
        }
        break;
    }
  });

  return newItems;
};

/**
 * Extract grammar structure from question/answer
 */
const extractGrammarStructure = (question, answer) => {
  // Try to find grammar pattern in parentheses or highlighted
  const patterns = [
    /[（(]([^）)]+)[）)]/g, // Content in parentheses
    /[「『]([^」』]+)[」』]/g, // Content in Japanese quotes
    /～[^\s、。]+/g, // Patterns starting with ～
  ];

  for (const pattern of patterns) {
    const matches = question.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0].replace(/[（）()「」『』]/g, "");
    }
  }

  // If answer looks like a grammar pattern
  if (answer && (answer.includes("～") || answer.length < 10)) {
    return answer;
  }

  return "文法パターン";
};

/**
 * Extract vocabulary from question/answer
 */
const extractVocabulary = (question, answer) => {
  // Look for word in parentheses (often the answer format)
  const wordMatch =
    question.match(/（([^）]+)）/) || answer.match(/（([^）]+)）/);

  if (wordMatch) {
    return {
      word: wordMatch[1],
      reading: "",
    };
  }

  // Look for kanji followed by hiragana
  const kanjiMatch = answer.match(/([一-龯]+)([ぁ-ん]*)/);
  if (kanjiMatch) {
    return {
      word: kanjiMatch[1],
      reading: kanjiMatch[2] || "",
    };
  }

  return {
    word: answer || "単語",
    reading: "",
  };
};

/**
 * Extract kanji from question/answer
 */
const extractKanji = (question, answer) => {
  // Extract first kanji character
  const kanjiMatch = (answer || question).match(/[一-龯]/);

  return {
    kanji: kanjiMatch ? kanjiMatch[0] : "字",
    onyomi: "",
    kunyomi: "",
  };
};

/**
 * Guess JLPT level from source
 */
const guessJLPTLevel = (source) => {
  const sourceLower = source.toLowerCase();

  if (sourceLower.includes("n5")) return "N5";
  if (sourceLower.includes("n4")) return "N4";
  if (sourceLower.includes("n3")) return "N3";
  if (sourceLower.includes("n2")) return "N2";
  if (sourceLower.includes("n1")) return "N1";

  return "N3"; // Default
};

/**
 * Get statistics from error log
 */
export const getErrorLogStatistics = (errorLogs) => {
  const stats = {
    total: errorLogs.length,
    byPart: {},
    bySource: {},
    byStatus: {},
    needsSRS: 0,
    recentErrors: [],
  };

  errorLogs.forEach((log) => {
    // By part
    stats.byPart[log.part] = (stats.byPart[log.part] || 0) + 1;

    // By source
    stats.bySource[log.source] = (stats.bySource[log.source] || 0) + 1;

    // By status
    stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;

    // Needs SRS
    if (log.needsSRS) {
      stats.needsSRS++;
    }
  });

  // Recent errors (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  stats.recentErrors = errorLogs.filter((log) => {
    const logDate = new Date(log.date);
    return logDate > thirtyDaysAgo;
  }).length;

  return stats;
};
