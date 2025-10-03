import React from "react";
import { Card, Badge, Button, ProgressBar } from "react-bootstrap";
import {
  FaBook,
  FaLanguage,
  FaFont,
  FaArrowsAltH,
  FaPlay,
} from "react-icons/fa";

const ReviewCard = ({
  title,
  description,
  count,
  color,
  icon,
  onStart,
  disabled = false,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "grammar":
        return <FaBook size={32} />;
      case "vocabulary":
        return <FaLanguage size={32} />;
      case "kanji":
        return <FaFont size={32} />;
      case "contrast":
        return <FaArrowsAltH size={32} />;
      default:
        return <FaBook size={32} />;
    }
  };

  return (
    <Card className="card-custom h-100">
      <Card.Body>
        <div className="text-center">
          <div className={`text-${color} mb-3`}>{getIcon()}</div>

          <h5 className="mb-2">{title}</h5>
          <p className="text-muted small mb-3">{description}</p>

          <div className="mb-3">
            <h2 className={`text-${color} mb-0`}>{count}</h2>
            <small className="text-muted">mục cần ôn</small>
          </div>

          <Button
            variant={color}
            className="w-100"
            onClick={onStart}
            disabled={disabled || count === 0}
          >
            <FaPlay className="me-2" />
            {count === 0 ? "Không có mục nào" : "Bắt đầu ôn tập"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
