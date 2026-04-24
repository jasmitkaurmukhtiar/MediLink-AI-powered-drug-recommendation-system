import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="hero-content">
        <span className="badge">AI-Powered Healthcare</span>
        <h1>Smart <span className="accent-text">Drug Recommendation</span> System</h1>
        <p>
          Leverage advanced machine learning to get accurate, safe, and personalized drug suggestions based on symptoms, age, and previous health data.
        </p>

        <div className="hero-buttons">
          <Link to="/visit">
            <button className="primary-btn">Get Recommendation CTA</button>
          </Link>
          <Link to="/research" className="secondary-link">
            View Latest Research &rarr;
          </Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>⚡ AI-Driven Intelligence</h3>
          <p>Analyzing complex health data utilizing state-of-the-art predictive algorithms.</p>
        </div>
        <div className="feature-card">
          <h3>🛡️ Safety First Interactions</h3>
          <p>Real-time cross-checking for severe drug-drug interactions and adverse risks.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Clinical Analytics</h3>
          <p>Rich visualization dashboards breaking down patient demographics and outcomes.</p>
        </div>
      </div>

    </motion.div>
  );
}

export default Home;
