import React, { useEffect, useState } from "react";

function DrugResearchHighlights() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "2098c2c10619041229e2e81d31004383";

  useEffect(() => {
    fetch(
      `https://gnews.io/api/v4/search?q=hypertension OR diabetes drug&lang=en&max=10&token=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container fade-in">
      <div style={{ textAlign: 'center' }}>
        <h2 className="page-title">📚 Drug Research Highlights</h2>
        <p className="page-subtitle">Latest breaking news and articles on health and medication research.</p>
      </div>

      {loading && <p style={{ animation: 'pulse 1.5s infinite ease-in-out', color: '#1976d2' }}>Loading latest research...</p>}

      <div className="research-grid">
        {news.map((item, index) => (
          <div className="research-card" key={index}>
            <h3>{item.title}</h3>
            <p><strong>Source:</strong> {item.source.name}</p>
            <p><strong>Date:</strong> {new Date(item.publishedAt).toLocaleDateString()}</p>
            <p>{item.description}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Read Full Article →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DrugResearchHighlights;
