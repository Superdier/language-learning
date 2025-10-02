import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa';
import { shuffleArray, calculateNextReviewDate } from '../../utils/helpers';
import { useApp } from '../../contexts/AppContext';

const ReviewSession = ({ show, onHide, items, sessionType = 'all' }) => {
  const [sessionItems, setSessionItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const {
    addReviewRecord,
    addErrorLog,
    grammarItems,
    setGrammarItems,
    vocabularyItems,
    setVocabularyItems,
    kanjiItems,
    setKanjiItems,
    contrastCards,
    setContrastCards,
    showNotification
  } = useApp();

  useEffect(() => {
    if (show && items && items.length > 0) {
      const shuffled = shuffleArray(items);
      setSessionItems(shuffled);
      setCurrentIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      generateQuestionForItem(shuffled[0]);
    }
  }, [show, items]);

  const generateQuestionForItem = (item) => {
    if (!item) return;

    const allItemsOfType = getAllItemsOfType(item.type);
    
    if (item.type === 'grammar') {
      generateGrammarQuestion(item, allItemsOfType);
    } else if (item.type === 'vocabulary') {
      generateVocabularyQuestion(item, allItemsOfType);
    } else if (item.type === 'kanji') {
      generateKanjiQuestion(item, allItemsOfType);
    } else if (item.type === 'contrast') {
      generateContrastQuestion(item);
    }

    setSelectedAnswer('');
    setShowResult(false);
  };

  const getAllItemsOfType = (type) => {
    switch (type) {
      case 'grammar':
        return grammarItems;
      case 'vocabulary':
        return vocabularyItems;
      case 'kanji':
        return kanjiItems;
      case 'contrast':
        return contrastCards;
      default:
        return [];
    }
  };

  const generateGrammarQuestion = (item, allGrammar) => {
    const correctAnswer = item.structure;
    const distractors = shuffleArray(
      allGrammar.filter(g => g.id !== item.id && g.level === item.level)
    )
      .slice(0, 3)
      .map(g => g.structure);

    const options = shuffleArray([correctAnswer, ...distractors]);

    setCurrentQuestion({
      item,
      question: item.example?.replace(item.structure, '___') || '彼は学生___です。',
      correctAnswer,
      options,
      explanation: item.meaning
    });
  };

  const generateVocabularyQuestion = (item, allVocab) => {
    const correctAnswer = item.meaning;
    const distractors = shuffleArray(
      allVocab.filter(v => v.id !== item.id && v.level === item.level)
    )
      .slice(0, 3)
      .map(v => v.meaning);

    const options = shuffleArray([correctAnswer, ...distractors]);

    setCurrentQuestion({
      item,
      question: item.word,
      subtext: item.reading,
      correctAnswer,
      options,
      explanation: item.example || ''
    });
  };

  const generateKanjiQuestion = (item, allKanji) => {
    const correctAnswer = item.meaning;
    const distractors = shuffleArray(
      allKanji.filter(k => k.id !== item.id && k.level === item.level)
    )
      .slice(0, 3)
      .map(k => k.meaning);

    const options = shuffleArray([correctAnswer, ...distractors]);

    setCurrentQuestion({
      item,
      question: item.kanji,
      subtext: `${item.onyomi} / ${item.kunyomi}`,
      correctAnswer,
      options,
      explanation: item.example || ''
    });
  };

  const generateContrastQuestion = (item) => {
    const correctAnswer = Math.random() > 0.5 ? item.structureA : item.structureB;
    const wrongAnswer = correctAnswer === item.structureA ? item.structureB : item.structureA;
    const example = correctAnswer === item.structureA ? item.exampleA : item.exampleB;

    const options = shuffleArray([correctAnswer, wrongAnswer]);

    setCurrentQuestion({
      item,
      question: example.replace(correctAnswer, '___'),
      correctAnswer,
      options,
      explanation: item.comparison
    });
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }

    // Update SRS
    updateItemSRS(currentQuestion.item, correct);

    // Add to review history
    addReviewRecord({
      type: currentQuestion.item.type,
      itemId: currentQuestion.item.id,
      correct,
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer
    });

    // Add to error log if wrong
    if (!correct) {
      addErrorLog({
        type: currentQuestion.item.type,
        itemId: currentQuestion.item.id,
        question: currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation
      });
    }
  };

  const updateItemSRS = (item, correct) => {
    const updateFunction = getUpdateFunction(item.type);
    const currentItems = getAllItemsOfType(item.type);

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
  };

  const getUpdateFunction = (type) => {
    switch (type) {
      case 'grammar':
        return setGrammarItems;
      case 'vocabulary':
        return setVocabularyItems;
      case 'kanji':
        return setKanjiItems;
      case 'contrast':
        return setContrastCards;
      default:
        return () => {};
    }
  };

  const handleNext = () => {
    if (currentIndex < sessionItems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateQuestionForItem(sessionItems[nextIndex]);
    } else {
      // Session completed
      const accuracy = Math.round((correctCount / sessionItems.length) * 100);
      showNotification(
        `Hoàn thành! Điểm: ${correctCount}/${sessionItems.length} (${accuracy}%)`,
        accuracy >= 80 ? 'success' : 'info'
      );
      onHide();
    }
  };

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / sessionItems.length) * 100;
  const isLastItem = currentIndex === sessionItems.length - 1;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Ôn tập {sessionType}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Progress */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <Badge bg="success" className="me-2">
                <FaCheckCircle className="me-1" />
                Đúng: {correctCount}
              </Badge>
              <Badge bg="danger">
                <FaTimesCircle className="me-1" />
                Sai: {wrongCount}
              </Badge>
            </div>
            <small className="text-muted">
              {currentIndex + 1} / {sessionItems.length}
            </small>
          </div>
          <ProgressBar now={progress} />
        </div>

        {/* Question Type Badge */}
        <div className="mb-3">
          <Badge bg="primary">
            {currentQuestion.item.type === 'grammar' && '📖 Ngữ pháp'}
            {currentQuestion.item.type === 'vocabulary' && '📝 Từ vựng'}
            {currentQuestion.item.type === 'kanji' && '🈯 Kanji'}
            {currentQuestion.item.type === 'contrast' && '⚖️ So sánh'}
          </Badge>
        </div>

        {/* Question */}
        <div className="mb-4 text-center">
          <h4 className="p-3 bg-light rounded">{currentQuestion.question}</h4>
          {currentQuestion.subtext && (
            <p className="text-muted">{currentQuestion.subtext}</p>
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
          <Alert 
            variant={selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'danger'} 
            className="mt-4"
          >
            <h6>
              {selectedAnswer === currentQuestion.correctAnswer ? '✅ Chính xác!' : '❌ Chưa đúng'}
            </h6>
            {currentQuestion.explanation && (
              <p className="mb-0">
                <strong>Giải thích:</strong> {currentQuestion.explanation}
              </p>
            )}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button variant="outline-secondary" onClick={onHide}>
            Dừng lại
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
              {isLastItem ? 'Hoàn thành' : 'Câu tiếp theo'}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewSession;