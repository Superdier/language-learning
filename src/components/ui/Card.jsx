import React from 'react';
import { Card as BSCard } from 'react-bootstrap';

const Card = ({ 
  title, 
  children, 
  footer = null, 
  icon = null,
  variant = 'light',
  className = '',
  ...props 
}) => {
  return (
    <BSCard className={`card-custom ${className}`} {...props}>
      {(title || icon) && (
        <BSCard.Header className={`bg-${variant} d-flex align-items-center`}>
          {icon && <span className="me-2">{icon}</span>}
          <strong>{title}</strong>
        </BSCard.Header>
      )}
      
      <BSCard.Body>
        {children}
      </BSCard.Body>
      
      {footer && (
        <BSCard.Footer className="bg-light text-muted">
          {footer}
        </BSCard.Footer>
      )}
    </BSCard>
  );
};

export default Card;