import React, { useState } from "react";
import { Container, Tabs, Tab, Alert, Badge } from "react-bootstrap";
import { FaBookOpen, FaInfoCircle } from "react-icons/fa";
import DiaryEditor from "../components/writing/DiaryEditor";
import WritingStats from "../components/writing/WritingStats";

const Diary = () => {
  const [activeTab, setActiveTab] = useState("editor");

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">📓 Nhật ký tiếng Nhật</h2>
        <p className="text-muted">
          Viết nhật ký hàng ngày để cải thiện kỹ năng viết
        </p>
      </div>

      {/* Info Alert */}
      <Alert variant="info" className="mb-4">
        <FaInfoCircle className="me-2" />
        <strong>Lợi ích:</strong> Viết nhật ký giúp bạn ôn tập ngữ pháp, từ vựng
        một cách tự nhiên và phát triển kỹ năng diễn đạt. AI sẽ kiểm tra lỗi và
        đưa ra gợi ý cải thiện.
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
          eventKey="editor"
          title={
            <>
              <FaBookOpen className="me-2" />
              Viết nhật ký
            </>
          }
        >
          <DiaryEditor />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Diary;
