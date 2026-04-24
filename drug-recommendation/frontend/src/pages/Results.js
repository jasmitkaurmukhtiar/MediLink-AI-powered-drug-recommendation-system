import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const drugs = location.state?.drugs || [];
  const interactions = location.state?.interactions || [];
  const lifestyle = location.state?.lifestyle || [];

  const sectionBox = {
    maxWidth: "900px",
    margin: "30px auto",
    padding: "25px",
    borderRadius: "18px",
    background: "var(--card-bg)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
  };

  const divider = {
    width: "60px",
    height: "3px",
    margin: "10px auto 20px",
    borderRadius: "2px"
  };

  

  return (
    <div className="container fade-in" style={{ maxWidth: "1100px", margin: "0 auto" }}>

      {/* ------------------ MEDICATIONS ------------------ */}
      <div style={sectionBox}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 600 }}>Recommended Medications</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Safely optimized based on your clinical profile.
          </p>
          <div style={{ ...divider, background: "#2563eb" }} />
        </div>

        {drugs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ fontSize: "1.05rem", color: "#64748b" }}>
              No medication recommendations available for this profile.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px"
            }}
          >
            {drugs.map((drug, index) => {
              const confidence = drug.confidence
                ? (drug.confidence * 100).toFixed(1)
                : null;

              return (
                <div
                  key={index}
                  style={{
                    flex: "1 1 220px",
                    maxWidth: "260px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "rgba(37, 99, 235, 0.04)",
                    border: "1px solid rgba(37, 99, 235, 0.2)",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.border = "1px solid #2563eb";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.border = "1px solid rgba(37, 99, 235, 0.2)";
                  }}
                >
                  <h3 style={{ marginBottom: "6px", fontSize: "1rem" }}>
                    {drug.name}
                  </h3>

                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(37, 99, 235, 0.1)",
                      color: "#2563eb",
                      padding: "3px 8px",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "10px"
                    }}
                  >
                    {drug.code}
                  </div>

                  {/* ✅ Mini Progress Bar */}
                  {confidence && (
                    <div>
                      <div
                        style={{
                          height: "6px",
                          width: "100%",
                          background: "rgba(37, 99, 235, 0.15)",
                          borderRadius: "6px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${confidence}%`,
                            height: "100%",
                            background: "#2563eb",
                            borderRadius: "6px",
                            transition: "width 0.4s ease"
                          }}
                        />
                      </div>

                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          marginTop: "6px",
                          textAlign: "right"
                        }}
                      >
                        {confidence}%
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------ DDI SECTION ------------------ */}
      <div style={sectionBox}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 600 }}>Drug Interaction Check</h2>
          <div style={{ ...divider, background: "#ef4444" }} />
        </div>

        {interactions.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            {interactions.map((pair, index) => (
              <div
                key={index}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.3)"
                }}
              >
                <p style={{ margin: 0, fontWeight: 500 }}>
                  {pair.drug1.name} may interact with {pair.drug2.name}
                </p>
                <small style={{ color: "#991b1b" }}>
                  {pair.drug1.code} + {pair.drug2.code}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#059669",
              textAlign: "center",
              fontWeight: 500
            }}
          >
            Safe — No harmful drug interactions detected
          </div>
        )}
      </div>

      {/* ------------------ LIFESTYLE ------------------ */}
      {lifestyle.length > 0 && (
        <div style={{ ...sectionBox, background: "rgba(139, 92, 246, 0.05)" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontWeight: 600 }}>Lifestyle Recommendations</h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
              Preventive care suggestions based on clinical patterns.
            </p>
            <div style={{ ...divider, background: "#8b5cf6" }} />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px"
            }}
          >
            {lifestyle.map((item, index) => (
              <div
                key={index}
                style={{
                  flex: "1 1 240px",
                  maxWidth: "280px",
                  padding: "16px",
                  borderRadius: "14px",
                  background: "rgba(139, 92, 246, 0.08)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  color: "#6d28d9",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;