import React, { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { signIn, signInWithGoogle } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("Email không tồn tại");
          break;
        case "auth/wrong-password":
          setError("Mật khẩu không đúng");
          break;
        case "auth/invalid-email":
          setError("Email không hợp lệ");
          break;
        default:
          setError("Đăng nhập thất bại. Vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setError("Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Đăng nhập</h3>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mb-3"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </Form>

      <div className="text-center mb-3">
        <span className="text-muted">hoặc</span>
      </div>

      <Button
        variant="outline-danger"
        className="w-100 mb-3"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <FaGoogle className="me-2" />
        Đăng nhập với Google
      </Button>

      <div className="text-center">
        <small>
          Chưa có tài khoản?{" "}
          <Button
            variant="link"
            size="sm"
            onClick={onToggleMode}
            className="p-0"
          >
            Đăng ký ngay
          </Button>
        </small>
      </div>
    </div>
  );
};

export default LoginForm;
