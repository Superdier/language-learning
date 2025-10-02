import React, { useState } from "react";
import {
  Card,
  Button,
  Badge,
  Alert,
  Form,
  ListGroup,
  Accordion,
} from "react-bootstrap";
import {
  FaVolumeUp,
  FaStop,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { speakJapanese, stopSpeech } from "../../services/listeningService";

const ListeningExercise = ({ exercise, onComplete }) => {
  const [playing, setPlaying] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [playCount, setPlayCount] = useState(0);

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;
  const hasAnswered = answers[currentQuestion?.id] !== undefined;

  const handlePlay = () => {
    try {
      setPlaying(true);
      setPlayCount((prev) => prev + 1);
      speakJapanese(exercise.audioScript, 0.9);

      // Reset playing state after speech ends (estimate)
      const words = exercise.audioScript.split(/\s+/).length;
      const duration = words * 0.8 * 1000; // Rough estimate
      setTimeout(() => setPlaying(false), duration);
    } catch (error) {
      console.error("Play error:", error);
      setPlaying(false);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setPlaying(false);
  };

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
      exercise.questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResults(true);

      if (onComplete) {
        onComplete({
          exerciseId: exercise.id,
          answers,
          score: correctCount,
          total: exercise.questions.length,
          playCount,
        });
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (showResults) {
    const percentage = Math.round((score / exercise.questions.length) * 100);
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
            Bạn đã trả lời đúng {score}/{exercise.questions.length} câu
          </p>
          <p className="text-muted">Đã nghe: {playCount} lần</p>

          <div className="mt-4">
            <h5 className="mb-3">Chi tiết câu trả lời:</h5>
            <ListGroup>
              {exercise.questions.map((q, idx) => {
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

          {/* Show script after completion */}
          <div className="mt-4">
            <Alert variant="light">
              <h6>📄 Script:</h6>
              <p className="mb-2">{exercise.audioScript}</p>
              <hr />
              <h6>🇻🇳 Bản dịch:</h6>
              <p className="mb-0">{exercise.translation}</p>
            </Alert>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {/* Audio Player */}
      <Card className="card-custom mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">🎧 {exercise.title}</h5>
            <div>
              <Badge bg="primary" className="me-2">
                {exercise.level}
              </Badge>
              <Badge bg="secondary">{exercise.type}</Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="mb-3">
            <strong>💡 Hướng dẫn:</strong> Nghe audio và trả lời các câu hỏi.
            Bạn có thể nghe lại nhiều lần. Đã nghe: <strong>{playCount}</strong>{" "}
            lần
          </Alert>

          <div className="text-center mb-3">
            {!playing ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handlePlay}
                className="px-5"
              >
                <FaVolumeUp className="me-2" />
                {playCount === 0 ? "Phát audio" : "Nghe lại"}
              </Button>
            ) : (
              <Button
                variant="danger"
                size="lg"
                onClick={handleStop}
                className="px-5"
              >
                <FaStop className="me-2" />
                Dừng
              </Button>
            )}
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowScript(!showScript)}
            >
              {showScript ? <FaEyeSlash /> : <FaEye />}{" "}
              {showScript ? "Ẩn" : "Xem"} script
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
            >
              {showTranslation ? <FaEyeSlash /> : <FaEye />}{" "}
              {showTranslation ? "Ẩn" : "Xem"} bản dịch
            </Button>
          </div>

          {showScript && (
            <Alert variant="light" className="mt-3">
              <strong>📄 Script:</strong>
              <p
                className="mb-0 mt-2"
                style={{ whiteSpace: "pre-line", fontSize: "1.1rem" }}
              >
                {exercise.audioScript}
              </p>
            </Alert>
          )}

          {showTranslation && (
            <Alert variant="light" className="mt-3">
              <strong>🇻🇳 Bản dịch:</strong>
              <p className="mb-0 mt-2" style={{ whiteSpace: "pre-line" }}>
                {exercise.translation}
              </p>
            </Alert>
          )}

          {/* Vocabulary */}
          {exercise.vocabulary && exercise.vocabulary.length > 0 && (
            <Accordion className="mt-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  📚 Từ vựng quan trọng ({exercise.vocabulary.length})
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {exercise.vocabulary.map((vocab, idx) => (
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
                ❓ Câu hỏi {currentQuestionIndex + 1}/
                {exercise.questions.length}
              </h6>
              <Badge bg="info">
                {Object.keys(answers).length}/{exercise.questions.length} đã trả
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

export default ListeningExercise;
