import * as XLSX from "xlsx";
import Papa from "papaparse";
import { FILE_UPLOAD } from "../utils/constants";
import { validateFile, generateId } from "../utils/helpers";

/**
 * Parse Excel file
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheets = {};
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          sheets[sheetName.toLowerCase()] = XLSX.utils.sheet_to_json(
            worksheet,
            {
              header: 1,
              defval: "",
              blankrows: false,
            }
          );
        });

        resolve(sheets);
      } catch (error) {
        reject(new Error("Không thể đọc file Excel: " + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc file"));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse CSV file
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve({ csv: results.data });
      },
      error: (error) => {
        reject(new Error("Không thể đọc file CSV: " + error.message));
      },
      skipEmptyLines: true,
    });
  });
};

/**
 * Process grammar data from sheet
 */
export const processGrammarData = (sheetData) => {
  if (!sheetData || sheetData.length < 2) return [];

  const headers = sheetData[0].map((h) => h.toString().trim().toLowerCase());
  const grammarItems = [];

  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (!row || row.length === 0) continue;

    const item = {
      id: generateId(),
      level: row[headers.indexOf("level")] || "N5",
      structure: row[headers.indexOf("structure")] || "",
      meaning: row[headers.indexOf("meaning")] || "",
      example: row[headers.indexOf("example")] || "",
      translation: row[headers.indexOf("translation")] || "",
      usage: row[headers.indexOf("usage")] || "",
      srsLevel: 0,
      nextReviewDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      errorCount: 0,
      errorReasons: [],
    };

    if (item.structure) {
      grammarItems.push(item);
    }
  }

  return grammarItems;
};

/**
 * Process contrast card data from sheet
 */
export const processContrastCardData = (sheetData) => {
  if (!sheetData || sheetData.length < 2) return [];

  const headers = sheetData[0].map((h) => h.toString().trim().toLowerCase());
  const contrastCards = [];

  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (!row || row.length === 0) continue;

    const card = {
      id: generateId(),
      pairId:
        row[headers.indexOf("pair id")] || row[headers.indexOf("pairid")] || i,
      structureA: row[headers.indexOf("structure a")] || "",
      structureB: row[headers.indexOf("structure b")] || "",
      comparison:
        row[headers.indexOf("short comparison (when to use a vs b)")] ||
        row[headers.indexOf("comparison")] ||
        "",
      exampleA: row[headers.indexOf("structure a - example (jp)")] || "",
      translationA: row[headers.indexOf("structure a - translation")] || "",
      exampleB: row[headers.indexOf("structure b - example (jp)")] || "",
      translationB: row[headers.indexOf("structure b - translation")] || "",
      miniExercise:
        row[headers.indexOf("mini exercise (3 blanks)")] ||
        row[headers.indexOf("exercise")] ||
        "",
      srsLevel: 0,
      nextReviewDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (card.structureA && card.structureB) {
      contrastCards.push(card);
    }
  }

  return contrastCards;
};

/**
 * Process vocabulary data from sheet
 */
export const processVocabularyData = (sheetData) => {
  if (!sheetData || sheetData.length < 2) return [];

  const headers = sheetData[0].map((h) => h.toString().trim().toLowerCase());
  const vocabularyItems = [];

  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (!row || row.length === 0) continue;

    const item = {
      id: generateId(),
      word:
        row[headers.indexOf("word")] ||
        row[headers.indexOf("vocabulary")] ||
        "",
      reading:
        row[headers.indexOf("reading")] ||
        row[headers.indexOf("hiragana")] ||
        "",
      meaning:
        row[headers.indexOf("meaning")] ||
        row[headers.indexOf("vietnamese")] ||
        "",
      example: row[headers.indexOf("example")] || "",
      translation: row[headers.indexOf("translation")] || "",
      partOfSpeech:
        row[headers.indexOf("part of speech")] ||
        row[headers.indexOf("type")] ||
        "",
      level: row[headers.indexOf("level")] || "N5",
      srsLevel: 0,
      nextReviewDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      errorCount: 0,
      errorReasons: [],
    };

    if (item.word) {
      vocabularyItems.push(item);
    }
  }

  return vocabularyItems;
};

/**
 * Process kanji data from sheet
 */
export const processKanjiData = (sheetData) => {
  if (!sheetData || sheetData.length < 2) return [];

  const headers = sheetData[0].map((h) => h.toString().trim().toLowerCase());
  const kanjiItems = [];

  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    if (!row || row.length === 0) continue;

    const item = {
      id: generateId(),
      kanji:
        row[headers.indexOf("kanji")] ||
        row[headers.indexOf("character")] ||
        "",
      onyomi:
        row[headers.indexOf("onyomi")] || row[headers.indexOf("on")] || "",
      kunyomi:
        row[headers.indexOf("kunyomi")] || row[headers.indexOf("kun")] || "",
      meaning:
        row[headers.indexOf("meaning")] ||
        row[headers.indexOf("vietnamese")] ||
        "",
      example: row[headers.indexOf("example")] || "",
      translation: row[headers.indexOf("translation")] || "",
      level: row[headers.indexOf("level")] || "N5",
      srsLevel: 0,
      nextReviewDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      errorCount: 0,
      errorReasons: [],
    };

    if (item.kanji) {
      kanjiItems.push(item);
    }
  }

  return kanjiItems;
};

/**
 * Validate and process uploaded file
 */
export const processUploadedFile = async (file) => {
  // Validate file
  const validation = validateFile(
    file,
    FILE_UPLOAD.MAX_SIZE,
    FILE_UPLOAD.ACCEPTED_TYPES
  );

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Parse file based on type
  const fileExtension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();
  let sheets;

  if (fileExtension === ".csv") {
    sheets = await parseCSVFile(file);
  } else {
    sheets = await parseExcelFile(file);
  }

  // Process data from sheets
  const result = {
    grammarItems: [],
    contrastCards: [],
    vocabularyItems: [],
    kanjiItems: [],
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  };

  // Process each sheet
  Object.keys(sheets).forEach((sheetName) => {
    const sheetData = sheets[sheetName];
    const lowerSheetName = sheetName.toLowerCase();

    if (lowerSheetName.includes("grammar")) {
      result.grammarItems = processGrammarData(sheetData);
    } else if (lowerSheetName.includes("contrast")) {
      result.contrastCards = processContrastCardData(sheetData);
    } else if (
      lowerSheetName.includes("vocabulary") ||
      lowerSheetName.includes("vocab")
    ) {
      result.vocabularyItems = processVocabularyData(sheetData);
    } else if (lowerSheetName.includes("kanji")) {
      result.kanjiItems = processKanjiData(sheetData);
    }
  });

  return result;
};
