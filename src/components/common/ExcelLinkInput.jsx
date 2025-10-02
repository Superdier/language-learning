import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  InputGroup,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  FaLink,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useApp } from "../../contexts/AppContext";
import {
  validateSheetsUrl,
  extractSpreadsheetId,
  testConnection,
  fetchAllSheets,
  sheetDataToJson,
} from "../../services/googleSheetsService";
import {
  processGrammarData,
  processVocabularyData,
  processKanjiData,
  processContrastCardData,
} from "../../services/fileUpload";

const ExcelLinkInput = () => {
  const [sheetsLink, setSheetsLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const {
    setGrammarItems,
    setVocabularyItems,
    setKanjiItems,
    setContrastCards,
    grammarItems,
    vocabularyItems,
    kanjiItems,
    contrastCards,
    showNotification,
  } = useApp();

  const handleTestConnection = async () => {
    if (!sheetsLink.trim()) {
      setError("Vui lòng nhập link Google Sheets");
      return;
    }

    if (!validateSheetsUrl(sheetsLink)) {
      setError("Link không hợp lệ. Vui lòng sử dụng link Google Sheets");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await testConnection(sheetsLink);
      setTestResult(result);
      showNotification("Kết nối thành công!", "success");
    } catch (err) {
      setError(err.message);
      setTestResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    if (!testResult) {
      setError("Vui lòng test kết nối trước");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const spreadsheetId = extractSpreadsheetId(sheetsLink);
      const sheetsData = await fetchAllSheets(spreadsheetId);

      let importedCount = {
        grammar: 0,
        vocabulary: 0,
        kanji: 0,
        contrast: 0,
      };

      // Process Grammar
      if (sheetsData.grammar) {
        const grammarData = processGrammarData(sheetsData.grammar);
        setGrammarItems([...grammarItems, ...grammarData]);
        importedCount.grammar = grammarData.length;
      }

      // Process Vocabulary
      if (sheetsData.vocabulary || sheetsData.vocab) {
        const vocabData = processVocabularyData(
          sheetsData.vocabulary || sheetsData.vocab
        );
        setVocabularyItems([...vocabularyItems, ...vocabData]);
        importedCount.vocabulary = vocabData.length;
      }

      // Process Kanji
      if (sheetsData.kanji) {
        const kanjiData = processKanjiData(sheetsData.kanji);
        setKanjiItems([...kanjiItems, ...kanjiData]);
        importedCount.kanji = kanjiData.length;
      }

      // Process Contrast Cards
      if (sheetsData.contrast_card || sheetsData["contrast card"]) {
        const contrastData = processContrastCardData(
          sheetsData.contrast_card || sheetsData["contrast card"]
        );
        setContrastCards([...contrastCards, ...contrastData]);
        importedCount.contrast = contrastData.length;
      }

      const total = Object.values(importedCount).reduce(
        (sum, val) => sum + val,
        0
      );

      if (total === 0) {
        setError("Không tìm thấy dữ liệu hợp lệ trong các sheet");
      } else {
        showNotification(
          `Đã import ${total} mục thành công! ` +
            `(Grammar: ${importedCount.grammar}, Vocab: ${importedCount.vocabulary}, ` +
            `Kanji: ${importedCount.kanji}, Contrast: ${importedCount.contrast})`,
          "success"
        );
        setSheetsLink("");
        setTestResult(null);
      }
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h6 className="mb-3">🔗 Kết nối với Google Sheets</h6>

      <Alert variant="info" className="mb-3">
        <small>
          <strong>Hướng dẫn:</strong>
          <br />
          1. Mở Google Sheets của bạn
          <br />
          2. Click "Share" → "Anyone with the link" → "Viewer"
          <br />
          3. Copy link và paste vào đây
          <br />
          4. Đảm bảo các sheet có tên: <Badge bg="danger">grammar</Badge>{" "}
          <Badge bg="info">vocabulary</Badge>{" "}
          <Badge bg="secondary">kanji</Badge>{" "}
          <Badge bg="warning">contrast_card</Badge>
        </small>
      </Alert>

      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaLink />
        </InputGroup.Text>
        <Form.Control
          type="url"
          placeholder="https://docs.google.com/spreadsheets/d/..."
          value={sheetsLink}
          onChange={(e) => {
            setSheetsLink(e.target.value);
            setError(null);
            setTestResult(null);
          }}
          disabled={loading}
        />
      </InputGroup>

      <div className="d-grid gap-2 mb-3">
        <Button
          variant="outline-primary"
          onClick={handleTestConnection}
          disabled={loading || !sheetsLink.trim()}
        >
          {loading ? "Đang kiểm tra..." : "Test kết nối"}
        </Button>

        {testResult && (
          <Button
            variant="primary"
            onClick={handleFetchData}
            disabled={loading}
          >
            <FaDownload className="me-2" />
            {loading ? "Đang lấy dữ liệu..." : "Lấy dữ liệu"}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {testResult && (
        <Alert variant="success">
          <div className="d-flex align-items-center mb-2">
            <FaCheckCircle className="me-2" />
            <strong>Kết nối thành công!</strong>
          </div>
          <ListGroup variant="flush" className="mt-2">
            <ListGroup.Item>
              <strong>Tên file:</strong> {testResult.title}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Số sheet:</strong> {testResult.sheetCount}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Các sheet:</strong>
              <div className="mt-2">
                {testResult.sheets.map((sheet, idx) => (
                  <Badge key={idx} bg="secondary" className="me-2 mb-1">
                    {sheet}
                  </Badge>
                ))}
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Alert>
      )}

      <Alert variant="warning">
        <small>
          <strong>⚠️ Lưu ý quan trọng:</strong>
          <ul className="mb-0 mt-2">
            <li>Sheet phải được công khai (Anyone with the link can view)</li>
            <li>
              Tên sheet phải đúng: grammar, vocabulary, kanji, contrast_card
            </li>
            <li>Cấu trúc dữ liệu phải giống như khi upload file Excel</li>
            <li>Dữ liệu sẽ được merge với dữ liệu hiện có</li>
          </ul>
        </small>
      </Alert>
    </div>
  );
};

export default ExcelLinkInput;
