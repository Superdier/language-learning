import { processErrorLogData } from "./errorLogProcessor";

/**
 * Google Sheets Service
 * Fetch data from public Google Sheets
 */

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

/**
 * Extract spreadsheet ID from Google Sheets URL
 */
export const extractSpreadsheetId = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

/**
 * Fetch sheet data from Google Sheets
 */
export const fetchSheetData = async (spreadsheetId, sheetName) => {
  if (!API_KEY) {
    throw new Error("Google Sheets API key not configured");
  }

  try {
    const range = `${sheetName}!A1:ZZ`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch sheet data");
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("Fetch sheet data error:", error);
    throw error;
  }
};

/**
 * Fetch all sheets from spreadsheet
 */
export const fetchAllSheets = async (spreadsheetId) => {
  if (!API_KEY) {
    throw new Error("Google Sheets API key not configured");
  }

  try {
    // First, get spreadsheet metadata to list all sheets
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`;
    const metadataResponse = await fetch(metadataUrl);

    if (!metadataResponse.ok) {
      throw new Error("Failed to fetch spreadsheet metadata");
    }

    const metadata = await metadataResponse.json();
    const sheetNames = metadata.sheets.map((sheet) => sheet.properties.title);

    // Fetch data from all sheets
    const sheetsData = {};

    for (const sheetName of sheetNames) {
      try {
        const data = await fetchSheetData(spreadsheetId, sheetName);
        sheetsData[sheetName.toLowerCase()] = data;
      } catch (error) {
        console.error(`Error fetching sheet ${sheetName}:`, error);
      }
    }

    return sheetsData;
  } catch (error) {
    console.error("Fetch all sheets error:", error);
    throw error;
  }
};

/**
 * Validate Google Sheets URL
 */
export const validateSheetsUrl = (url) => {
  const patterns = [
    /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/,
    /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9-_]+/,
  ];

  return patterns.some((pattern) => pattern.test(url));
};

/**
 * Convert sheet data to JSON format
 */
export const sheetDataToJson = (sheetData) => {
  if (!sheetData || sheetData.length === 0) {
    return [];
  }

  const headers = sheetData[0].map((h) => h.toString().trim().toLowerCase());
  const rows = sheetData.slice(1);

  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });
};

/**
 * Test connection to Google Sheets
 */
export const testConnection = async (url) => {
  const spreadsheetId = extractSpreadsheetId(url);

  if (!spreadsheetId) {
    throw new Error("Invalid Google Sheets URL");
  }

  try {
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${API_KEY}`;
    const response = await fetch(metadataUrl);

    if (!response.ok) {
      const error = await response.json();

      if (error.error?.status === "PERMISSION_DENIED") {
        throw new Error(
          'Sheet chưa được công khai. Vui lòng share sheet với "Anyone with the link can view"'
        );
      }

      throw new Error(error.error?.message || "Failed to connect");
    }

    const metadata = await response.json();
    return {
      success: true,
      title: metadata.properties?.title,
      sheetCount: metadata.sheets?.length || 0,
      sheets: metadata.sheets?.map((s) => s.properties.title) || [],
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch and process Error Log from Google Sheets
 */
export const fetchErrorLog = async (
  spreadsheetId,
  sheetName = "Error Log Template"
) => {
  try {
    const data = await fetchSheetData(spreadsheetId, sheetName);
    const errorLogs = processErrorLogData(data);
    return errorLogs;
  } catch (error) {
    console.error("Fetch error log error:", error);
    throw error;
  }
};
