import React from 'react';
import { Card, ListGroup, Badge, Accordion } from 'react-bootstrap';
import { FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { formatDate, groupBy } from '../../utils/helpers';

const ErrorExplanations = ({ errorLog }) => {
  // Group errors by date
  const errorsByDate = groupBy(
    errorLog.filter(e => e.type === 'grammar'),
    (error) => formatDate(error.date, 'yyyy-MM-dd')
  );

  const dates = Object.keys(errorsByDate).sort().reverse();

  if (dates.length === 0) {
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
    <Card className="card-custom">
      <Card.Header className="bg-danger bg-opacity-10">
        <h5 className="mb-0">
          <FaExclamationTriangle className="me-2 text-danger" />
          Lịch sử lỗi sai và giải thích
        </h5>
      </Card.Header>
      <Card.Body>
        <Accordion defaultActiveKey="0">
          {dates.map((date, index) => {
            const errors = errorsByDate[date];
            return (
              <Accordion.Item eventKey={index.toString()} key={date}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between w-100 pe-3">
                    <span>
                      <FaCalendarAlt className="me-2" />
                      {formatDate(date, 'dd/MM/yyyy')}
                    </span>
                    <Badge bg="danger">{errors.length} lỗi</Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {errors.map((error, idx) => (
                      <ListGroup.Item key={error.id || idx}>
                        <div className="mb-2">
                          <strong className="text-primary">Câu hỏi:</strong>
                          <p className="mb-1">{error.question}</p>
                        </div>
                        
                        <div className="mb-2">
                          <Badge bg="danger" className="me-2">
                            Bạn đã chọn: {error.userAnswer}
                          </Badge>
                          <Badge bg="success">
                            Đáp án đúng: {error.correctAnswer}
                          </Badge>
                        </div>

                        <div className="alert alert-info mb-0">
                          <strong>💡 Giải thích:</strong>
                          <p className="mb-0 mt-1">{error.explanation}</p>
                        </div>

                        <small className="text-muted">
                          {error.date && !isNaN(new Date(error.date)) ? formatDate(error.date) : "N/A"}
                        </small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default ErrorExplanations;