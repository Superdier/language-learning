import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Tabs, Tab, Form, Button, Badge, InputGroup, ButtonGroup } from 'react-bootstrap';
import { FaLanguage, FaFont, FaGraduationCap, FaSearch, FaFilter } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import VocabularyItem from '../components/vocabulary/VocabularyItem';
import VocabularyQuiz from '../components/vocabulary/VocabularyQuiz';
import Flashcard from '../components/vocabulary/Flashcard';
import { JLPT_LEVELS } from '../utils/constants';

const Vocabulary = () => {
  const { vocabularyItems, kanjiItems, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState('vocabulary');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'flashcard'
  const [quizModalShow, setQuizModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quizType, setQuizType] = useState('meaning');

  // Filter vocabulary items
  const filteredVocabulary = useMemo(() => {
    let filtered = vocabularyItems;

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(item => item.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [vocabularyItems, selectedLevel, searchTerm]);

  // Filter kanji items
  const filteredKanji = useMemo(() => {
    let filtered = kanjiItems;

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(item => item.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.kanji.includes(searchTerm) ||
        item.onyomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kunyomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [kanjiItems, selectedLevel, searchTerm]);

  const handleStartQuiz = (item, type, itemType) => {
    setSelectedItem({ ...item, itemType });
    setQuizType(type);
    setQuizModalShow(true);
  };

  const handleFlashcardComplete = ({ remembered, forgotten }) => {
    showNotification(
      `Hoàn thành! Nhớ: ${remembered.length}, Quên: ${forgotten.length}`,
      'success'
    );
  };

  const currentItems = activeTab === 'vocabulary' ? filteredVocabulary : filteredKanji;

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">📝 Từ vựng</h2>
        <p className="text-muted">Học và ôn tập từ vựng, Kanji tiếng Nhật</p>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setViewMode('list');
          setSearchTerm('');
        }}
        className="mb-4"
      >
        {/* Vocabulary Tab */}
        <Tab eventKey="vocabulary" title={
          <>
            <FaLanguage className="me-2" />
            Từ vựng
            <Badge bg="info" className="ms-2">{vocabularyItems.length}</Badge>
          </>
        }>
          <Row>
            {/* Sidebar */}
            <Col md={12} lg={3} className="mb-4">
              <Card title="🔍 Bộ lọc" variant="light">
                {/* View Mode Toggle */}
                <div className="mb-3">
                  <Form.Label>Chế độ xem</Form.Label>
                  <ButtonGroup className="d-flex">
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                      onClick={() => setViewMode('list')}
                    >
                      Danh sách
                    </Button>
                    <Button
                      variant={viewMode === 'flashcard' ? 'primary' : 'outline-primary'}
                      onClick={() => setViewMode('flashcard')}
                    >
                      Flashcard
                    </Button>
                  </ButtonGroup>
                </div>
                <hr />

                {/* Search */}
                <Form.Group className="mb-3">
                  <Form.Label>Tìm kiếm</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm từ vựng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Level Filter */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaFilter className="me-2" />
                    Cấp độ JLPT
                  </Form.Label>
                  <div className="d-grid gap-2">
                    <Button
                      variant={selectedLevel === 'all' ? 'primary' : 'outline-primary'}
                      onClick={() => setSelectedLevel('all')}
                    >
                      Tất cả ({vocabularyItems.length})
                    </Button>
                    {JLPT_LEVELS.map(level => {
                      const count = vocabularyItems.filter(v => v.level === level).length;
                      return (
                        <Button
                          key={level}
                          variant={selectedLevel === level ? 'primary' : 'outline-primary'}
                          onClick={() => setSelectedLevel(level)}
                        >
                          {level} ({count})
                        </Button>
                      );
                    })}
                  </div>
                </Form.Group>

                {/* Quick Actions */}
                <hr />
                <div className="d-grid gap-2">
                  <Button variant="success" size="sm">
                    Từ cần ôn
                  </Button>
                  <Button variant="warning" size="sm">
                    Từ hay sai
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Main Content */}
            <Col md={12} lg={9}>
              {/* Results Info */}
              {viewMode === 'list' && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-0">
                      Tìm thấy {filteredVocabulary.length} từ vựng
                    </h5>
                    {searchTerm && (
                      <small className="text-muted">
                        Kết quả tìm kiếm cho "{searchTerm}"
                      </small>
                    )}
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLevel('all');
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <>
                  {filteredVocabulary.length === 0 ? (
                    <Card>
                      <div className="text-center py-5">
                        <p className="text-muted mb-3">Không tìm thấy từ vựng nào</p>
                        <Button variant="primary" href="/data">
                          Upload dữ liệu
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    filteredVocabulary.map(item => (
                      <VocabularyItem
                        key={item.id}
                        item={item}
                        type="vocabulary"
                        onStartQuiz={(item, type) => handleStartQuiz(item, type, 'vocabulary')}
                      />
                    ))
                  )}
                </>
              )}

              {/* Flashcard View */}
              {viewMode === 'flashcard' && (
                <Card>
                  {filteredVocabulary.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted mb-3">Không có từ vựng nào để học</p>
                      <Button variant="primary" href="/data">
                        Upload dữ liệu
                      </Button>
                    </div>
                  ) : (
                    <Flashcard
                      items={filteredVocabulary}
                      type="vocabulary"
                      onComplete={handleFlashcardComplete}
                    />
                  )}
                </Card>
              )}
            </Col>
          </Row>
        </Tab>

        {/* Kanji Tab */}
        <Tab eventKey="kanji" title={
          <>
            <FaFont className="me-2" />
            Kanji
            <Badge bg="secondary" className="ms-2">{kanjiItems.length}</Badge>
          </>
        }>
          <Row>
            {/* Sidebar */}
            <Col md={12} lg={3} className="mb-4">
              <Card title="🔍 Bộ lọc" variant="light">
                {/* View Mode Toggle */}
                <div className="mb-3">
                  <Form.Label>Chế độ xem</Form.Label>
                  <ButtonGroup className="d-flex">
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                      onClick={() => setViewMode('list')}
                    >
                      Danh sách
                    </Button>
                    <Button
                      variant={viewMode === 'flashcard' ? 'primary' : 'outline-primary'}
                      onClick={() => setViewMode('flashcard')}
                    >
                      Flashcard
                    </Button>
                  </ButtonGroup>
                </div>

                <hr />

                {/* Search */}
                <Form.Group className="mb-3">
                  <Form.Label>Tìm kiếm</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm Kanji..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Level Filter */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaFilter className="me-2" />
                    Cấp độ JLPT
                  </Form.Label>
                  <div className="d-grid gap-2">
                    <Button
                      variant={selectedLevel === 'all' ? 'primary' : 'outline-primary'}
                      onClick={() => setSelectedLevel('all')}
                    >
                      Tất cả ({kanjiItems.length})
                    </Button>
                    {JLPT_LEVELS.map(level => {
                      const count = kanjiItems.filter(k => k.level === level).length;
                      return (
                        <Button
                          key={level}
                          variant={selectedLevel === level ? 'primary' : 'outline-primary'}
                          onClick={() => setSelectedLevel(level)}
                        >
                          {level} ({count})
                        </Button>
                      );
                    })}
                  </div>
                </Form.Group>

                {/* Quick Actions */}
                <hr />
                <div className="d-grid gap-2">
                  <Button variant="success" size="sm">
                    Kanji cần ôn
                  </Button>
                  <Button variant="warning" size="sm">
                    Kanji hay sai
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Main Content */}
            <Col md={12} lg={9}>
              {/* Results Info */}
              {viewMode === 'list' && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-0">
                      Tìm thấy {filteredKanji.length} Kanji
                    </h5>
                    {searchTerm && (
                      <small className="text-muted">
                        Kết quả tìm kiếm cho "{searchTerm}"
                      </small>
                    )}
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLevel('all');
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <>
                  {filteredKanji.length === 0 ? (
                    <Card>
                      <div className="text-center py-5">
                        <p className="text-muted mb-3">Không tìm thấy Kanji nào</p>
                        <Button variant="primary" href="/data">
                          Upload dữ liệu
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    filteredKanji.map(item => (
                      <VocabularyItem
                        key={item.id}
                        item={item}
                        type="kanji"
                        onStartQuiz={(item, type) => handleStartQuiz(item, type, 'kanji')}
                      />
                    ))
                  )}
                </>
              )}

              {/* Flashcard View */}
              {viewMode === 'flashcard' && (
                <Card>
                  {filteredKanji.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted mb-3">Không có Kanji nào để học</p>
                      <Button variant="primary" href="/data">
                        Upload dữ liệu
                      </Button>
                    </div>
                  ) : (
                    <Flashcard
                      items={filteredKanji}
                      type="kanji"
                      onComplete={handleFlashcardComplete}
                    />
                  )}
                </Card>
              )}
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Quiz Modal */}
      {selectedItem && (
        <VocabularyQuiz
          show={quizModalShow}
          onHide={() => {
            setQuizModalShow(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          quizType={quizType}
          type={selectedItem.itemType}
        />
      )}
    </Container>
  );
};

export default Vocabulary;