import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaLanguage,
  FaCheckCircle,
  FaPencilAlt,
  FaBookOpen,
  FaDatabase,
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { path: "/", icon: <FaHome />, label: "Dashboard", exact: true },
    { path: "/grammar", icon: <FaBook />, label: "Ngữ pháp" },
    { path: "/vocabulary", icon: <FaLanguage />, label: "Từ vựng" },
    { path: "/practice", icon: <FaCheckCircle />, label: "Ôn tập" },
    { path: "/writing", icon: <FaPencilAlt />, label: "Đặt câu" },
    { path: "/diary", icon: <FaBookOpen />, label: "Nhật ký" },
    { path: "/data", icon: <FaDatabase />, label: "Dữ liệu" },
  ];

  return (
    <div className="sidebar">
      <Nav className="flex-column p-3">
        <div className="text-center mb-4 py-3 border-bottom border-secondary">
          <h5 className="text-white mb-0">Menu</h5>
        </div>

        {menuItems.map((item, index) => (
          <Nav.Link
            key={index}
            as={NavLink}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}

        <div className="mt-auto pt-4 border-top border-secondary">
          <small className="text-muted d-block text-center">
            Version 1.0.0
          </small>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;
