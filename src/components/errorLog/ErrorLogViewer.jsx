import React, { useState, useMemo } from "react";
import {
  Card,
  Table,
  Badge,
  Form,
  InputGroup,
  Button,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { FaFilter, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { useApp } from "../../contexts/AppContext";
import { formatDate } from "../../utils/helpers";
import { PART_TYPES, ERROR_STATUS } from "../../utils/constants";
import ErrorLogDetail from "./ErrorLogDetail";

const ErrorLogViewer = () => {
  const { errorLog } = useApp();
  const { importedErrorLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPart, setFilterPart] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Get unique sources
  const sources = useMemo(() => {
    return [...new Set(errorLog.map((e) => e.source))];
  }, [errorLog]);

  // Filter error logs
  const filteredLogs = useMemo(() => {
    let filtered = importedErrorLogs;

    if (filterPart !== "all") {
      filtered = filtered.filter((log) => log.part === filterPart);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((log) => log.status === filterStatus);
    }

    if (filterSource !== "all") {
      filtered = filtered.filter((log) => log.source === filterSource);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.correctAnswer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.explanation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [importedErrorLogs, filterPart, filterStatus, filterSource, searchTerm]);

  const getPartBadgeColor = (part) => {
    switch (part) {
      case PART_TYPES.GRAMMAR:
        return "danger";
      case PART_TYPES.VOCABULARY:
        return "info";
      case PART_TYPES.KANJI:
        return "secondary";
      case PART_TYPES.READING:
        return "success";
      case PART_TYPES.LISTENING:
        return "primary";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case ERROR_STATUS.NEW:
        return "warning";
      case ERROR_STATUS.IN_PROGRESS:
        return "info";
      case ERROR_STATUS.REVIEWING:
        return "primary";
      case ERROR_STATUS.DONE:
        return "success";
      case ERROR_STATUS.ARCHIVED:
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Handle row click
  const handleRowClick = (log) => {
    setSelectedLog(log);
    setShowDetail(true);
  };

  return (
    <>
      <Card className="card-custom">
        <Card.Header>
          <h5 className="mb-0">
            📋 Error Log từ Google Sheets ({filteredLogs.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {/* Filters */}
          <div className="mb-4">
            <Row>
              <Col md={6}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Tìm kiếm trong error log..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filterPart}
                  onChange={(e) => setFilterPart(e.target.value)}
                >
                  <option value="all">Tất cả loại</option>
                  {Object.values(PART_TYPES).map((part) => (
                    <option key={part} value={part}>
                      {part}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  {Object.values(ERROR_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                >
                  <option value="all">Tất cả nguồn</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </div>

          {/* Table */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>Không có error log nào từ Google Sheets</p>
              <small>
                Vui lòng import từ Google Sheets với sheet "Error Log Template"
              </small>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Ngày</th>
                    <th>Nguồn</th>
                    <th>Loại</th>
                    <th>Câu hỏi</th>
                    <th>Đáp án sai</th>
                    <th>Đáp án đúng</th>
                    <th>SRS</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, idx) => (
                    <tr
                      key={log.id}
                      onClick={() => handleRowClick(log)}
                      style={{ cursor: "pointer" }}
                      className="align-middle"
                    >
                      <td>{log.no}</td>
                      <td>
                        <small>{formatDate(log.date, "dd/MM/yyyy")}</small>
                      </td>
                      <td>
                        <small className="text-muted">{log.source}</small>
                      </td>
                      <td>
                        <Badge bg={getPartBadgeColor(log.part)}>
                          {log.part}
                        </Badge>
                      </td>
                      <td>
                        <div
                          style={{
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <small>{log.question}</small>
                        </div>
                      </td>
                      <td>
                        <small className="text-danger">{log.userAnswer}</small>
                      </td>
                      <td>
                        <small className="text-success">
                          {log.correctAnswer}
                        </small>
                      </td>
                      <td>{log.needsSRS && <Badge bg="primary">Yes</Badge>}</td>
                      <td>
                        <Badge bg={getStatusBadgeColor(log.status)}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <ErrorLogDetail
        show={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedLog(null);
        }}
        errorLog={selectedLog}
      />
    </>
  );
};

export default ErrorLogViewer;
