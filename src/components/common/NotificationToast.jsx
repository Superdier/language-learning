import React, { useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useApp } from '../../contexts/AppContext';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const NotificationToast = () => {
  const { notification, showNotification } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-success me-2" />;
      case 'error':
        return <FaExclamationCircle className="text-danger me-2" />;
      default:
        return <FaInfoCircle className="text-info me-2" />;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      default:
        return 'bg-info';
    }
  };

  if (!notification) return null;

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast 
        onClose={() => showNotification(null)} 
        show={!!notification}
        delay={3000}
        autohide
      >
        <Toast.Header className={`${getBgClass(notification.type)} text-white`}>
          {getIcon(notification.type)}
          <strong className="me-auto">Thông báo</strong>
        </Toast.Header>
        <Toast.Body>{notification.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificationToast;