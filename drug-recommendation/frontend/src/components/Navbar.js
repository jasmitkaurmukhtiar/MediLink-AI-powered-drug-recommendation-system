import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`navbar ${theme}`}>
      <h2>💊 MediLink</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/visit">Get Recommendation</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/research">Research</Link>


        {/* Slider Toggle */}
        <div className="theme-switch" title="Toggle Light/Dark Mode">
          <input
            type="checkbox"
            id="toggle"
            onChange={toggleTheme}
            checked={theme === "dark"}
          />
          <label htmlFor="toggle" className="toggle-label">
            <span className="icon sun">☀️</span>
            <span className="icon moon">🌙</span>
            <div className="toggle-ball"></div>
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
