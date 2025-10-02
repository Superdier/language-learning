import React, { useState } from "react";
import {
  Card,
  Button,
  Badge,
  Accordion,
  ListGroup,
  Form,
  Alert,
} from "react-bootstrap";
import {
  FaBook,
  FaVolumeUp,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const ReadingPassage = ({ passage, onComplete }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = passage.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === passage.questions.length - 1;
  const hasAnswered = answers[currentQuestion?.id] !== undefined;

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate score
      let correctCount = 0;
      passage.questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResults(true);

      if (onComplete) {
        onComplete({
          passageId: passage.id,
          answers,
          score: correctCount,
          total: passage.questions.length,
        });
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (showResults) {
    const percentage = Math.round((score / passage.questions.length) * 100);
    return (
      <Card className="card-custom">
        <Card.Body className="text-center py-5">
          <h2 className="mb-4">🎉 Hoàn thành!</h2>
          <h1
            className={`display-1 ${
              percentage >= 80
                ? "text-success"
                : percentage >= 60
                ? "text-warning"
                : "text-danger"
            }`}
          >
            {percentage}%
          </h1>
          <p className="lead">
            Bạn đã trả lời đúng {score}/{passage.questions.length} câu
          </p>

          <div className="mt-4">
            <h5 className="mb-3">Chi tiết câu trả lời:</h5>
            <ListGroup>
              {passage.questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <ListGroup.Item
                    key={q.id}
                    className={isCorrect ? "border-success" : "border-danger"}
                  >
                    <div className="d-flex align-items-start">
                      {isCorrect ? (
                        <FaCheckCircle className="text-success me-2 mt-1" />
                      ) : (
                        <FaTimesCircle className="text-danger me-2 mt-1" />
                      )}
                      <div className="flex-grow-1">
                        <strong>Câu {idx + 1}:</strong> {q.question}
                        <br />
                        <small className="text-muted">
                          Bạn chọn: <strong>{userAnswer}</strong>
                          {!isCorrect && (
                            <>
                              {" "}
                              | Đáp án đúng:{" "}
                              <strong className="text-success">
                                {q.correctAnswer}
                              </strong>
                            </>
                          )}
                        </small>
                        {!isCorrect && q.explanation && (
                          <Alert variant="info" className="mt-2 mb-0">
                            <small>{q.explanation}</small>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {/* Passage */}
      <Card className="card-custom mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaBook className="me-2" />
              {passage.title}
            </h5>
            <div>
              <Badge bg="primary" className="me-2">
                {passage.level}
              </Badge>
              <Badge bg="secondary">{passage.type}</Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>📄 Bài đọc:</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => speakText(passage.passage)}
              >
                <FaVolumeUp className="me-1" />
                Phát âm
              </Button>
            </div>
            <div
              className="p-3 bg-light rounded"
              style={{ fontSize: "1.1rem", lineHeight: "2" }}
            >
              {passage.passage}
            </div>
          </div>

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? "Ẩn" : "Hiện"} bản dịch
          </Button>

          {showTranslation && (
            <Alert variant="light" className="mt-3">
              <strong>Bản dịch:</strong>
              <p className="mb-0 mt-2">{passage.translation}</p>
            </Alert>
          )}

          {/* Vocabulary */}
          {passage.vocabulary && passage.vocabulary.length > 0 && (
            <Accordion className="mt-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  📚 Từ vựng quan trọng ({passage.vocabulary.length})
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {passage.vocabulary.map((vocab, idx) => (
                      <ListGroup.Item key={idx}>
                        <strong>{vocab.word}</strong> ({vocab.reading})
                        <br />
                        <small className="text-muted">{vocab.meaning}</small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
        </Card.Body>
      </Card>

      {/* Question */}
      {currentQuestion && (
        <Card className="card-custom">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                ❓ Câu hỏi {currentQuestionIndex + 1}/{passage.questions.length}
              </h6>
              <Badge bg="info">
                {Object.keys(answers).length}/{passage.questions.length} đã trả
                lời
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <h5 className="mb-4">{currentQuestion.question}</h5>

            <Form>
              {currentQuestion.options.map((option, idx) => (
                <Form.Check
                  key={idx}
                  type="radio"
                  id={`option-${idx}`}
                  name="answer"
                  label={option}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="mb-3 p-3 border rounded"
                  style={{ fontSize: "1.05rem" }}
                />
              ))}
            </Form>

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
              >
                ← Câu trước
              </Button>

              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!hasAnswered}
              >
                {isLastQuestion ? "Hoàn thành" : "Câu tiếp theo →"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ReadingPassage;
