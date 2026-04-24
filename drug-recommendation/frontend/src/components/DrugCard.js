import React from "react";

function DrugCard({ drug }) {
  return (
    <div className="card">
      <h3>{drug.name}</h3>
      <p><b>Dosage:</b> {drug.dosage}</p>
      <p className="warning">⚠ {drug.caution}</p>
    </div>
  );
}

export default DrugCard;
