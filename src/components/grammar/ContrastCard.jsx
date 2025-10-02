import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Table } from 'react-bootstrap';
import { FaArrowsAltH, FaQuestionCircle } from 'react-icons/fa';

const ContrastCard = ({ contrastCard, onStartQuiz }) => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <Card className="card-custom mb-4">
      <Card.Header className="bg-warning bg-opacity-10">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaArrowsAltH className="me-2 text-warning" />
            So sánh: {contrastCard.structureA} vs {contrastCard.structureB}
          </h5>
          <Badge bg="warning">Pair #{contrastCard.pairId}</Badge>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Comparison */}
        <div className="mb-4">
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="mb-3"
          >
            <FaQuestionCircle className="me-2" />
            {showComparison ? 'Ẩn' : 'Xem'} so sánh
          </Button>

          {showComparison && (
            <div className="alert alert-info">
              <strong>📌 Khi nào dùng:</strong>
              <p className="mb-0 mt-2">{contrastCard.comparison}</p>
            </div>
          )}
        </div>

        {/* Examples */}
        <Row>
          <Col md={6}>
            <Card className="mb-3 border-primary">
              <Card.Header className="bg-primary bg-opacity-10">
                <strong className="text-primary">{contrastCard.structureA}</strong>
              </Card.Header>
              <Card.Body>
                <p className="fw-bold mb-2">{contrastCard.exampleA}</p>
                <p className="text-muted mb-0">{contrastCard.translationA}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-3 border-danger">
              <Card.Header className="bg-danger bg-opacity-10">
                <strong className="text-danger">{contrastCard.structureB}</strong>
              </Card.Header>
              <Card.Body>
                <p className="fw-bold mb-2">{contrastCard.exampleB}</p>
                <p className="text-muted mb-0">{contrastCard.translationB}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mini Exercise */}
        {contrastCard.miniExercise && (
          <div className="mt-3">
            <div className="alert alert-light">
              <strong>✏️ Bài tập:</strong>
              <p className="mb-0 mt-2">{contrastCard.miniExercise}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="text-center mt-3">
          <Button
            variant="warning"
            onClick={() => onStartQuiz(contrastCard)}
          >
            <FaQuestionCircle className="me-2" />
            Làm bài quiz so sánh
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ContrastCard;