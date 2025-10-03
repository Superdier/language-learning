import React from "react";
import { Modal, Badge, Alert, ListGroup, Button } from "react-bootstrap";
import { FaExternalLinkAlt, FaCalendarAlt, FaBookmark } from "react-icons/fa";
import { formatDate, createMaziiUrl } from "../../utils/helpers";

const ErrorLogDetail = ({ show, onHide, errorLog }) => {
  if (!errorLog) return null;

  const getPartBadgeColor = (part) => {
    const colors = {
      Grammar: "danger",
      Vocabulary: "info",
      Kanji: "secondary",
      Reading: "success",
      Listening: "primary",
    };
    return colors[part] || "secondary";
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      New: "warning",
      "In Progress": "info",
      Reviewing: "primary",
      Done: "success",
      Archived: "secondary",
    };
    return colors[status] || "secondary";
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>📋 Chi tiết Error Log #{errorLog.no}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Header Info */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Badge bg={getPartBadgeColor(errorLog.part)} className="me-2">
                {errorLog.part}
              </Badge>
              <Badge bg={getStatusBadgeColor(errorLog.status)}>
                {errorLog.status}
              </Badge>
            </div>
            <div>
              {errorLog.needsSRS && (
                <Badge bg="primary" className="me-2">
                  <FaBookmark className="me-1" />
                  SRS Enabled
                </Badge>
              )}
            </div>
          </div>

          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>📅 Ngày:</strong>{" "}
              {formatDate(errorLog.date, "dd/MM/yyyy")}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>📚 Nguồn:</strong> {errorLog.source}
              {errorLog.type && <> • {errorLog.type}</>}
            </ListGroup.Item>
          </ListGroup>
        </div>

        {/* Question */}
        <Alert variant="light" className="mb-3">
          <h6 className="mb-2">❓ Câu hỏi / Đoạn văn:</h6>
          <p
            className="mb-0"
            style={{ fontSize: "1.05rem", lineHeight: "1.8" }}
          >
            {errorLog.question}
          </p>
        </Alert>

        {/* Answers */}
        <div className="mb-3">
          <div className="row">
            <div className="col-md-6">
              <Alert variant="danger" className="mb-2">
                <strong>❌ Câu trả lời của bạn:</strong>
                <p className="mb-0 mt-2">{errorLog.userAnswer || "Không có"}</p>
              </Alert>
            </div>
            <div className="col-md-6">
              <Alert variant="success" className="mb-2">
                <strong>✅ Đáp án đúng:</strong>
                <p className="mb-0 mt-2">{errorLog.correctAnswer}</p>
              </Alert>
            </div>
          </div>
        </div>

        {/* Explanation */}
        {errorLog.explanation && (
          <Alert variant="info" className="mb-3">
            <h6 className="mb-2">💡 Giải thích:</h6>
            <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {errorLog.explanation}
            </p>
          </Alert>
        )}

        {/* Action */}
        {errorLog.action && (
          <Alert variant="warning" className="mb-3">
            <h6 className="mb-2">🎯 Hành động:</h6>
            <p className="mb-0">{errorLog.action}</p>
          </Alert>
        )}

        {/* Review Date */}
        {errorLog.plannedReviewDate && (
          <Alert variant="primary" className="mb-3">
            <FaCalendarAlt className="me-2" />
            <strong>Ngày ôn tập:</strong>{" "}
            {formatDate(errorLog.plannedReviewDate, "dd/MM/yyyy")}
          </Alert>
        )}

        {/* Notes */}
        {errorLog.notes && (
          <Alert variant="light" className="mb-0">
            <h6 className="mb-2">📝 Ghi chú:</h6>
            <p className="mb-0">{errorLog.notes}</p>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="mt-4 d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              const searchText = errorLog.correctAnswer || errorLog.question;
              window.open(createMaziiUrl(searchText), "_blank");
            }}
          >
            <FaExternalLinkAlt className="me-2" />
            Tra từ điển
          </Button>

          {errorLog.source.includes("http") && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => window.open(errorLog.source, "_blank")}
            >
              <FaExternalLinkAlt className="me-2" />
              Xem nguồn
            </Button>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorLogDetail;
