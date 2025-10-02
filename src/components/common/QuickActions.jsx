import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaLanguage,
  FaCheckCircle,
  FaPencilAlt,
  FaUpload,
} from "react-icons/fa";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Học ngữ pháp",
      description: "Học và ôn tập ngữ pháp",
      icon: <FaBook size={24} />,
      color: "danger",
      path: "/grammar",
    },
    {
      title: "Học từ vựng",
      description: "Mở rộng vốn từ vựng",
      icon: <FaLanguage size={24} />,
      color: "info",
      path: "/vocabulary",
    },
    {
      title: "Ôn tập",
      description: "Luyện tập với SRS",
      icon: <FaCheckCircle size={24} />,
      color: "success",
      path: "/practice",
    },
    {
      title: "Đặt câu",
      description: "Luyện viết câu",
      icon: <FaPencilAlt size={24} />,
      color: "warning",
      path: "/writing",
    },
    {
      title: "Đọc hiểu",
      description: "Luyện kỹ năng đọc",
      icon: <FaBook size={24} />,
      color: "success",
      path: "/reading",
    },
    {
      title: "Nghe hiểu",
      description: "Luyện kỹ năng nghe",
      icon: <FaHeadphones size={24} />,
      color: "info",
      path: "/listening",
    },
  ];

  return (
    <Row>
      {actions.map((action, index) => (
        <Col md={6} lg={3} key={index} className="mb-3">
          <Card
            className="card-custom h-100 text-center cursor-pointer"
            onClick={() => navigate(action.path)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <div className={`text-${action.color} mb-3`}>{action.icon}</div>
              <h6 className="fw-bold mb-2">{action.title}</h6>
              <small className="text-muted">{action.description}</small>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default QuickActions;
