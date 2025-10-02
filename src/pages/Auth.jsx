import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container>
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Col md={6} lg={5}>
          <Card className="card-custom shadow-lg">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>🇯🇵 Japanese Learning</h2>
                <p className="text-muted">Học tiếng Nhật cá nhân hóa với SRS</p>
              </div>

              {isLogin ? (
                <LoginForm onToggleMode={() => setIsLogin(false)} />
              ) : (
                <SignupForm onToggleMode={() => setIsLogin(true)} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;
