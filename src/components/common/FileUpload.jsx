import React, { useRef, useState } from 'react';
import { Form, Button, Alert, ProgressBar, ListGroup, Badge } from 'react-bootstrap';
import { FaUpload, FaFileExcel, FaFileCsv, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { processUploadedFile } from '../../services/fileUpload';
import { useApp } from '../../contexts/AppContext';

const FileUpload = () => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const {
    setGrammarItems,
    setContrastCards,
    setVocabularyItems,
    setKanjiItems,
    grammarItems,
    contrastCards,
    vocabularyItems,
    kanjiItems,
    showNotification,
  } = useApp();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Process file
      const result = await processUploadedFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Merge with existing data
      if (result.grammarItems.length > 0) {
        setGrammarItems([...grammarItems, ...result.grammarItems]);
      }
      if (result.contrastCards.length > 0) {
        setContrastCards([...contrastCards, ...result.contrastCards]);
      }
      if (result.vocabularyItems.length > 0) {
        setVocabularyItems([...vocabularyItems, ...result.vocabularyItems]);
      }
      if (result.kanjiItems.length > 0) {
        setKanjiItems([...kanjiItems, ...result.kanjiItems]);
      }

      // Add to uploaded files list
      setUploadedFiles(prev => [...prev, {
        id: Date.now(),
        name: file.name,
        uploadedAt: new Date().toISOString(),
        stats: {
          grammar: result.grammarItems.length,
          contrast: result.contrastCards.length,
          vocabulary: result.vocabularyItems.length,
          kanji: result.kanjiItems.length,
        }
      }]);

      showNotification('Upload file thành công!', 'success');
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      setError(err.message);
      showNotification('Lỗi khi upload file: ' + err.message, 'error');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    showNotification('Đã xóa file khỏi danh sách', 'info');
  };

  return (
    <div>
      {/* Upload Area */}
      <div className="border border-dashed rounded p-4 text-center mb-4" 
           style={{ borderWidth: '2px', borderColor: '#dee2e6' }}>
        <FaUpload size={48} className="text-muted mb-3" />
        <h5>Upload File Excel hoặc CSV</h5>
        <p className="text-muted mb-3">
          Hỗ trợ định dạng: .xlsx, .xls, .csv (Tối đa 10MB)
        </p>
        
        <Form.Control
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          disabled={uploading}
          className="d-none"
        />
        
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Đang xử lý...' : 'Chọn file'}
        </Button>
      </div>

      {/* Progress Bar */}
      {uploading && uploadProgress > 0 && (
        <div className="mb-3">
          <ProgressBar 
            now={uploadProgress} 
            label={`${uploadProgress}%`}
            animated
            striped
          />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <strong>Lỗi:</strong> {error}
        </Alert>
      )}

      {/* File Format Instructions */}
      <Alert variant="info" className="mb-4">
        <strong>📋 Định dạng file yêu cầu:</strong>
        <ul className="mb-0 mt-2">
          <li><strong>Sheet "Grammar":</strong> Level, Structure, Meaning, Example, Translation, Usage</li>
          <li><strong>Sheet "Contrast_Card":</strong> Pair ID, Structure A, Structure B, Comparison, Examples, Mini Exercise</li>
          <li><strong>Sheet "Vocabulary":</strong> Word, Reading, Meaning, Example, Translation, Level</li>
          <li><strong>Sheet "Kanji":</strong> Kanji, Onyomi, Kunyomi, Meaning, Example, Level</li>
        </ul>
      </Alert>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div>
          <h6 className="mb-3">📂 Danh sách file đã upload ({uploadedFiles.length})</h6>
          <ListGroup>
            {uploadedFiles.map(file => (
              <ListGroup.Item 
                key={file.id}
                className="d-flex justify-content-between align-items-start"
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    {file.name.endsWith('.csv') ? (
                      <FaFileCsv className="text-success me-2" size={20} />
                    ) : (
                      <FaFileExcel className="text-success me-2" size={20} />
                    )}
                    <strong>{file.name}</strong>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2">
                    {file.stats.grammar > 0 && (
                      <Badge bg="danger">
                        {file.stats.grammar} Ngữ pháp
                      </Badge>
                    )}
                    {file.stats.contrast > 0 && (
                      <Badge bg="warning">
                        {file.stats.contrast} So sánh
                      </Badge>
                    )}
                    {file.stats.vocabulary > 0 && (
                      <Badge bg="info">
                        {file.stats.vocabulary} Từ vựng
                      </Badge>
                    )}
                    {file.stats.kanji > 0 && (
                      <Badge bg="secondary">
                        {file.stats.kanji} Kanji
                      </Badge>
                    )}
                  </div>
                  
                  <small className="text-muted d-block mt-2">
                    {new Date(file.uploadedAt).toLocaleString('vi-VN')}
                  </small>
                </div>
                
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {/* Current Data Summary */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="mb-3">📊 Tổng dữ liệu hiện tại</h6>
        <div className="d-flex flex-wrap gap-3">
          <div>
            <FaCheckCircle className="text-danger me-2" />
            <strong>{grammarItems.length}</strong> Ngữ pháp
          </div>
          <div>
            <FaCheckCircle className="text-warning me-2" />
            <strong>{contrastCards.length}</strong> So sánh
          </div>
          <div>
            <FaCheckCircle className="text-info me-2" />
            <strong>{vocabularyItems.length}</strong> Từ vựng
          </div>
          <div>
            <FaCheckCircle className="text-secondary me-2" />
            <strong>{kanjiItems.length}</strong> Kanji
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;