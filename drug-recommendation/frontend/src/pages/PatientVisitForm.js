import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function PatientVisitForm() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    diagnoses: [],
    procedures: [],
    medications: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectColorStyles = {
    input: (base) => ({ ...base, color: "inherit" }),
    singleValue: (base) => ({ ...base, color: "inherit" }),
  };

  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [procedureOptions, setProcedureOptions] = useState([]);
  const [medOptions, setMedOptions] = useState([]);

  // Fetch codes from backend
  useEffect(() => {

    fetch("http://127.0.0.1:8000/codes")
      .then(res => res.json())
      .then(data => {

        // Backend already returns {value,label}
        setDiagnosisOptions(data.diagnoses);
        setProcedureOptions(data.procedures);
        setMedOptions(data.medications);

      });

  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      diagnoses: form.diagnoses ? form.diagnoses.map(i => i.value) : [],
      procedures: form.procedures ? form.procedures.map(i => i.value) : [],
      medications: form.medications ? form.medications.map(i => i.value) : []
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      navigate("/results", {
        state: { drugs: data.drugs, interactions: data.interactions, lifestyle: data.lifestyle }
      });
    } catch (error) {
      console.error("Prediction error:", error);
      setIsSubmitting(false);
    }
  };

  return (

    <div className="container fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="page-title" style={{ fontSize: '2.4rem', fontWeight: 800 }}>Clinical Input Form</h2>
        <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Enter the patient's current diagnostic state, intervention history, and active pharmacology to generate real-time AI safety pathways.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        
        {/* Diagnosis Zone */}
        <div className="card hover-lift" style={{ padding: '24px 32px', position: 'relative', zIndex: 30, borderLeft: '5px solid #0ea5e9', textAlign: 'left', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', width: '100%' }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🩺</span> Primary Diagnoses
            </h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Search and select mapped ICD diagnostic markers.</p>
          </div>
          <div style={{ flex: '2', minWidth: '350px' }}>
            <Select
              options={diagnosisOptions}
              className="dropdown"
              classNamePrefix="select"
              isMulti
              isSearchable
              value={form.diagnoses}
              onChange={(selected) => setForm({ ...form, diagnoses: selected || [] })}
              placeholder="Browse diagnosis codes..."
              styles={selectColorStyles}
            />
          </div>
        </div>

        {/* Procedures Zone */}
        <div className="card hover-lift" style={{ padding: '24px 32px', position: 'relative', zIndex: 20, borderLeft: '5px solid #10b981', textAlign: 'left', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', width: '100%' }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>⚕️</span> Clinical Procedures
            </h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Log recent or upcoming clinical interventions.</p>
          </div>
          <div style={{ flex: '2', minWidth: '350px' }}>
            <Select
              options={procedureOptions}
              className="dropdown"
              classNamePrefix="select"
              isMulti
              isSearchable
              value={form.procedures}
              onChange={(selected) => setForm({ ...form, procedures: selected || [] })}
              placeholder="Browse procedure history..."
              styles={selectColorStyles}
            />
          </div>
        </div>

        {/* Medications Zone */}
        <div className="card hover-lift" style={{ padding: '24px 32px', position: 'relative', zIndex: 10, borderLeft: '5px solid #f59e0b', textAlign: 'left', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px', width: '100%' }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>💊</span> Active Medications
            </h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Current prescriptions for AI safety scanning.</p>
          </div>
          <div style={{ flex: '2', minWidth: '350px' }}>
            <Select
              options={medOptions}
              className="dropdown"
              classNamePrefix="select"
              isMulti
              isSearchable
              value={form.medications}
              onChange={(selected) => setForm({ ...form, medications: selected || [] })}
              placeholder="Browse current pharmacotherapy..."
              styles={selectColorStyles}
            />
          </div>
        </div>

        {/* Action Zone */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting || (form.diagnoses.length === 0 && form.procedures.length === 0 && form.medications.length === 0)} 
            className="primary-btn" 
            style={{ 
              padding: '16px 48px', 
              fontSize: '1.15rem', 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
              boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
              transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
              opacity: (isSubmitting || (form.diagnoses.length === 0 && form.procedures.length === 0 && form.medications.length === 0)) ? 0.6 : 1,
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            {isSubmitting ? 'Processing Network Matrix...' : 'Generate AI Blueprint'}
          </button>
        </div>

      </div>
    </div>

  );
}

export default PatientVisitForm;