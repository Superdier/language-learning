import React, { useState } from "react";
import { Container, Tabs, Tab, Alert, Badge } from "react-bootstrap";
import { FaPencilAlt, FaBookOpen, FaInfoCircle } from "react-icons/fa";
import SentenceBuilder from "../components/writing/SentenceBuilder";
import WritingStats from "../components/writing/WritingStats";

const Writing = () => {
  const [activeTab, setActiveTab] = useState("sentence");

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">✍️ Luyện đặt câu</h2>
        <p className="text-muted">
          Thực hành viết câu với ngữ pháp và từ vựng đã học
        </p>
      </div>

      {/* Info Alert */}
      <Alert variant="info" className="mb-4">
        <FaInfoCircle className="me-2" />
        <strong>Hướng dẫn:</strong> Chọn chế độ luyện tập, click "Random" để
        chọn ngữ pháp/từ vựng, sau đó viết câu và nhấn "Kiểm tra câu" để AI phân
        tích.
        <Badge bg="warning" className="ms-2">
          AI Mock - Demo mode
        </Badge>
      </Alert>

      <WritingStats />
      <div className="mb-4"></div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab
          eventKey="sentence"
          title={
            <>
              <FaPencilAlt className="me-2" />
              Đặt câu
            </>
          }
        >
          <SentenceBuilder />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Writing;
