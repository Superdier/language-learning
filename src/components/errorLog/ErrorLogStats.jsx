import React, { useMemo } from "react";
import { Row, Col, Card, Badge, ProgressBar } from "react-bootstrap";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaChartPie,
} from "react-icons/fa";
import { useApp } from "../../contexts/AppContext";
import { Pie } from "react-chartjs-2";
import { getErrorLogStatistics } from "../../services/errorLogProcessor";
import { CHART_COLORS } from "../../utils/constants";

const ErrorLogStats = () => {
  const { importedErrorLogs } = useApp();

  const stats = useMemo(() => {
    return getErrorLogStatistics(importedErrorLogs);
  }, [importedErrorLogs]);

  // Pie chart data for parts
  const partChartData = {
    labels: Object.keys(stats.byPart),
    datasets: [
      {
        data: Object.values(stats.byPart),
        backgroundColor: [
          CHART_COLORS.grammar,
          CHART_COLORS.vocabulary,
          CHART_COLORS.kanji,
          CHART_COLORS.reading,
          CHART_COLORS.listening,
        ],
      },
    ],
  };

  // Pie chart data for status
  const statusChartData = {
    labels: Object.keys(stats.byStatus),
    datasets: [
      {
        data: Object.values(stats.byStatus),
        backgroundColor: [
          "#ffc107",
          "#0dcaf0",
          "#0d6efd",
          "#198754",
          "#6c757d",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">📊 Thống kê Error Log</h5>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="card-custom h-100">
            <Card.Body className="text-center">
              <FaExclamationTriangle size={32} className="text-warning mb-2" />
              <h6 className="text-muted mb-2">Tổng số lỗi</h6>
              <h3 className="text-warning">{stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="card-custom h-100">
            <Card.Body className="text-center">
              <FaClock size={32} className="text-danger mb-2" />
              <h6 className="text-muted mb-2">Lỗi gần đây</h6>
              <h3 className="text-danger">{stats.recentErrors}</h3>
              <small className="text-muted">30 ngày qua</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="card-custom h-100">
            <Card.Body className="text-center">
              <FaCheckCircle size={32} className="text-primary mb-2" />
              <h6 className="text-muted mb-2">Cần SRS</h6>
              <h3 className="text-primary">{stats.needsSRS}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="card-custom h-100">
            <Card.Body className="text-center">
              <FaCheckCircle size={32} className="text-success mb-2" />
              <h6 className="text-muted mb-2">Đã hoàn thành</h6>
              <h3 className="text-success">{stats.byStatus["Done"] || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="card-custom">
            <Card.Header>
              <h6 className="mb-0">
                <FaChartPie className="me-2" />
                Phân bố theo loại
              </h6>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "250px" }}>
                <Pie data={partChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="card-custom">
            <Card.Header>
              <h6 className="mb-0">
                <FaChartPie className="me-2" />
                Phân bố theo trạng thái
              </h6>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "250px" }}>
                <Pie data={statusChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card className="card-custom">
            <Card.Header>
              <h6 className="mb-0">📚 Top nguồn lỗi</h6>
            </Card.Header>
            <Card.Body>
              {Object.entries(stats.bySource)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([source, count]) => {
                  const percentage = (count / stats.total) * 100;
                  return (
                    <div key={source} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{source}</span>
                        <Badge bg="secondary">{count}</Badge>
                      </div>
                      <ProgressBar now={percentage} />
                    </div>
                  );
                })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ErrorLogStats;
