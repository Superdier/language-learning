import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ 
  icon = <FaInbox size={64} />, 
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu nào được tìm thấy',
  actionText = null,
  onAction = null
}) => {
  return (
    <Card className="card-custom">
      <Card.Body className="text-center py-5">
        <div className="text-muted mb-3" style={{ opacity: 0.5 }}>
          {icon}
        </div>
        <h5 className="mb-2">{title}</h5>
        <p className="text-muted mb-3">{description}</p>
        {actionText && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;