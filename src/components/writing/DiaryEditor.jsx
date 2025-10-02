import React, { useState } from 'react';
import { Card, Form, Button, Alert, Badge, ListGroup, Modal } from 'react-bootstrap';
import { FaCheckCircle, FaLightbulb, FaSave, FaBook } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import { useAI } from '../../hooks/useAI';

const DiaryEditor = () => {
const { showNotification, savedDiaries, setSavedDiaries } = useApp();
  const { loading, checkDiary, suggestTopic } = useAI();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  const handleGetSuggestions = async () => {
    try {
      const result = await suggestTopic();
      setSuggestions(result);
      setShowSuggestionModal(true);
    } catch (error) {
      showNotification('Lỗi khi lấy gợi ý', 'error');
    }
  };

  const handleCheck = async () => {
    if (!content.trim()) {
      showNotification('Vui lòng viết nội dung', 'error');
      return;
    }

    try {
      const result = await checkDiary(content);
      setCheckResult(result);
      showNotification('Đã kiểm tra nhật ký!', 'success');
    } catch (error) {
      showNotification('Lỗi khi kiểm tra', 'error');
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      showNotification('Vui lòng viết nội dung', 'error');
      return;
    }

    const newDiary = {
      id: Date.now(),
      title: title || 'Nhật ký không tiêu đề',
      content,
      checkResult,
      timestamp: new Date().toISOString()
    };

    setSavedDiaries([newDiary, ...savedDiaries]);
    showNotification('Đã lưu nhật ký!', 'success');
    
    // Reset
    setTitle('');
    setContent('');
    setCheckResult(null);
  };

  const applySuggestion = (suggestion) => {
    setContent(content + '\n' + suggestion);
    setShowSuggestionModal(false);
  };

  return (
    <div>
      {/* Title Input */}
      <Card className="card-custom mb-3">
        <Card.Body>
          <Form.Group>
            <Form.Label>📌 Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề nhật ký..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Content Editor */}
      <Card className="card-custom mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">📝 Nội dung nhật ký</h6>
          <Button
            variant="outline-info"
            size="sm"
            onClick={handleGetSuggestions}
            disabled={loading}
          >
            <FaLightbulb className="me-2" />
            Gợi ý viết
          </Button>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={10}
              placeholder="Viết nhật ký của bạn bằng tiếng Nhật..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
            />
            <Form.Text className="text-muted">
              {content.length} ký tự
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="success"
              onClick={handleCheck}
              disabled={loading || !content.trim()}
            >
              <FaCheckCircle className="me-2" />
              {loading ? 'Đang kiểm tra...' : 'Kiểm tra lỗi'}
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!content.trim()}
            >
              <FaSave className="me-2" />
              Lưu nhật ký
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Check Result */}
      {checkResult && (
        <Card className="card-custom mb-3">
          <Card.Header className="bg-info bg-opacity-10">
            <h6 className="mb-0">📊 Kết quả kiểm tra</h6>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <h5>
                Điểm số: <Badge bg="primary" style={{ fontSize: '1.2rem' }}>
                  {checkResult.overallScore}/100
                </Badge>
              </h5>
            </div>

            {checkResult.errorCount > 0 ? (
              <Alert variant="warning">
                <strong>⚠️ Phát hiện {checkResult.errorCount} lỗi:</strong>
                <ul className="mb-0 mt-2">
                  {checkResult.errors.map((error, idx) => (
                    <li key={idx}>
                      <strong>Dòng {error.line}:</strong> {error.message}
                    </li>
                  ))}
                </ul>
              </Alert>
            ) : (
              <Alert variant="success">
                ✅ Không phát hiện lỗi! Tuyệt vời!
              </Alert>
            )}

            <div className="mt-3">
              <strong>💡 Gợi ý cải thiện:</strong>
              <ul className="mt-2">
                {checkResult.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Saved Diaries */}
      {savedDiaries.length > 0 && (
        <Card className="card-custom">
          <Card.Header>
            <h6 className="mb-0">
              <FaBook className="me-2" />
              Nhật ký đã lưu ({savedDiaries.length})
            </h6>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {savedDiaries.slice(0, 5).map((diary) => (
                <ListGroup.Item key={diary.id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6>{diary.title}</h6>
                      <p className="mb-1 text-muted" style={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {diary.content}
                      </p>
                      <small className="text-muted">
                        {new Date(diary.timestamp).toLocaleString('vi-VN')}
                      </small>
                    </div>
                    {diary.checkResult && (
                      <Badge bg="info" className="ms-2">
                        {diary.checkResult.overallScore}/100
                      </Badge>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* Suggestion Modal */}
      <Modal 
        show={showSuggestionModal} 
        onHide={() => setShowSuggestionModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>💡 Gợi ý viết nhật ký</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {suggestions && (
            <>
              <h6 className="mb-3">📝 Chủ đề: {suggestions.topic}</h6>
              
              <Alert variant="light">
                <strong>Câu hỏi gợi ý:</strong>
                <ListGroup variant="flush" className="mt-2">
                  {suggestions.suggestions.map((suggestion, idx) => (
                    <ListGroup.Item 
                      key={idx}
                      action
                      onClick={() => applySuggestion(suggestion)}
                      style={{ cursor: 'pointer' }}
                    >
                      {suggestion}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Alert>

              <Alert variant="info" className="mb-0">
                <strong>📋 Mẫu câu gợi ý:</strong>
                <p className="mb-0 mt-2 font-monospace">
                  {suggestions.template}
                </p>
                <small className="text-muted d-block mt-2">
                  Click vào câu hỏi để thêm vào nhật ký
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuggestionModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DiaryEditor;