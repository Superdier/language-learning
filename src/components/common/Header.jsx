import React from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useApp } from "../../contexts/AppContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const Header = () => {
  const { user, reviewHistory } = useApp();
  const { darkMode, toggleDarkMode } = useTheme();

  // Calculate today's review count
  const todayReviews = reviewHistory.filter((record) => {
    const today = new Date().toDateString();
    const recordDate = new Date(record.date).toDateString();
    return today === recordDate && record.correct;
  }).length;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold">
          🇯🇵 Japanese Learning
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Dark Mode Toggle */}
            <Nav.Link onClick={toggleDarkMode} className="me-3">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </Nav.Link>
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

            <Nav.Link className="d-flex align-items-center">
              <FaUserCircle size={24} className="me-2" />
              <span>{user?.name || "Guest"}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
