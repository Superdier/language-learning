import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaRedo, FaVolumeUp, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { shuffleArray, calculateNextReviewDate } from '../../utils/helpers';
import { useApp } from '../../contexts/AppContext';

const Flashcard = ({ items, type = 'vocabulary', onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flashcardItems, setFlashcardItems] = useState([]);
  const [remembered, setRemembered] = useState([]);
  const [forgotten, setForgotten] = useState([]);

  const {
    addReviewRecord,
    vocabularyItems,
    setVocabularyItems,
    kanjiItems,
    setKanjiItems,
  } = useApp();

  useEffect(() => {
    if (items && items.length > 0) {
      setFlashcardItems(shuffleArray(items));
      setRemembered([]);
      setForgotten([]);
    }
  }, [items]);

  const currentItem = flashcardItems[currentIndex];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleRemember = (remember) => {
    if (!currentItem) return;

    const correct = remember;

    // Update SRS
    const updateFunction = type === 'kanji' ? setKanjiItems : setVocabularyItems;
    const currentItems = type === 'kanji' ? kanjiItems : vocabularyItems;

    const updatedItems = currentItems.map(item => {
      if (item.id === currentItem.id) {
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
              `Không nhớ nghĩa của từ: ${type === 'kanji' ? item.kanji : item.word}`
            ]
          };
        }
      }
      return item;
    });

    updateFunction(updatedItems);

    // Add to review history
    addReviewRecord({
      type: type === 'kanji' ? 'kanji' : 'vocabulary',
      itemId: currentItem.id,
      correct,
      question: type === 'kanji' ? currentItem.kanji : currentItem.word,
      userAnswer: correct ? 'remembered' : 'forgotten',
      correctAnswer: currentItem.meaning
    });

    // Track results
    if (correct) {
      setRemembered([...remembered, currentItem]);
    } else {
      setForgotten([...forgotten, currentItem]);
    }

    // Move to next card
    if (currentIndex < flashcardItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      // Completed all cards
      onComplete?.({ remembered, forgotten });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcardItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setFlashcardItems(shuffleArray(items));
    setRemembered([]);
    setForgotten([]);
  };

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!currentItem) {
    return (
      <Card className="card-custom text-center py-5">
        <Card.Body>
          <h5>Không có flashcard nào</h5>
          <p className="text-muted">Vui lòng chọn từ vựng để học</p>
        </Card.Body>
      </Card>
    );
  }

  const progress = ((currentIndex + 1) / flashcardItems.length) * 100;
  const isLastCard = currentIndex === flashcardItems.length - 1;

  return (
    <div>
      {/* Progress */}
      <div className="mb-4">
        <div className="d-flex justify-content-between mb-2">
          <div>
            <Badge bg="success" className="me-2">
              <FaCheckCircle className="me-1" />
              Nhớ: {remembered.length}
            </Badge>
            <Badge bg="danger">
              <FaTimesCircle className="me-1" />
              Quên: {forgotten.length}
            </Badge>
          </div>
          <small className="text-muted">
            {currentIndex + 1} / {flashcardItems.length}
          </small>
        </div>
        <ProgressBar now={progress} />
      </div>

      {/* Flashcard */}
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          {/* Front Side */}
          <div className="flashcard-front">
            <Card className="h-100 border-0">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Badge bg="info" className="mb-3">{currentItem.level || 'N5'}</Badge>
                <h1 className="display-3 mb-3">
                  {type === 'kanji' ? currentItem.kanji : currentItem.word}
                </h1>
                {type === 'vocabulary' && (
                  <h4 className="text-muted mb-3">{currentItem.reading}</h4>
                )}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(type === 'kanji' ? currentItem.kanji : currentItem.word);
                  }}
                >
                  <FaVolumeUp className="me-2" />
                  Phát âm
                </Button>
                <p className="text-muted mt-4 mb-0">
                  <small>Click để lật thẻ</small>
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* Back Side */}
          <div className="flashcard-back">
            <Card className="h-100 border-0">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                {type === 'kanji' && (
                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">音: {currentItem.onyomi}</Badge>
                    <Badge bg="secondary">訓: {currentItem.kunyomi}</Badge>
                  </div>
                )}
                <h3 className="mb-4">{currentItem.meaning}</h3>
                {currentItem.example && (
                  <div className="text-center">
                    <p className="fw-bold mb-2">{currentItem.example}</p>
                    <p className="text-muted mb-0">
                      <small>{currentItem.translation}</small>
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Actions */}
      {flipped && (
        <div className="d-flex gap-2 justify-content-center mt-4">
          <Button
            variant="danger"
            size="lg"
            onClick={() => handleRemember(false)}
          >
            <FaTimesCircle className="me-2" />
            Chưa nhớ
          </Button>
          <Button
            variant="success"
            size="lg"
            onClick={() => handleRemember(true)}
          >
            <FaCheckCircle className="me-2" />
            Đã nhớ
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="outline-secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft className="me-2" />
          Trước
        </Button>

        <Button variant="outline-primary" onClick={handleReset}>
          <FaRedo className="me-2" />
          Làm lại
        </Button>

        <Button
          variant="outline-secondary"
          onClick={handleNext}
          disabled={isLastCard}
        >
          Sau
          <FaArrowRight className="ms-2" />
        </Button>
      </div>

      {/* Completion */}
      {isLastCard && flipped && (
        <div className="text-center mt-4">
          <Card className="card-custom">
            <Card.Body>
              <h5 className="mb-3">🎉 Hoàn thành!</h5>
              <p className="mb-0">
                Bạn đã hoàn thành {flashcardItems.length} thẻ. 
                Nhớ: {remembered.length}, Quên: {forgotten.length}
              </p>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Flashcard;