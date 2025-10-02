import React, { useState } from 'react';
import { Card, Badge, Button, Collapse, Row, Col } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp, FaLanguage, FaVolumeUp } from 'react-icons/fa';
import { createMaziiUrl } from '../../utils/helpers';

const VocabularyItem = ({ item, onStartQuiz, type = 'vocabulary' }) => {
  const [expanded, setExpanded] = useState(false);

  const getSRSLevelColor = (level) => {
    if (level === 0) return 'secondary';
    if (level <= 2) return 'danger';
    if (level <= 4) return 'warning';
    return 'success';
  };

  const getSRSLevelText = (level) => {
    if (level === 0) return 'Mới';
    if (level <= 2) return 'Đang học';
    if (level <= 4) return 'Đang ôn';
    return 'Thành thạo';
  };

  // Speak Japanese text (Web Speech API)
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="card-custom mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <Badge bg="info" className="me-2">{item.level || 'N5'}</Badge>
              <h4 className="mb-0 me-2">
                {type === 'kanji' ? item.kanji : item.word}
              </h4>
              <Button
                variant="link"
                size="sm"
                className="p-0"
                onClick={() => speakWord(type === 'kanji' ? item.kanji : item.word)}
              >
                <FaVolumeUp className="text-primary" />
              </Button>
            </div>

            {type === 'vocabulary' && (
              <p className="text-muted mb-2">
                <strong>Đọc:</strong> {item.reading}
              </p>
            )}

            {type === 'kanji' && (
              <div className="mb-2">
                <Badge bg="secondary" className="me-2">音: {item.onyomi}</Badge>
                <Badge bg="secondary">訓: {item.kunyomi}</Badge>
              </div>
            )}

            <p className="mb-2">
              <strong>Nghĩa:</strong> {item.meaning}
            </p>

            {item.partOfSpeech && (
              <Badge bg="light" text="dark" className="me-2">
                {item.partOfSpeech}
              </Badge>
            )}

            {item.errorCount > 0 && (
              <Badge bg="danger" className="me-2">
                Sai {item.errorCount} lần
              </Badge>
            )}

            <Badge bg={getSRSLevelColor(item.srsLevel)}>
              {getSRSLevelText(item.srsLevel)} (Level {item.srsLevel})
            </Badge>
          </div>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </Button>
        </div>

        <Collapse in={expanded}>
          <div className="mt-3">
            <hr />

            {item.example && (
              <div className="mb-3">
                <strong className="d-block mb-2">📝 Ví dụ:</strong>
                <div className="bg-light p-3 rounded">
                  <p className="mb-2 fw-bold">{item.example}</p>
                  <p className="mb-0 text-muted">{item.translation}</p>
                </div>
              </div>
            )}

            {item.errorReasons && item.errorReasons.length > 0 && (
              <div className="mb-3">
                <strong className="d-block mb-2 text-danger">⚠️ Lỗi thường gặp:</strong>
                <ul className="mb-0">
                  {item.errorReasons.slice(-3).map((reason, idx) => (
                    <li key={idx} className="text-muted">{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStartQuiz(item, 'meaning')}
              >
                Quiz nghĩa
              </Button>

              <Button
                variant="info"
                size="sm"
                onClick={() => onStartQuiz(item, 'usage')}
              >
                Quiz cách dùng
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => window.open(createMaziiUrl(type === 'kanji' ? item.kanji : item.word), '_blank')}
              >
                Tra từ điển
              </Button>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default VocabularyItem;