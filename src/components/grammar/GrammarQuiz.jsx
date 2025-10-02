import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { shuffleArray, calculateNextReviewDate } from '../../utils/helpers';
import { useApp } from '../../contexts/AppContext';

const GrammarQuiz = ({ show, onHide, grammarItem, quizType = 'fill_blank' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(5);

  const { addReviewRecord, addErrorLog, grammarItems, setGrammarItems, showNotification } = useApp();

  useEffect(() => {
    if (show && grammarItem) {
      generateQuestion();
    }
  }, [show, grammarItem, quizType]);

  const generateQuestion = () => {
    if (quizType === 'fill_blank') {
      generateFillBlankQuestion();
    } else {
      generateUsageQuestion();
    }
    setSelectedAnswer('');
    setShowResult(false);
  };

  const generateFillBlankQuestion = () => {
    // Create a fill-in-the-blank question
    const sentence = grammarItem.example || '彼は学生___です。';
    const correctAnswer = grammarItem.structure;
    
    // Generate distractors (wrong answers)
    const allGrammar = grammarItems.filter(g => g.id !== grammarItem.id && g.level === grammarItem.level);
    const distractors = shuffleArray(allGrammar).slice(0, 3).map(g => g.structure);
    
    const options = shuffleArray([correctAnswer, ...distractors]);

    setCurrentQuestion({
      type: 'fill_blank',
      sentence: sentence.replace(correctAnswer, '___'),
      correctAnswer,
      options,
      explanation: grammarItem.meaning
    });
  };

  const generateUsageQuestion = () => {
    // Create a usage question
    const question = `Câu nào sử dụng đúng ngữ pháp "${grammarItem.structure}"?`;
    const correctSentence = grammarItem.example;
    
    // Generate wrong sentences
    const wrongSentences = [
      correctSentence.replace('は', 'が'),
      correctSentence.replace('を', 'に'),
      correctSentence.replace(grammarItem.structure, '〜で')
    ];

    const options = shuffleArray([correctSentence, ...wrongSentences.slice(0, 3)]);

    setCurrentQuestion({
      type: 'usage',
      question,
      correctAnswer: correctSentence,
      options,
      explanation: grammarItem.meaning
    });
  };

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update SRS level
    const updatedGrammar = grammarItems.map(item => {
      if (item.id === grammarItem.id) {
        if (correct) {
          return {
            ...item,
            srsLevel: Math.min(item.srsLevel + 1, 6),
            nextReviewDate: calculateNextReviewDate(item.srsLevel + 1)
          };
        } else {
          return {
            ...item,
            srsLevel: 0,
            nextReviewDate: new Date().toISOString(),
            errorCount: (item.errorCount || 0) + 1,
            errorReasons: [
              ...(item.errorReasons || []),
              `Đã chọn: ${selectedAnswer} thay vì ${currentQuestion.correctAnswer}`
            ]
          };
        }
      }
      return item;
    });

    setGrammarItems(updatedGrammar);

    // Add to review history
    addReviewRecord({
      type: 'grammar',
      itemId: grammarItem.id,
      correct,
      question: currentQuestion.sentence || currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer
    });

    // Add to error log if wrong
    if (!correct) {
      addErrorLog({
        type: 'grammar',
        itemId: grammarItem.id,
        question: currentQuestion.sentence || currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation
      });
    }

    showNotification(
      correct ? '🎉 Chính xác!' : '❌ Chưa đúng, hãy xem giải thích',
      correct ? 'success' : 'error'
    );
  };

  const handleNext = () => {
    if (questionNumber < totalQuestions) {
      setQuestionNumber(prev => prev + 1);
      generateQuestion();
    } else {
      showNotification('Hoàn thành bài quiz!', 'success');
      onHide();
    }
  };

  if (!currentQuestion) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCheckCircle className="me-2 text-primary" />
          Quiz: {grammarItem.structure}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Progress */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Câu hỏi {questionNumber}/{totalQuestions}</small>
            <small className="text-muted">{Math.round((questionNumber / totalQuestions) * 100)}%</small>
          </div>
          <ProgressBar now={(questionNumber / totalQuestions) * 100} />
        </div>

        {/* Question */}
        <Alert variant="light" className="mb-3">
          <h5 className="mb-0">
            {currentQuestion.type === 'fill_blank' 
              ? '📝 Điền vào chỗ trống:' 
              : '✅ Chọn câu đúng:'}
          </h5>
        </Alert>

        <div className="mb-4">
          <h4 className="text-center p-3 bg-light rounded">
            {currentQuestion.sentence || currentQuestion.question}
          </h4>
        </div>

        {/* Options */}
        <div className="d-grid gap-2">
          {currentQuestion.options.map((option, idx) => (
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
              className="text-start quiz-option"
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>{option}</span>
                {showResult && option === currentQuestion.correctAnswer && (
                  <FaCheckCircle className="text-success" />
                )}
                {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <FaTimesCircle className="text-danger" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Result and Explanation */}
        {showResult && (
          <Alert variant={isCorrect ? 'success' : 'danger'} className="mt-4">
            <h6 className="mb-2">
              {isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng'}
            </h6>
            <p className="mb-0">
              <strong>Giải thích:</strong> {currentQuestion.explanation}
            </p>
            {!isCorrect && (
              <p className="mb-0 mt-2">
                <strong>Đáp án đúng:</strong> {currentQuestion.correctAnswer}
              </p>
            )}
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
            {questionNumber < totalQuestions ? 'Câu tiếp theo' : 'Hoàn thành'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default GrammarQuiz;