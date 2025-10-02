import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaLink, FaDownload } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';

const ExcelLinkInput = () => {
  const [excelLink, setExcelLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useApp();

  const handleFetchData = async () => {
    if (!excelLink.trim()) {
      setError('Vui lòng nhập link Excel');
      return;
    }

    // Validate Google Sheets link
    if (!excelLink.includes('docs.google.com/spreadsheets')) {
      setError('Link không hợp lệ. Vui lòng sử dụng link Google Sheets');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Convert Google Sheets link to export URL
      let exportUrl = excelLink;
      
      // If it's a regular Google Sheets URL, convert it
      if (excelLink.includes('/edit')) {
        const sheetId = excelLink.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        if (sheetId) {
          exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
        }
      }

      showNotification('Chức năng này sẽ được hoàn thiện trong phiên bản sau', 'info');
      
      // TODO: Implement actual fetching from Google Sheets
      // This requires CORS proxy or Google Sheets API
      
    } catch (err) {
      setError('Không thể tải dữ liệu từ link. Vui lòng thử lại.');
      showNotification('Lỗi khi tải dữ liệu: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h6 className="mb-3">🔗 Kết nối với Google Sheets</h6>
      
      <Alert variant="warning" className="mb-3">
        <small>
          <strong>Hướng dẫn:</strong><br/>
          1. Mở Google Sheets của bạn<br/>
          2. Click "File" → "Share" → "Publish to web"<br/>
          3. Chọn "Link" và click "Publish"<br/>
          4. Copy link và paste vào đây
        </small>
      </Alert>

      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaLink />
        </InputGroup.Text>
        <Form.Control
          type="url"
          placeholder="https://docs.google.com/spreadsheets/d/..."
          value={excelLink}
          onChange={(e) => {
            setExcelLink(e.target.value);
            setError(null);
          }}
          disabled={loading}
        />
        <Button
          variant="primary"
          onClick={handleFetchData}
          disabled={loading || !excelLink.trim()}
        >
          <FaDownload className="me-2" />
          {loading ? 'Đang tải...' : 'Lấy dữ liệu'}
        </Button>
      </InputGroup>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Alert variant="info">
        <small>
          💡 <strong>Lưu ý:</strong> Đảm bảo Google Sheets của bạn đã được công khai 
          hoặc chia sẻ với "Anyone with the link can view"
        </small>
      </Alert>
    </div>
  );
};

export default ExcelLinkInput;