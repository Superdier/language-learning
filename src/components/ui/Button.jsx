import React from 'react';
import { Button as BSButton, Spinner } from 'react-bootstrap';

const Button = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  icon = null,
  ...props 
}) => {
  return (
    <BSButton 
      variant={variant} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          Đang xử lý...
        </>
      ) : (
        <>
          {icon && <span className="me-2">{icon}</span>}
          {children}
        </>
      )}
    </BSButton>
  );
};

export default Button;