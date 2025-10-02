import React from 'react';
import { Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { FaUpload, FaDatabase, FaTrash } from 'react-icons/fa';
import Card from '../components/ui/Card';
import FileUpload from '../components/common/FileUpload';
import ExcelLinkInput from '../components/common/ExcelLinkInput';
import { useApp } from '../contexts/AppContext';

const DataManagement = () => {
  const { clearAllData } = useApp();

  const handleClearData = () => {
    if (window.confirm('⚠️ Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu? Hành động này không thể hoàn tác!')) {
      clearAllData();
    }
  };

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="mb-1">📁 Quản lý dữ liệu</h2>
        <p className="text-muted">Import và quản lý dữ liệu học tập của bạn</p>
      </div>

      <Row>
        <Col md={12} lg={8}>
          <Card>
            <Tabs defaultActiveKey="upload" className="mb-3">
              <Tab eventKey="upload" title={<><FaUpload className="me-2" />Upload File</>}>
                <FileUpload />
              </Tab>
              
              <Tab eventKey="link" title={<><FaDatabase className="me-2" />Google Sheets</>}>
                <ExcelLinkInput />
              </Tab>
            </Tabs>
          </Card>
        </Col>

        <Col md={12} lg={4}>
          <Card title="⚙️ Cài đặt" variant="light">
            <div className="d-grid gap-2">
              <Button 
                variant="outline-danger"
                onClick={handleClearData}
              >
                <FaTrash className="me-2" />
                Xóa tất cả dữ liệu
              </Button>

              <Button variant="outline-secondary" disabled>
                Xuất dữ liệu
              </Button>

              <Button variant="outline-secondary" disabled>
                Sao lưu
              </Button>
            </div>

            <hr />

            <div className="mt-3">
              <h6 className="mb-3">📝 Mẫu file Excel</h6>
              <p className="text-muted small mb-2">
                Tải về file mẫu để dễ dàng chuẩn bị dữ liệu:
              </p>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="w-100"
                onClick={() => {
                  window.open('https://docs.google.com/spreadsheets/d/1example/template', '_blank');
                }}
                disabled
              >
                Tải file mẫu
              </Button>
            </div>
          </Card>

          <Card title="💡 Hướng dẫn" variant="info" className="mt-3">
            <small>
              <p><strong>Cấu trúc file Excel:</strong></p>
              <ol className="mb-0 ps-3">
                <li>Tạo các sheet riêng biệt cho Grammar, Vocabulary, Kanji, Contrast_Card</li>
                <li>Dòng đầu tiên là tên cột (headers)</li>
                <li>Các dòng tiếp theo là dữ liệu</li>
                <li>Không để trống cột quan trọng (Structure, Word, Kanji)</li>
              </ol>
            </small>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DataManagement;