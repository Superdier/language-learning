import React, { useState } from 'react';
import { Card, Form, Button, Alert, Badge, ListGroup, ButtonGroup } from 'react-bootstrap';
import { FaRandom, FaCheckCircle, FaLightbulb, FaSave } from 'react-icons/fa';
import { getRandomItems } from '../../utils/helpers';
import { useApp } from '../../contexts/AppContext';
import { useAI } from '../../hooks/useAI';

const SentenceBuilder = () => {
const { grammarItems, vocabularyItems, kanjiItems, showNotification, savedSentences, setSavedSentences } = useApp();
  const { loading, checkSentence, generateExamples } = useAI();

  const [mode, setMode] = useState('grammar'); // 'grammar', 'vocabulary', 'both'
  const [selectedItems, setSelectedItems] = useState([]);
  const [sentence, setSentence] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [exampleSentences, setExampleSentences] = useState([]);

  const handleRandomize = () => {
    let items = [];

    if (mode === 'grammar') {
      items = getRandomItems(grammarItems, 1);
    } else if (mode === 'vocabulary') {
      items = getRandomItems([...vocabularyItems, ...kanjiItems], 3);
    } else {
      const grammar = getRandomItems(grammarItems, 1);
      const vocab = getRandomItems([...vocabularyItems, ...kanjiItems], 2);
      items = [...grammar, ...vocab];
    }

    setSelectedItems(items);
    setSentence('');
    setCheckResult(null);
    setExampleSentences([]);
  };

  const handleCheck = async () => {
    if (!sentence.trim()) {
      showNotification('Vui lòng nhập câu', 'error');
      return;
    }

    try {
      const grammarPoints = selectedItems.filter(i => i.structure).map(i => i.structure);
      const vocabulary = selectedItems.filter(i => i.word || i.kanji).map(i => i.word || i.kanji);
      
      const result = await checkSentence(sentence, grammarPoints, vocabulary);
      setCheckResult(result);
      
      showNotification(
        result.isCorrect ? 'Câu đúng!' : 'Có lỗi cần sửa',
        result.isCorrect ? 'success' : 'error'
      );
    } catch (error) {
      showNotification('Lỗi khi kiểm tra câu', 'error');
    }
  };

  const handleGenerateExamples = async () => {
    if (selectedItems.length === 0) {
      showNotification('Vui lòng chọn ngữ pháp/từ vựng trước', 'error');
      return;
    }

    try {
      const grammar = selectedItems.find(i => i.structure)?.structure || '';
      const vocab = selectedItems.filter(i => i.word || i.kanji).map(i => i.word || i.kanji);
      
      const result = await generateExamples(grammar, vocab, 'normal');
      setExampleSentences(result.examples);
      showNotification('Đã tạo câu mẫu!', 'success');
    } catch (error) {
      showNotification('Lỗi khi tạo câu mẫu', 'error');
    }
  };

  const handleSave = () => {
    if (!sentence.trim()) {
      showNotification('Vui lòng nhập câu', 'error');
      return;
    }

    const newSentence = {
      id: Date.now(),
      sentence,
      items: selectedItems,
      isCorrect: checkResult?.isCorrect || false,
      timestamp: new Date().toISOString()
    };

    setSavedSentences([newSentence, ...savedSentences]);
    showNotification('Đã lưu câu!', 'success');
  };

  return (
    <div>
      {/* Mode Selection */}
      <Card className="card-custom mb-3">
        <Card.Body>
          <h6 className="mb-3">Chọn chế độ luyện tập:</h6>
          <ButtonGroup className="w-100">
            <Button
              variant={mode === 'grammar' ? 'danger' : 'outline-danger'}
              onClick={() => setMode('grammar')}
            >
              📖 Ngữ pháp
            </Button>
            <Button
              variant={mode === 'vocabulary' ? 'info' : 'outline-info'}
              onClick={() => setMode('vocabulary')}
            >
              📝 Từ vựng
            </Button>
            <Button
              variant={mode === 'both' ? 'primary' : 'outline-primary'}
              onClick={() => setMode('both')}
            >
              🎯 Cả hai
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card>

      {/* Selected Items */}
      <Card className="card-custom mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            {mode === 'grammar' && '📖 Ngữ pháp được chọn'}
            {mode === 'vocabulary' && '📝 Từ vựng được chọn'}
            {mode === 'both' && '🎯 Ngữ pháp & Từ vựng được chọn'}
          </h6>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleRandomize}
          >
            <FaRandom className="me-2" />
            Random
          </Button>
        </Card.Header>
        <Card.Body>
          {selectedItems.length === 0 ? (
            <Alert variant="light" className="text-center mb-0">
              Click "Random" để chọn ngữ pháp/từ vựng ngẫu nhiên
            </Alert>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {selectedItems.map((item, idx) => (
                <Badge
                  key={idx}
                  bg={item.structure ? 'danger' : 'info'}
                  className="p-2"
                  style={{ fontSize: '0.9rem' }}
                >
                  {item.structure || item.word || item.kanji}
                  <br />
                  <small>{item.meaning}</small>
                </Badge>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Sentence Input */}
      <Card className="card-custom mb-3">
        <Card.Header>
          <h6 className="mb-0">✍️ Viết câu của bạn</h6>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập câu tiếng Nhật sử dụng ngữ pháp/từ vựng đã chọn..."
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              style={{ fontSize: '1.1rem' }}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="success"
              onClick={handleCheck}
              disabled={loading || !sentence.trim()}
            >
              <FaCheckCircle className="me-2" />
              {loading ? 'Đang kiểm tra...' : 'Kiểm tra câu'}
            </Button>

            <Button
              variant="info"
              onClick={handleGenerateExamples}
              disabled={loading || selectedItems.length === 0}
            >
              <FaLightbulb className="me-2" />
              Gợi ý câu mẫu
            </Button>

            <Button
              variant="outline-primary"
              onClick={handleSave}
              disabled={!sentence.trim()}
            >
              <FaSave className="me-2" />
              Lưu câu
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Check Result */}
      {checkResult && (
        <Card className="card-custom mb-3">
          <Card.Body>
            <Alert variant={checkResult.isCorrect ? 'success' : 'danger'}>
              <h6>{checkResult.message}</h6>
              
              {!checkResult.isCorrect && (
                <>
                  <hr />
                  <strong>Lỗi cần sửa:</strong>
                  <ul className="mb-2 mt-2">
                    {checkResult.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                  
                  {checkResult.correctedSentence && (
                    <>
                      <strong>Câu đúng:</strong>
                      <p className="mb-0 mt-2 p-2 bg-light rounded">
                        {checkResult.correctedSentence}
                      </p>
                    </>
                  )}
                </>
              )}
            </Alert>
          </Card.Body>
        </Card>
      )}

      {/* Example Sentences */}
      {exampleSentences.length > 0 && (
        <Card className="card-custom mb-3">
          <Card.Header>
            <h6 className="mb-0">💡 Câu mẫu gợi ý</h6>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {exampleSentences.map((ex) => (
                <ListGroup.Item key={ex.id}>
                  <p className="mb-1 fw-bold">{ex.sentence}</p>
                  <small className="text-muted">{ex.translation}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* Saved Sentences */}
      {savedSentences.length > 0 && (
        <Card className="card-custom">
          <Card.Header>
            <h6 className="mb-0">💾 Câu đã lưu ({savedSentences.length})</h6>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {savedSentences.slice(0, 5).map((saved) => (
                <ListGroup.Item key={saved.id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <p className="mb-1">{saved.sentence}</p>
                      <small className="text-muted">
                        {new Date(saved.timestamp).toLocaleString('vi-VN')}
                      </small>
                    </div>
                    <Badge bg={saved.isCorrect ? 'success' : 'warning'}>
                      {saved.isCorrect ? 'Đúng' : 'Cần sửa'}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default SentenceBuilder;