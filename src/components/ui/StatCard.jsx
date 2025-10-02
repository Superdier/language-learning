import React from 'react';
import { Card } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend = null,
  trendValue = null,
  subtitle = null 
}) => {
  return (
    <Card className="card-custom h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 className="text-muted mb-2 text-uppercase" style={{ fontSize: '0.85rem' }}>
              {title}
            </h6>
            <h2 className="mb-1 fw-bold">{value}</h2>
            
            {subtitle && (
              <small className="text-muted">{subtitle}</small>
            )}
            
            {trend && trendValue && (
              <div className="mt-2">
                <span className={`badge bg-${trend === 'up' ? 'success' : 'danger'} bg-opacity-10 text-${trend === 'up' ? 'success' : 'danger'}`}>
                  {trend === 'up' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                  <span className="ms-1">{trendValue}</span>
                </span>
              </div>
            )}
          </div>
          
          <div className={`text-${color} ms-3`} style={{ fontSize: '2.5rem', opacity: 0.3 }}>
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;