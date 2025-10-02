import React, { useState } from 'react';
import { Card, Badge, Button, Collapse, Alert } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp, FaBook, FaCheckCircle } from 'react-icons/fa';
import { createMaziiUrl } from '../../utils/helpers';

const GrammarItem = ({ item, onStartQuiz }) => {
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

  return (
    <Card className="card-custom mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <Badge bg="primary" className="me-2">{item.level}</Badge>
              <h5 className="mb-0">{item.structure}</h5>
            </div>
            
            <p className="text-muted mb-2">{item.meaning}</p>
            
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
            
            {item.usage && (
              <Alert variant="info" className="mb-3">
                <strong>Cách dùng:</strong> {item.usage}
              </Alert>
            )}
            
            <div className="mb-3">
              <strong className="d-block mb-2">📝 Ví dụ:</strong>
              <div className="bg-light p-3 rounded">
                <p className="mb-2 fw-bold">{item.example}</p>
                <p className="mb-0 text-muted">{item.translation}</p>
              </div>
            </div>

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
                onClick={() => onStartQuiz(item)}
              >
                <FaBook className="me-2" />
                Luyện tập
              </Button>
              
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => window.open(createMaziiUrl(item.structure), '_blank')}
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

export default GrammarItem; 