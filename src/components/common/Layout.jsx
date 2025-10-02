import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import NotificationToast from './NotificationToast';
import { useApp } from '../../contexts/AppContext';
import LoadingSpinner from './LoadingSpinner';

const Layout = ({ children }) => {
  const { loading } = useApp();

  return (
    <>
      <Header />
      
      <Container fluid>
        <Row>
          <Col md={2} className="p-0">
            <Sidebar />
          </Col>
          
          <Col md={10} className="py-4">
            {loading ? <LoadingSpinner fullScreen /> : children}
          </Col>
        </Row>
      </Container>
      
      <NotificationToast />
    </>
  );
};

export default Layout;