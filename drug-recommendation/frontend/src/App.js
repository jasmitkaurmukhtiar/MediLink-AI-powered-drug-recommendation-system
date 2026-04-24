import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import PatientVisitForm from "./pages/PatientVisitForm";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import DrugResearchHighlights from "./pages/DrugResearchHighlights";



function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visit" element={<PatientVisitForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/research" element={<DrugResearchHighlights />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
