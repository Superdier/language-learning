import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Form,
  Button,
  ButtonGroup,
  Badge,
  InputGroup,
} from "react-bootstrap";
import {
  FaBook,
  FaArrowsAltH,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import GrammarItem from "../components/grammar/GrammarItem";
import GrammarQuiz from "../components/grammar/GrammarQuiz";
import ContrastCard from "../components/grammar/ContrastCard";
import ContrastQuiz from "../components/grammar/ContrastQuiz";
import ErrorExplanations from "../components/grammar/ErrorExplanations";
import { JLPT_LEVELS } from "../utils/constants";
import { generateMockContrastCards } from "../utils/mockData";

const Grammar = () => {
  const { grammarItems, errorLog } = useApp();
  const [contrastCards, setContrastCards] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [quizModalShow, setQuizModalShow] = useState(false);
  const [contrastQuizModalShow, setContrastQuizModalShow] = useState(false);
  const [selectedGrammarItem, setSelectedGrammarItem] = useState(null);
  const [selectedContrastCard, setSelectedContrastCard] = useState(null);
  const [quizType, setQuizType] = useState("fill_blank");
  const [activeTab, setActiveTab] = useState("list");

  // Filter grammar items
  const filteredGrammarItems = useMemo(() => {
    let filtered = grammarItems;

    if (selectedLevel !== "all") {
      filtered = filtered.filter((item) => item.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.structure.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [grammarItems, selectedLevel, searchTerm]);

  // Filter contrast cards
  const filteredContrastCards = useMemo(() => {
    if (!searchTerm) return contrastCards;

    return contrastCards.filter(
      (card) =>
        card.structureA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.structureB.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.comparison.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contrastCards, searchTerm]);

  const handleStartQuiz = (item, type = "fill_blank") => {
    setSelectedGrammarItem(item);
    setQuizType(type);
    setQuizModalShow(true);
  };

  const handleStartContrastQuiz = (card) => {
    setSelectedContrastCard(card);
    setContrastQuizModalShow(true);
  };

  const loadMockContrastCards = () => {
    setContrastCards(generateMockContrastCards(5));
    window.alert("Đã tải dữ liệu so sánh mẫu!");
  };

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">📖 Ngữ pháp</h2>
        <p className="text-muted">Học và ôn tập ngữ pháp tiếng Nhật</p>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Tab 1: Grammar List */}
        <Tab
          eventKey="list"
          title={
            <>
              <FaBook className="me-2" />
              Danh sách ngữ pháp
              <Badge bg="primary" className="ms-2">
                {grammarItems.length}
              </Badge>
            </>
          }
        >
          <Row>
            <Col md={12} lg={3} className="mb-4">
              <Card title="🔍 Bộ lọc" variant="light">
                {/* Search */}
                <Form.Group className="mb-3">
                  <Form.Label>Tìm kiếm</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm ngữ pháp..."
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
                      variant={
                        selectedLevel === "all" ? "primary" : "outline-primary"
                      }
                      onClick={() => setSelectedLevel("all")}
                    >
                      Tất cả ({grammarItems.length})
                    </Button>
                    {JLPT_LEVELS.map((level) => {
                      const count = grammarItems.filter(
                        (g) => g.level === level
                      ).length;
                      return (
                        <Button
                          key={level}
                          variant={
                            selectedLevel === level
                              ? "primary"
                              : "outline-primary"
                          }
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
                    Ôn ngữ pháp cần học
                  </Button>
                  <Button variant="warning" size="sm">
                    Ngữ pháp hay sai
                  </Button>
                </div>
              </Card>
            </Col>

            <Col md={12} lg={9}>
              {/* Results Info */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-0">
                    Tìm thấy {filteredGrammarItems.length} ngữ pháp
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
                    setSearchTerm("");
                    setSelectedLevel("all");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>

              {/* Grammar Items List */}
              {filteredGrammarItems.length === 0 ? (
                <Card>
                  <div className="text-center py-5">
                    <p className="text-muted mb-3">
                      Không tìm thấy ngữ pháp nào
                    </p>
                    <Button variant="primary" href="/data">
                      Upload dữ liệu
                    </Button>
                  </div>
                </Card>
              ) : (
                filteredGrammarItems.map((item) => (
                  <GrammarItem
                    key={item.id}
                    item={item}
                    onStartQuiz={handleStartQuiz}
                  />
                ))
              )}
            </Col>
          </Row>
        </Tab>

        {/* Tab 2: Contrast Cards */}
        <Tab
          eventKey="contrast"
          title={
            <>
              <FaArrowsAltH className="me-2" />
              So sánh ngữ pháp
              <Badge bg="warning" className="ms-2">
                {contrastCards.length}
              </Badge>
            </>
          }
        >
          {/* Search for Contrast Cards */}
          <div className="mb-4">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm so sánh ngữ pháp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>

          {filteredContrastCards.length === 0 ? (
            <Card>
              <div className="text-center py-5">
                <p className="text-muted mb-3">
                  {contrastCards.length === 0
                    ? "Chưa có dữ liệu so sánh ngữ pháp"
                    : "Không tìm thấy kết quả phù hợp"}
                </p>
                {contrastCards.length === 0 && (
                  <Button variant="primary" href="/data">
                    Upload dữ liệu
                  </Button>
                )}
                <Button
                  variant="outline-secondary"
                  onClick={loadMockContrastCards}
                  className="ml-3"
                >
                  Tải dữ liệu mẫu
                </Button>
              </div>
            </Card>
          ) : (
            <Row>
              {filteredContrastCards.map((card) => (
                <Col md={12} key={card.id}>
                  <ContrastCard
                    contrastCard={card}
                    onStartQuiz={handleStartContrastQuiz}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        {/* Tab 3: Error Explanations */}
        <Tab
          eventKey="errors"
          title={
            <>
              <FaExclamationTriangle className="me-2" />
              Lỗi sai & Giải thích
              <Badge bg="danger" className="ms-2">
                {errorLog.filter((e) => e.type === "grammar").length}
              </Badge>
            </>
          }
        >
          <ErrorExplanations errorLog={errorLog} />
        </Tab>
      </Tabs>

      {/* Quiz Modals */}
      {selectedGrammarItem && (
        <GrammarQuiz
          show={quizModalShow}
          onHide={() => {
            setQuizModalShow(false);
            setSelectedGrammarItem(null);
          }}
          grammarItem={selectedGrammarItem}
          quizType={quizType}
        />
      )}

      {selectedContrastCard && (
        <ContrastQuiz
          show={contrastQuizModalShow}
          onHide={() => {
            setContrastQuizModalShow(false);
            setSelectedContrastCard(null);
          }}
          contrastCard={selectedContrastCard}
        />
      )}
    </Container>
  );
};

export default Grammar;
