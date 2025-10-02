import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>
              <FaExclamationTriangle className="me-2" />
              Oops! Có lỗi xảy ra
            </Alert.Heading>
            <p>
              Ứng dụng gặp lỗi không mong muốn. Vui lòng thử tải lại trang.
            </p>
            <hr />
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-3">
                <summary>Chi tiết lỗi (chỉ hiển thị trong development)</summary>
                <pre className="mt-2" style={{ fontSize: '0.8rem' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <Button variant="primary" onClick={this.handleReset}>
              Tải lại trang
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;