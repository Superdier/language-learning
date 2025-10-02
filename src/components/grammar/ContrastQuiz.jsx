import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { shuffleArray } from '../../utils/helpers';
import { useApp } from '../../contexts/AppContext';

const ContrastQuiz = ({ show, onHide, contrastCard }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { addReviewRecord, addErrorLog, showNotification } = useApp();

  useEffect(() => {
    if (show && contrastCard) {
      generateQuestions();
    }
  }, [show, contrastCard]);

  const generateQuestions = () => {
    const questionList = [];

    // Question 1: From example A
    questionList.push({
      sentence: contrastCard.exampleA.replace(contrastCard.structureA, '___'),
      correctAnswer: contrastCard.structureA,
      wrongAnswer: contrastCard.structureB,
      explanation: `Dùng "${contrastCard.structureA}" vì ${contrastCard.comparison}`
    });

    // Question 2: From example B
    questionList.push({
      sentence: contrastCard.exampleB.replace(contrastCard.structureB, '___'),
      correctAnswer: contrastCard.structureB,
      wrongAnswer: contrastCard.structureA,
      explanation: `Dùng "${contrastCard.structureB}" vì ${contrastCard.comparison}`
    });

    // Question 3: From mini exercise (if available)
    if (contrastCard.miniExercise) {
      questionList.push({
        sentence: contrastCard.miniExercise,
        correctAnswer: Math.random() > 0.5 ? contrastCard.structureA : contrastCard.structureB,
        wrongAnswer: Math.random() > 0.5 ? contrastCard.structureB : contrastCard.structureA,
        explanation: contrastCard.comparison
      });
    }

    setQuestions(shuffleArray(questionList));
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);

    if (correct) {
      setScore(prev => prev + 1);
    }

    // Add to review history
    addReviewRecord({
      type: 'grammar',
      itemId: contrastCard.id,
      correct,
      question: currentQuestion.sentence,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer
    });

    // Add to error log if wrong
    if (!correct) {
      addErrorLog({
        type: 'grammar',
        itemId: contrastCard.id,
        question: currentQuestion.sentence,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation
      });
    }

    showNotification(
      correct ? '🎉 Chính xác!' : '❌ Chưa đúng',
      correct ? 'success' : 'error'
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      showNotification(
        `Hoàn thành! Điểm số: ${score}/${questions.length}`,
        score === questions.length ? 'success' : 'info'
      );
      onHide();
    }
  };

  if (!currentQuestion) return null;

  const options = shuffleArray([
    currentQuestion.correctAnswer,
    currentQuestion.wrongAnswer
  ]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Quiz: {contrastCard.structureA} vs {contrastCard.structureB}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Score */}
        <div className="text-center mb-4">
          <Badge bg="info" className="fs-6">
            Câu {currentQuestionIndex + 1}/{questions.length} | Điểm: {score}
          </Badge>
        </div>

        {/* Question */}
        <Alert variant="light">
          <h5 className="mb-0">📝 Chọn ngữ pháp phù hợp:</h5>
        </Alert>

        <div className="mb-4">
          <h4 className="text-center p-3 bg-light rounded">
            {currentQuestion.sentence}
          </h4>
        </div>

        {/* Options */}
        <div className="d-grid gap-2">
          {options.map((option, idx) => (
            <Button
              key={idx}
              variant={
                showResult
                  ? option === currentQuestion.correctAnswer
                    ? 'success'
                    : selectedAnswer === option
                    ? 'danger'
                    : 'outline-secondary'
                  : selectedAnswer === option
                  ? 'primary'
                  : 'outline-primary'
              }
              size="lg"
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>{option}</span>
                {showResult && option === currentQuestion.correctAnswer && (
                  <FaCheckCircle />
                )}
                {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <FaTimesCircle />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Explanation */}
        {showResult && (
          <Alert variant={selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'danger'} className="mt-4">
            <h6>
              {selectedAnswer === currentQuestion.correctAnswer ? '✅ Chính xác!' : '❌ Chưa đúng'}
            </h6>
            <p className="mb-0">
              <strong>Giải thích:</strong> {currentQuestion.explanation}
            </p>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Đóng
        </Button>
        {!showResult ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Kiểm tra
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ContrastQuiz;