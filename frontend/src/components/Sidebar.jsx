// frontend/src/components/Sidebar.jsx

import React from "react";

import {
  FaChartPie,
  FaHeart,
  FaTint,
  FaNotesMedical,
  FaChartLine,
  FaFileMedical,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaCircle,
  FaBrain,
  FaShieldAlt,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = ({
  active,
  onSelect,
  collapsed = false,
  setCollapsed = () => {},
}) => {
  const menuItems = [
    {
      section: "MAIN",

      items: [
        {
          key: "overview",
          label: "Overview",
          icon: <FaChartPie />,
        },
      ],
    },

    {
      section: "PREDICTIONS",

      items: [
        {
          key: "heart",
          label: "Heart Risk",
          icon: <FaHeart />,
        },

        {
          key: "diabetes",
          label: "Diabetes Risk",
          icon: <FaTint />,
        },

        {
          key: "kidney",
          label: "Kidney Risk",
          icon: <FaNotesMedical />,
        },
      ],
    },

    {
      section: "INTELLIGENCE",

      items: [
        {
          key: "analytics",
          label: "Analytics",
          icon: <FaChartLine />,
        },

        {
          key: "reports",
          label: "Reports",
          icon: <FaFileMedical />,
        },
      ],
    },

    {
      section: "SYSTEM",

      items: [
        {
          key: "settings",
          label: "Settings",
          icon: <FaCog />,
        },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-content">
        {/* =====================================
            TOP
        ===================================== */}

        <div className="sidebar-top">
          <button
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* =====================================
            MENU
        ===================================== */}

        <div className="sidebar-menu-wrapper">
          {menuItems.map((group) => (
            <div key={group.section} className="sidebar-group">
              {!collapsed && (
                <p className="sidebar-section-title">{group.section}</p>
              )}

              <ul className="sidebar-menu">
                {group.items.map((item) => (
                  <li
                    key={item.key}
                    className={
                      active === item.key
                        ? "sidebar-item active"
                        : "sidebar-item"
                    }
                    onClick={() => onSelect(item.key)}
                  >
                    <span className="sidebar-icon">{item.icon}</span>

                    {!collapsed && (
                      <>
                        <span className="sidebar-label">{item.label}</span>

                        {active === item.key && (
                          <span className="sidebar-active-dot">
                            <FaCircle />
                          </span>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* =====================================
            BOTTOM CARD
        ===================================== */}

        {!collapsed && (
          <div className="sidebar-bottom-card">
            <div className="sidebar-bottom-glow" />

            <h4>AI Health Recommendations</h4>

            <p>
              Maintain hydration, monitor your vitals, and schedule regular
              health screenings.
            </p>

            <button onClick={() => onSelect("recommendations")}>
              View Recommendations
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
