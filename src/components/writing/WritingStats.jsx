import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { FaPencilAlt, FaCheckCircle, FaTimesCircle, FaBook } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';

const WritingStats = () => {
  const { savedSentences, savedDiaries } = useApp();

  const sentenceStats = {
    total: savedSentences.length,
    correct: savedSentences.filter(s => s.isCorrect).length,
    needFix: savedSentences.filter(s => !s.isCorrect).length
  };

  const diaryStats = {
    total: savedDiaries.length,
    avgScore: savedDiaries.length > 0 
      ? Math.round(savedDiaries.reduce((sum, d) => sum + (d.checkResult?.overallScore || 0), 0) / savedDiaries.length)
      : 0,
    totalWords: savedDiaries.reduce((sum, d) => sum + d.content.length, 0)
  };

  const stats = [
    {
      icon: <FaPencilAlt size={24} />,
      label: 'Câu đã viết',
      value: sentenceStats.total,
      color: 'primary'
    },
    {
      icon: <FaCheckCircle size={24} />,
      label: 'Câu đúng',
      value: sentenceStats.correct,
      color: 'success'
    },
    {
      icon: <FaTimesCircle size={24} />,
      label: 'Cần sửa',
      value: sentenceStats.needFix,
      color: 'warning'
    },
    {
      icon: <FaBook size={24} />,
      label: 'Nhật ký',
      value: diaryStats.total,
      color: 'info'
    }
  ];

  return (
    <Row>
      {stats.map((stat, idx) => (
        <Col md={6} lg={3} key={idx}>
          <Card className="card-custom h-100">
            <Card.Body className="text-center">
              <div className={`text-${stat.color} mb-2`}>
                {stat.icon}
              </div>
              <h6 className="text-muted mb-2">{stat.label}</h6>
              <h3 className={`text-${stat.color} mb-0`}>{stat.value}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default WritingStats;