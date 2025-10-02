import React, { useMemo } from 'react';
import { Card, Row, Col, ListGroup, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { FaExclamationTriangle, FaChartPie, FaTrophy } from 'react-icons/fa';
import { groupBy } from '../../utils/helpers';
import { useApp } from '../../contexts/AppContext';

const ErrorAnalysis = () => {
  const { errorLog, grammarItems, vocabularyItems, kanjiItems } = useApp();

  // Analyze errors by type
  const errorsByType = useMemo(() => {
    const grouped = groupBy(errorLog, 'type');
    return {
      grammar: grouped.grammar?.length || 0,
      vocabulary: grouped.vocabulary?.length || 0,
      kanji: grouped.kanji?.length || 0
    };
  }, [errorLog]);

  // Get most common errors
  const commonErrors = useMemo(() => {
    const errorCount = {};
    
    errorLog.forEach(error => {
      const key = error.itemId;
      if (!errorCount[key]) {
        errorCount[key] = {
          itemId: error.itemId,
          type: error.type,
          count: 0,
          lastError: error.date
        };
      }
      errorCount[key].count++;
      if (new Date(error.date) > new Date(errorCount[key].lastError)) {
        errorCount[key].lastError = error.date;
      }
    });

    return Object.values(errorCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [errorLog]);

  // Get item details
  const getItemDetails = (itemId, type) => {
    let item;
    if (type === 'grammar') {
      item = grammarItems.find(i => i.id === itemId);
      return item ? item.structure : 'Unknown';
    } else if (type === 'vocabulary') {
      item = vocabularyItems.find(i => i.id === itemId);
      return item ? item.word : 'Unknown';
    } else if (type === 'kanji') {
      item = kanjiItems.find(i => i.id === itemId);
      return item ? item.kanji : 'Unknown';
    }
    return 'Unknown';
  };

  const totalErrors = errorLog.length;
  const maxError = errorsByType.grammar + errorsByType.vocabulary + errorsByType.kanji || 1;

  return (
    <div>
      <Row className="mb-4">
        {/* Error Distribution */}
        <Col md={12}>
          <Card className="card-custom mb-4">
            <Card.Header className="bg-warning bg-opacity-10">
              <h5 className="mb-0">
                <FaChartPie className="me-2 text-warning" />
                Phân bố lỗi theo loại
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Ngữ pháp</span>
                      <Badge bg="danger">{errorsByType.grammar}</Badge>
                    </div>
                    <ProgressBar 
                      now={(errorsByType.grammar / maxError) * 100} 
                      variant="danger"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Từ vựng</span>
                      <Badge bg="info">{errorsByType.vocabulary}</Badge>
                    </div>
                    <ProgressBar 
                      now={(errorsByType.vocabulary / maxError) * 100} 
                      variant="info"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Kanji</span>
                      <Badge bg="secondary">{errorsByType.kanji}</Badge>
                    </div>
                    <ProgressBar 
                      now={(errorsByType.kanji / maxError) * 100} 
                      variant="secondary"
                    />
                  </div>
                </Col>
              </Row>

              <Alert variant="info" className="mb-0 mt-3">
                <strong>📊 Tổng số lỗi:</strong> {totalErrors} lỗi
              </Alert>
            </Card.Body>
          </Card>
        </Col>

        {/* Common Errors */}
        <Col md={12}>
          <Card className="card-custom">
            <Card.Header className="bg-danger bg-opacity-10">
              <h5 className="mb-0">
                <FaExclamationTriangle className="me-2 text-danger" />
                Top 10 lỗi thường gặp
              </h5>
            </Card.Header>
            <Card.Body>
              {commonErrors.length === 0 ? (
                <div className="text-center py-4">
                  <FaTrophy size={48} className="text-success mb-3" />
                  <p className="text-muted mb-0">
                    Tuyệt vời! Bạn chưa có lỗi nào
                  </p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {commonErrors.map((error, index) => (
                    <ListGroup.Item 
                      key={error.itemId}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <Badge 
                          bg={index < 3 ? 'danger' : 'warning'} 
                          className="me-3"
                        >
                          #{index + 1}
                        </Badge>
                        <div>
                          <strong>{getItemDetails(error.itemId, error.type)}</strong>
                          <br />
                          <small className="text-muted">
                            {error.type === 'grammar' && '📖 Ngữ pháp'}
                            {error.type === 'vocabulary' && '📝 Từ vựng'}
                            {error.type === 'kanji' && '🈯 Kanji'}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <Badge bg="danger" pill className="mb-1">
                          {error.count} lần
                        </Badge>
                        <br />
                        <small className="text-muted">
                          {new Date(error.lastError).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ErrorAnalysis;