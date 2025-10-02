import React from "react";
import { Card, ListGroup, Badge, Accordion, Alert } from "react-bootstrap";
import { FaCalendarAlt, FaExclamationTriangle, FaRobot } from "react-icons/fa";
import { formatDate, groupBy } from "../../utils/helpers";
import { useApp } from "../../contexts/AppContext";

const ErrorExplanations = ({ errorLog }) => {
  const { aiAnalyses } = useApp();

  // Group errors by date
  const errorsByDate = groupBy(
    errorLog.filter((e) => e.type === "grammar"),
    (error) => formatDate(error.date, "yyyy-MM-dd")
  );

  const dates = Object.keys(errorsByDate).sort().reverse();

  if (dates.length === 0 && aiAnalyses.length === 0) {
    return (
      <Card className="card-custom">
        <Card.Body className="text-center py-5">
          <p className="text-muted mb-0">
            Chưa có lỗi nào được ghi nhận. Hãy làm quiz để AI phân tích lỗi!
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {/* AI Analyses Section */}
      {aiAnalyses.length > 0 && (
        <Card className="card-custom mb-4">
          <Card.Header className="bg-info bg-opacity-10">
            <h5 className="mb-0">
              <FaRobot className="me-2" /> Phân tích AI tự động
            </h5>
          </Card.Header>
          <Card.Body>
            <Accordion>
              {aiAnalyses
                .slice()
                .reverse()
                .map((analysis, idx) => (
                  <Accordion.Item eventKey={idx.toString()} key={idx}>
                    <Accordion.Header>
                      <div className="d-flex justify-content-between w-100 pe-3">
                        <span>
                          <FaCalendarAlt className="me-2" />
                          {formatDate(analysis.date, "dd/MM/yyyy HH:mm")}
                        </span>
                        <Badge bg="info">
                          {analysis.analyses.length} phân tích
                        </Badge>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ListGroup variant="flush">
                        {analysis.analyses.map((item, i) => (
                          <ListGroup.Item key={i}>
                            <div className="mb-2">
                              <strong className="text-primary">
                                💡 Giải thích:
                              </strong>
                              <p className="mb-1">{item.explanation}</p>
                            </div>
                            {item.tip && (
                              <Alert variant="success" className="mb-0">
                                <strong>✨ Mẹo:</strong> {item.tip}
                              </Alert>
                            )}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </Card.Body>
        </Card>
      )}

      {/* Existing error log display */}
      {dates.length > 0 && (
        <Card className="card-custom">
          <Card.Header>
            <h5 className="mb-0">
              <FaExclamationTriangle className="me-2" />
              Lịch sử lỗi sai
            </h5>
          </Card.Header>
          <Card.Body>
            <Accordion defaultActiveKey="0">
              {dates.map((date, idx) => (
                <Accordion.Item eventKey={idx.toString()} key={date}>
                  <Accordion.Header>
                    <div className="d-flex justify-content-between w-100 pe-3">
                      <span>
                        <FaCalendarAlt className="me-2" />
                        {formatDate(date, "dd/MM/yyyy")}
                      </span>
                      <Badge bg="danger">{errorsByDate[date].length} lỗi</Badge>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush">
                      {errorsByDate[date].map((error) => (
                        <ListGroup.Item key={error.id}>
                          <p className="mb-1">
                            <strong>Câu hỏi:</strong> {error.question}
                          </p>
                          <p className="mb-1">
                            <strong>Bạn chọn:</strong>{" "}
                            <span className="text-danger">
                              {error.userAnswer}
                            </span>
                          </p>
                          <p className="mb-1">
                            <strong>Đáp án đúng:</strong>{" "}
                            <span className="text-success">
                              {error.correctAnswer}
                            </span>
                          </p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ErrorExplanations;
