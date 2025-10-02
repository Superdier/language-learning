import React, { useState } from "react";
import { Container, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import {
  FaChartLine,
  FaBook,
  FaLanguage,
  FaFire,
  FaClock,
} from "react-icons/fa";
import { useApp } from "../contexts/AppContext";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import ProgressChart from "../components/charts/ProgressChart";
import RecentActivity from "../components/common/RecentActivity";
import QuickActions from "../components/common/QuickActions";
import { calculateStreak } from "../utils/helpers";
import { generateMockKanjiItems, generateMockGrammarItems, generateMockVocabularyItems, generateMockReviewHistory } from '../utils/mockData';

const Dashboard = () => {
  const { grammarItems, vocabularyItems, kanjiItems, reviewHistory, setGrammarItems, setVocabularyItems, setKanjiItems, setReviewHistory } = useApp();
  const [chartViewMode, setChartViewMode] = useState("week");

  // Calculate statistics
  const totalGrammar = grammarItems.length;
  const totalVocabulary = vocabularyItems.length + kanjiItems.length;
  const totalReviews = reviewHistory.length;
  const streak = calculateStreak(reviewHistory);

  // Calculate today's reviews
  const today = new Date().toDateString();
  const todayReviews = reviewHistory.filter((record) => {
    const recordDate = new Date(record.date).toDateString();
    return today === recordDate;
  }).length;

  // Calculate items due for review
  const itemsDue = [...grammarItems, ...vocabularyItems, ...kanjiItems].filter(
    (item) => {
      if (!item.nextReviewDate) return true;
      return new Date(item.nextReviewDate) <= new Date();
    }
  ).length;

  const loadMockData = () => {
    setGrammarItems(generateMockGrammarItems(20));
    setVocabularyItems(generateMockVocabularyItems(30));
    setKanjiItems(generateMockKanjiItems(15));
    setReviewHistory(generateMockReviewHistory(7));
    window.alert('Đã tải dữ liệu mẫu thành công!');
  };

  const stats = [
    {
      title: "Ngữ pháp đã học",
      value: totalGrammar,
      icon: <FaBook />,
      color: "danger",
      subtitle: `${itemsDue} mục cần ôn`,
    },
    {
      title: "Từ vựng đã học",
      value: totalVocabulary,
      icon: <FaLanguage />,
      color: "info",
      subtitle: "Bao gồm Kanji",
    },
    {
      title: "Ôn tập hôm nay",
      value: todayReviews,
      icon: <FaClock />,
      color: "success",
      subtitle: `${totalReviews} lượt tổng`,
    },
    {
      title: "Chuỗi học liên tiếp",
      value: `${streak} ngày`,
      icon: <FaFire />,
      color: "warning",
      subtitle: "Tiếp tục phát huy!",
    },
  ];

  return (
    <Container fluid>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">🏠 Dashboard</h2>
          <p className="text-muted">Tổng quan về tiến độ học tập của bạn</p>
        </div>
        <Button variant="outline-secondary" onClick={loadMockData}>
          Tải dữ liệu mẫu
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={6} lg={3} key={index} className="mb-3">
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div className="mb-4">
        <h5 className="mb-3">⚡ Thao tác nhanh</h5>
        <QuickActions />
      </div>

      {/* Progress Chart */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <FaChartLine className="me-2 text-primary" />
                Biểu đồ tiến độ
              </h5>
              <ButtonGroup size="sm">
                <Button
                  variant={
                    chartViewMode === "week" ? "primary" : "outline-primary"
                  }
                  onClick={() => setChartViewMode("week")}
                >
                  7 ngày
                </Button>
                <Button
                  variant={
                    chartViewMode === "month" ? "primary" : "outline-primary"
                  }
                  onClick={() => setChartViewMode("month")}
                >
                  30 ngày
                </Button>
              </ButtonGroup>
            </div>

            <ProgressChart
              reviewHistory={reviewHistory}
              viewMode={chartViewMode}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col md={12}>
          <Card title="📝 Hoạt động gần đây">
            <RecentActivity reviewHistory={reviewHistory} limit={8} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
