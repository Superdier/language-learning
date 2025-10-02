import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { shuffleArray, calculateNextReviewDate } from '../../utils/helpers';
import { useApp } from '../../contexts/AppContext';

const VocabularyQuiz = ({ show, onHide, item, quizType = 'meaning', type = 'vocabulary' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(5);

  const {
    addReviewRecord,
    addErrorLog,
    vocabularyItems,
    setVocabularyItems,
    kanjiItems,
    setKanjiItems,
    showNotification
  } = useApp();

  useEffect(() => {
    if (show && item) {
      generateQuestion();
    }
  }, [show, item, quizType]);

  const generateQuestion = () => {
    if (quizType === 'meaning') {
      generateMeaningQuestion();
    } else {
      generateUsageQuestion();
    }
    setSelectedAnswer('');
    setShowResult(false);
  };

  const generateMeaningQuestion = () => {
    const allItems = type === 'kanji' ? kanjiItems : vocabularyItems;
    const word = type === 'kanji' ? item.kanji : item.word;
    const correctAnswer = item.meaning;

    // Generate distractors
    const distractors = shuffleArray(
      allItems
        .filter(i => i.id !== item.id && i.level === item.level)
        .map(i => i.meaning)
    ).slice(0, 3);

    const options = shuffleArray([correctAnswer, ...distractors]);

    setCurrentQuestion({
      type: 'meaning',
      word: word,
      reading: type === 'vocabulary' ? item.reading : `${item.onyomi} / ${item.kunyomi}`,
      correctAnswer,
      options,
      explanation: `${word} có nghĩa là: ${correctAnswer}`
    });
  };

  const generateUsageQuestion = () => {
    if (!item.example) {
      generateMeaningQuestion();
      return;
    }

    const word = type === 'kanji' ? item.kanji : item.word;
    const correctSentence = item.example;

    // Generate wrong sentences (simple variations)
    const allItems = type === 'kanji' ? kanjiItems : vocabularyItems;
    const wrongSentences = shuffleArray(
      allItems
        .filter(i => i.id !== item.id && i.example && i.level === item.level)
        .map(i => i.example)
    ).slice(0, 3);

    const options = shuffleArray([correctSentence, ...wrongSentences]);

    setCurrentQuestion({
      type: 'usage',
      question: `Chọn câu sử dụng đúng từ "${word}"`,
      correctAnswer: correctSentence,
      options,
      explanation: item.translation
    });
  };

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update SRS
    const updateFunction = type === 'kanji' ? setKanjiItems : setVocabularyItems;
    const currentItems = type === 'kanji' ? kanjiItems : vocabularyItems;

    const updatedItems = currentItems.map(i => {
      if (i.id === item.id) {
        if (correct) {
          return {
            ...i,
            srsLevel: Math.min(i.srsLevel + 1, 6),
            nextReviewDate: calculateNextReviewDate(i.srsLevel + 1)
          };
        } else {
          return {
            ...i,
            srsLevel: 0,
            nextReviewDate: new Date().toISOString(),
            errorCount: (i.errorCount || 0) + 1,
            errorReasons: [
              ...(i.errorReasons || []),
              `Đã chọn: ${selectedAnswer} thay vì ${currentQuestion.correctAnswer}`
            ]
          };
        }
      }
      return i;
    });

    updateFunction(updatedItems);

    // Add to review history
    addReviewRecord({
      type: type === 'kanji' ? 'kanji' : 'vocabulary',
      itemId: item.id,
      correct,
      question: currentQuestion.word || currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer
    });

    // Add to error log if wrong
    if (!correct) {
      addErrorLog({
        type: type === 'kanji' ? 'kanji' : 'vocabulary',
        itemId: item.id,
        question: currentQuestion.word || currentQuestion.question,
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
          Quiz: {type === 'kanji' ? item.kanji : item.word}
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
            {currentQuestion.type === 'meaning' 
              ? '📝 Nghĩa của từ là gì?' 
              : '✅ Chọn câu đúng:'}
          </h5>
        </Alert>

        <div className="mb-4 text-center">
          {currentQuestion.type === 'meaning' ? (
            <>
              <h1 className="display-4 mb-2">{currentQuestion.word}</h1>
              <p className="text-muted">{currentQuestion.reading}</p>
            </>
          ) : (
            <h5>{currentQuestion.question}</h5>
          )}
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
              className="text-start"
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

        {/* Result */}
        {showResult && (
          <Alert variant={isCorrect ? 'success' : 'danger'} className="mt-4">
            <h6>{isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng'}</h6>
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
            {questionNumber < totalQuestions ? 'Câu tiếp theo' : 'Hoàn thành'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default VocabularyQuiz;