import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Badge, Alert, Button } from 'react-bootstrap';
import { FaCheckCircle, FaChartBar, FaExclamationTriangle, FaPlay } from 'react-icons/fa';
import Card from '../components/ui/Card';
import ReviewCard from '../components/practice/ReviewCard';
import ErrorAnalysis from '../components/practice/ErrorAnalysis';
import ReviewSession from '../components/practice/ReviewSession';
import { useSRS } from '../hooks/useSRS';

console.log({ Card, ReviewCard, ErrorAnalysis, ReviewSession });

const Practice = () => {
  const { dueItems, errorItems, stats } = useSRS();
  const [activeTab, setActiveTab] = useState('review');
  const [sessionModalShow, setSessionModalShow] = useState(false);
  const [sessionItems, setSessionItems] = useState([]);
  const [sessionType, setSessionType] = useState('');

  const startReviewSession = (items, type) => {
    if (items.length === 0) return;
    setSessionItems(items);
    setSessionType(type);
    setSessionModalShow(true);
  };

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">✅ Ôn tập & Phân tích</h2>
        <p className="text-muted">Ôn tập thông minh với SRS và phân tích lỗi sai</p>
      </div>

      {/* Summary Alert */}
      <Alert variant="info" className="mb-4">
        <Row>
          <Col md={6}>
            <strong>📚 Tổng số mục cần ôn hôm nay:</strong>{' '}
            <Badge bg="primary" className="ms-2">{stats.dueToday}</Badge>
          </Col>
          <Col md={6}>
            <strong>⚠️ Tổng số lỗi đã ghi nhận:</strong>{' '}
            <Badge bg="danger" className="ms-2">{stats.errorCount}</Badge>
          </Col>
        </Row>
      </Alert>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Review Tab */}
        <Tab eventKey="review" title={
          <>
            <FaCheckCircle className="me-2" />
            Ôn tập SRS
            <Badge bg="primary" className="ms-2">{stats.dueToday}</Badge>
          </>
        }>
          <Row className="mb-4">
            {/* All Review */}
            <Col md={12} className="mb-3">
              <Card className="bg-primary bg-opacity-10 border-primary">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h4 className="mb-2">
                      <FaPlay className="me-2 text-primary" />
                      Ôn tập tất cả
                    </h4>
                    <p className="text-muted mb-0">
                      Ôn tập tất cả các mục cần ôn hôm nay (Ngữ pháp, Từ vựng, Kanji, So sánh)
                    </p>
                  </Col>
                  <Col md={4} className="text-end">
                    <h2 className="text-primary mb-2">{stats.dueToday}</h2>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => startReviewSession(dueItems.all, 'Tất cả')}
                      disabled={stats.dueToday === 0}
                    >
                      <FaPlay className="me-2" />
                      Bắt đầu
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Individual Review Cards */}
            <Col md={6} lg={3}>
              <ReviewCard
                title="Ngữ pháp"
                description="Ôn tập ngữ pháp đã học"
                count={stats.dueGrammar}
                color="danger"
                icon="grammar"
                onStart={() => startReviewSession(dueItems.grammar, 'Ngữ pháp')}
              />
            </Col>

            <Col md={6} lg={3}>
              <ReviewCard
                title="Từ vựng"
                description="Ôn tập từ vựng đã học"
                count={stats.dueVocabulary}
                color="info"
                icon="vocabulary"
                onStart={() => startReviewSession(dueItems.vocabulary, 'Từ vựng')}
              />
            </Col>

            <Col md={6} lg={3}>
              <ReviewCard
                title="Kanji"
                description="Ôn tập Kanji đã học"
                count={stats.dueKanji}
                color="secondary"
                icon="kanji"
                onStart={() => startReviewSession(dueItems.kanji, 'Kanji')}
              />
            </Col>

            <Col md={6} lg={3}>
              <ReviewCard
                title="So sánh"
                description="Ôn tập ngữ pháp so sánh"
                count={stats.dueContrast}
                color="warning"
                icon="contrast"
                onStart={() => startReviewSession(dueItems.contrast, 'So sánh')}
              />
            </Col>
          </Row>

          {/* Error-based Review */}
          {stats.errorCount > 0 && (
            <div className="mt-4">
              <h5 className="mb-3">
                <FaExclamationTriangle className="me-2 text-warning" />
                Ôn tập từ lỗi sai
              </h5>
              <Row>
                <Col md={6} lg={3}>
                  <Card className="card-custom border-danger">
                    <Card.Body className="text-center">
                      <h6 className="mb-2">Ngữ pháp hay sai</h6>
                      <h3 className="text-danger mb-3">{stats.errorGrammar}</h3>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="w-100"
                        onClick={() => startReviewSession(errorItems.grammar, 'Ngữ pháp hay sai')}
                        disabled={stats.errorGrammar === 0}
                      >
                        Ôn lại
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} lg={3}>
                  <Card className="card-custom border-info">
                    <Card.Body className="text-center">
                      <h6 className="mb-2">Từ vựng hay sai</h6>
                      <h3 className="text-info mb-3">{stats.errorVocabulary}</h3>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="w-100"
                        onClick={() => startReviewSession(errorItems.vocabulary, 'Từ vựng hay sai')}
                        disabled={stats.errorVocabulary === 0}
                      >
                        Ôn lại
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} lg={3}>
                  <Card className="card-custom border-secondary">
                    <Card.Body className="text-center">
                      <h6 className="mb-2">Kanji hay sai</h6>
                      <h3 className="text-secondary mb-3">{stats.errorKanji}</h3>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="w-100"
                        onClick={() => startReviewSession(errorItems.kanji, 'Kanji hay sai')}
                        disabled={stats.errorKanji === 0}
                      >
                        Ôn lại
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} lg={3}>
                  <Card className="card-custom border-warning">
                    <Card.Body className="text-center">
                      <h6 className="mb-2">Tất cả lỗi sai</h6>
                      <h3 className="text-warning mb-3">{stats.errorCount}</h3>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="w-100"
                        onClick={() => startReviewSession(errorItems.all, 'Tất cả lỗi sai')}
                        disabled={stats.errorCount === 0}
                      >
                        Ôn lại
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* No items to review */}
          {stats.dueToday === 0 && (
            <Alert variant="success" className="text-center mt-4">
              <h5>🎉 Tuyệt vời!</h5>
              <p className="mb-0">
                Bạn đã hoàn thành tất cả mục ôn tập hôm nay. Hãy quay lại vào ngày mai!
              </p>
            </Alert>
          )}
        </Tab>

        {/* Error Analysis Tab */}
        <Tab eventKey="analysis" title={
          <>
            <FaChartBar className="me-2" />
            Phân tích lỗi
            <Badge bg="warning" className="ms-2">{stats.errorCount}</Badge>
          </>
        }>
          <ErrorAnalysis />
        </Tab>
      </Tabs>

      {/* Review Session Modal */}
      <ReviewSession
        show={sessionModalShow}
        onHide={() => setSessionModalShow(false)}
        items={sessionItems}
        sessionType={sessionType}
      />
    </Container>
  );
};

export default Practice;