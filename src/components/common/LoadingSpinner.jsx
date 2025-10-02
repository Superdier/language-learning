import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ fullScreen = false, size = 'lg', message = 'Đang tải...' }) => {
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-white mt-3">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" size={size} />
      {message && <p className="text-muted mt-2">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;