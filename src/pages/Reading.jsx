import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { FaBook, FaPlus, FaSpinner } from "react-icons/fa";
import { useApp } from "../contexts/AppContext";
import ReadingPassage from "../components/reading/ReadingPassage";
import {
  generateReadingPassage,
  getMockReadingPassages,
} from "../services/readingService";
import { READING_LEVELS } from "../utils/constants";

const Reading = () => {
  const { showNotification, addReviewRecord } = useApp();

  const [passages, setPassages] = useState(getMockReadingPassages());
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const [generatorForm, setGeneratorForm] = useState({
    level: "beginner",
    topic: "",
    type: "short_passage",
  });

  const handleGeneratePassage = async () => {
    if (!generatorForm.topic.trim()) {
      showNotification("Vui lòng nhập chủ đề", "error");
      return;
    }

    setGenerating(true);
    try {
      const passage = await generateReadingPassage(
        generatorForm.level,
        generatorForm.topic,
        generatorForm.type
      );

      const newPassage = {
        id: `reading-${Date.now()}`,
        ...passage,
      };

      setPassages([newPassage, ...passages]);
      setSelectedPassage(newPassage);
      setShowGenerator(false);
      setGeneratorForm({ level: "beginner", topic: "", type: "short_passage" });
      showNotification("Đã tạo bài đọc mới!", "success");
    } catch (error) {
      showNotification("Lỗi khi tạo bài đọc: " + error.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleCompleteReading = (result) => {
    // Save to review history
    addReviewRecord({
      type: "reading",
      itemId: result.passageId,
      correct: result.score === result.total,
      question: `Đọc hiểu: ${
        passages.find((p) => p.id === result.passageId)?.title
      }`,
      userAnswer: `${result.score}/${result.total}`,
      correctAnswer: `${result.total}/${result.total}`,
    });

    showNotification(
      `Hoàn thành! Điểm: ${result.score}/${result.total}`,
      result.score >= result.total * 0.8 ? "success" : "info"
    );
  };

  if (selectedPassage) {
    return (
      <Container fluid>
        <div className="mb-4">
          <Button
            variant="outline-secondary"
            onClick={() => setSelectedPassage(null)}
          >
            ← Quay lại danh sách
          </Button>
        </div>

        <ReadingPassage
          passage={selectedPassage}
          onComplete={handleCompleteReading}
        />
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">📖 Đọc hiểu</h2>
        <p className="text-muted">Luyện tập kỹ năng đọc hiểu tiếng Nhật</p>
      </div>

      <Alert variant="info" className="mb-4">
        <strong>💡 Hướng dẫn:</strong> Chọn bài đọc phù hợp với trình độ của
        bạn. Đọc kỹ đoạn văn, sau đó trả lời các câu hỏi. Bạn có thể xem bản
        dịch và từ vựng để hỗ trợ.
      </Alert>

      {/* Generator */}
      <Card className="card-custom mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaPlus className="me-2" />
              Tạo bài đọc mới
            </h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowGenerator(!showGenerator)}
            >
              {showGenerator ? "Ẩn" : "Hiện"}
            </Button>
          </div>
        </Card.Header>

        {showGenerator && (
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cấp độ</Form.Label>
                  <Form.Select
                    value={generatorForm.level}
                    onChange={(e) =>
                      setGeneratorForm({
                        ...generatorForm,
                        level: e.target.value,
                      })
                    }
                  >
                    <option value="beginner">Sơ cấp (N5-N4)</option>
                    <option value="intermediate">Trung cấp (N3-N2)</option>
                    <option value="advanced">Nâng cao (N1)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Loại bài</Form.Label>
                  <Form.Select
                    value={generatorForm.type}
                    onChange={(e) =>
                      setGeneratorForm({
                        ...generatorForm,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="short_passage">Đoạn văn ngắn</option>
                    <option value="article">Bài báo</option>
                    <option value="dialogue">Hội thoại</option>
                    <option value="story">Truyện ngắn</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Chủ đề</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VD: 自己紹介、旅行、食べ物..."
                    value={generatorForm.topic}
                    onChange={(e) =>
                      setGeneratorForm({
                        ...generatorForm,
                        topic: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              onClick={handleGeneratePassage}
              disabled={generating || !generatorForm.topic.trim()}
            >
              {generating ? (
                <>
                  <FaSpinner className="spinner-border spinner-border-sm me-2" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FaPlus className="me-2" />
                  Tạo bài đọc
                </>
              )}
            </Button>

            <Alert variant="warning" className="mt-3 mb-0">
              <small>
                <strong>⚠️ Lưu ý:</strong> Tính năng này yêu cầu Google AI API.
                {!import.meta.env.VITE_GOOGLE_AI_API_KEY && (
                  <>
                    {" "}
                    Vui lòng cấu hình <code>VITE_GOOGLE_AI_API_KEY</code> để sử
                    dụng.
                  </>
                )}
              </small>
            </Alert>
          </Card.Body>
        )}
      </Card>

      {/* Passages List */}
      <h5 className="mb-3">📚 Danh sách bài đọc ({passages.length})</h5>

      {passages.length === 0 ? (
        <Card className="card-custom">
          <Card.Body className="text-center py-5">
            <FaBook size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0">
              Chưa có bài đọc nào. Hãy tạo bài đọc mới!
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {passages.map((passage) => (
            <Col md={6} lg={4} key={passage.id} className="mb-4">
              <Card className="card-custom h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="mb-0">{passage.title}</h6>
                    <Badge bg="primary">{passage.level}</Badge>
                  </div>

                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">
                      {passage.type}
                    </Badge>
                    <Badge bg="info">
                      {passage.questions?.length || 0} câu hỏi
                    </Badge>
                  </div>

                  <p
                    className="text-muted small mb-3"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {passage.passage}
                  </p>

                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setSelectedPassage(passage)}
                  >
                    <FaBook className="me-2" />
                    Bắt đầu đọc
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Reading;
