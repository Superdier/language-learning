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
import { FaHeadphones, FaPlus, FaSpinner } from "react-icons/fa";
import { useApp } from "../contexts/AppContext";
import ListeningExercise from "../components/listening/ListeningExercise";
import {
  generateListeningExercise,
  getMockListeningExercises,
} from "../services/listeningService";

const Listening = () => {
  const { showNotification, addReviewRecord } = useApp();

  const [exercises, setExercises] = useState(getMockListeningExercises());
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const [generatorForm, setGeneratorForm] = useState({
    level: "beginner",
    topic: "",
    type: "dialogue",
  });

  const handleGenerateExercise = async () => {
    if (!generatorForm.topic.trim()) {
      showNotification("Vui lòng nhập chủ đề", "error");
      return;
    }

    setGenerating(true);
    try {
      const exercise = await generateListeningExercise(
        generatorForm.level,
        generatorForm.topic,
        generatorForm.type
      );

      const newExercise = {
        id: `listening-${Date.now()}`,
        ...exercise,
      };

      setExercises([newExercise, ...exercises]);
      setSelectedExercise(newExercise);
      setShowGenerator(false);
      setGeneratorForm({ level: "beginner", topic: "", type: "dialogue" });
      showNotification("Đã tạo bài nghe mới!", "success");
    } catch (error) {
      showNotification("Lỗi khi tạo bài nghe: " + error.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleCompleteListening = (result) => {
    // Save to review history
    addReviewRecord({
      type: "listening",
      itemId: result.exerciseId,
      correct: result.score === result.total,
      question: `Nghe hiểu: ${
        exercises.find((e) => e.id === result.exerciseId)?.title
      }`,
      userAnswer: `${result.score}/${result.total} (${result.playCount} lần nghe)`,
      correctAnswer: `${result.total}/${result.total}`,
    });

    showNotification(
      `Hoàn thành! Điểm: ${result.score}/${result.total}`,
      result.score >= result.total * 0.8 ? "success" : "info"
    );
  };

  if (selectedExercise) {
    return (
      <Container fluid>
        <div className="mb-4">
          <Button
            variant="outline-secondary"
            onClick={() => setSelectedExercise(null)}
          >
            ← Quay lại danh sách
          </Button>
        </div>

        <ListeningExercise
          exercise={selectedExercise}
          onComplete={handleCompleteListening}
        />
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">🎧 Nghe hiểu</h2>
        <p className="text-muted">Luyện tập kỹ năng nghe hiểu tiếng Nhật</p>
      </div>

      <Alert variant="info" className="mb-4">
        <strong>💡 Hướng dẫn:</strong> Chọn bài nghe phù hợp với trình độ của
        bạn. Nghe audio và trả lời các câu hỏi. Bạn có thể nghe lại nhiều lần
        trước khi trả lời.
        <br />
        <small className="text-muted">
          Audio sử dụng Web Speech API của trình duyệt. Một số trình duyệt có
          thể cần kết nối internet.
        </small>
      </Alert>

      {/* Generator */}
      <Card className="card-custom mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaPlus className="me-2" />
              Tạo bài nghe mới
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
                    <option value="dialogue">Hội thoại</option>
                    <option value="announcement">Thông báo</option>
                    <option value="monologue">Độc thoại</option>
                    <option value="news">Tin tức</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Chủ đề</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VD: 買い物、天気、レストラン..."
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
              onClick={handleGenerateExercise}
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
                  Tạo bài nghe
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

      {/* Exercises List */}
      <h5 className="mb-3">🎧 Danh sách bài nghe ({exercises.length})</h5>

      {exercises.length === 0 ? (
        <Card className="card-custom">
          <Card.Body className="text-center py-5">
            <FaHeadphones size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0">
              Chưa có bài nghe nào. Hãy tạo bài nghe mới!
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {exercises.map((exercise) => (
            <Col md={6} lg={4} key={exercise.id} className="mb-4">
              <Card className="card-custom h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="mb-0">{exercise.title}</h6>
                    <Badge bg="primary">{exercise.level}</Badge>
                  </div>

                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">
                      {exercise.type}
                    </Badge>
                    <Badge bg="info">
                      {exercise.questions?.length || 0} câu hỏi
                    </Badge>
                  </div>

                  <p className="text-muted small mb-3">
                    Chủ đề: {exercise.topic}
                  </p>

                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <FaHeadphones className="me-2" />
                    Bắt đầu nghe
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

export default Listening;
