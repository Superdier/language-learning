import React, { useState } from "react";
import { Navbar, Container, Nav, Badge, Dropdown } from "react-bootstrap";
import {
  FaUserCircle,
  FaBell,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaCloud,
} from "react-icons/fa";
import { useApp } from "../../contexts/AppContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { logout } from "../../services/authService";
import { fullSyncToCloud } from "../../services/cloudSyncService";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const {
    reviewHistory,
    grammarItems,
    vocabularyItems,
    kanjiItems,
    contrastCards,
    errorLog,
    savedSentences,
    savedDiaries,
    showNotification,
  } = useApp();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  // Calculate today's review count
  const todayReviews = reviewHistory.filter((record) => {
    const today = new Date().toDateString();
    const recordDate = new Date(record.date).toDateString();
    return today === recordDate && record.correct;
  }).length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
      showNotification("Đã đăng xuất", "success");
    } catch (error) {
      showNotification("Lỗi khi đăng xuất", "error");
    }
  };

  const handleSyncToCloud = async () => {
    if (!user?.uid) return;

    setSyncing(true);
    try {
      await fullSyncToCloud(user.uid, {
        grammarItems,
        vocabularyItems,
        kanjiItems,
        contrastCards,
        reviewHistory,
        errorLog,
        savedSentences,
        savedDiaries,
      });
      showNotification("Đồng bộ thành công!", "success");
    } catch (error) {
      showNotification("Lỗi khi đồng bộ: " + error.message, "error");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold">
          🇯🇵 Japanese Learning
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Sync to Cloud */}
            <Nav.Link
              onClick={handleSyncToCloud}
              disabled={syncing}
              className="me-3"
            >
              <FaCloud
                size={20}
                className={syncing ? "spinner-border spinner-border-sm" : ""}
              />
            </Nav.Link>

            {/* Dark Mode Toggle */}
            <Nav.Link onClick={toggleDarkMode} className="me-3">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </Nav.Link>

            {/* Notification */}
            <Nav.Link className="position-relative me-3">
              <FaBell size={20} />
              {todayReviews > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: "0.7rem" }}
                >
                  {todayReviews}
                </Badge>
              )}
            </Nav.Link>

            {/* User Menu */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="text-white text-decoration-none"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="rounded-circle"
                    style={{ width: "32px", height: "32px" }}
                  />
                ) : (
                  <FaUserCircle size={24} />
                )}
                <span className="ms-2 d-none d-md-inline">
                  {user?.displayName || "User"}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  <small className="text-muted">{user?.email}</small>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSyncToCloud} disabled={syncing}>
                  <FaCloud className="me-2" />
                  {syncing ? "Đang đồng bộ..." : "Đồng bộ dữ liệu"}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
