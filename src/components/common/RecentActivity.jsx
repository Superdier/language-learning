import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { formatDate } from '../../utils/helpers';
import { FaBook, FaLanguage, FaCheckCircle } from 'react-icons/fa';

const RecentActivity = ({ reviewHistory, limit = 5 }) => {
  const recentReviews = [...reviewHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  const getIcon = (type) => {
    switch (type) {
      case 'grammar':
        return <FaBook className="text-danger" />;
      case 'vocabulary':
      case 'kanji':
        return <FaLanguage className="text-info" />;
      default:
        return <FaCheckCircle className="text-success" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      grammar: 'Ngữ pháp',
      vocabulary: 'Từ vựng',
      kanji: 'Kanji',
      reading: 'Đọc hiểu',
      listening: 'Nghe hiểu'
    };
    return labels[type] || type;
  };

  if (recentReviews.length === 0) {
    return (
      <div className="text-center py-4 text-muted">
        <p>Chưa có hoạt động nào</p>
        <small>Hãy bắt đầu học tập ngay!</small>
      </div>
    );
  }

  return (
    <ListGroup variant="flush">
      {recentReviews.map((review, index) => (
        <ListGroup.Item 
          key={review.id || index}
          className="d-flex justify-content-between align-items-center py-3"
        >
          <div className="d-flex align-items-center">
            <div className="me-3">
              {getIcon(review.type)}
            </div>
            <div>
              <div className="fw-bold">{getTypeLabel(review.type)}</div>
              <small className="text-muted">{formatDate(review.date, 'dd/MM/yyyy HH:mm')}</small>
            </div>
          </div>
          
          <Badge bg={review.correct ? 'success' : 'danger'}>
            {review.correct ? 'Đúng' : 'Sai'}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentActivity;