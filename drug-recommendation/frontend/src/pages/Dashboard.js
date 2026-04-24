import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    kpis: { total_patients: 0, total_visits: 0, avg_severity_score: 0, total_ddi_rules: 0 },
    demographics: [],
    medications: [],
    procedures: [],
    ddi_risks: [],
    trends: []
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(err => console.error("Error fetching dashboard stats:", err));
  }, []);

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  const BAR_COLORS = ['#0ea5e9', '#06b6d4', '#0284c7', '#38bdf8'];

  const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    color: '#0f172a',
    padding: '12px 16px',
    fontWeight: '500'
  };

  return (
    <div className="container fade-in">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 className="page-title">Analytics Dashboard</h2>
        <p className="page-subtitle">Interactive overview of patient demographics, engagement, and risk factors.</p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px', width: '100%', maxWidth: '1100px' }}>
        <div className="card" style={{ flex: '1', minWidth: '220px', padding: '24px', textAlign: 'left' }}>
          <h4 style={{ margin: 0, opacity: 0.7, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Patients</h4>
          <h2 style={{ margin: '8px 0 12px', fontSize: '36px', fontWeight: 800 }}>{stats.kpis.total_patients}</h2>
          <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: '20px' }}>Clinical Index</span>
        </div>
        <div className="card" style={{ flex: '1', minWidth: '220px', padding: '24px', textAlign: 'left' }}>
          <h4 style={{ margin: 0, opacity: 0.7, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Severity Score</h4>
          <h2 style={{ margin: '8px 0 12px', fontSize: '36px', fontWeight: 800 }}>{stats.kpis.avg_severity_score}</h2>
          <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', padding: '6px 10px', borderRadius: '20px' }}>Patient Risk Metric</span>
        </div>
        <div className="card" style={{ flex: '1', minWidth: '220px', padding: '24px', textAlign: 'left' }}>
          <h4 style={{ margin: 0, opacity: 0.7, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Active DDI Rules</h4>
          <h2 style={{ margin: '8px 0 12px', fontSize: '36px', fontWeight: 800 }}>{stats.kpis.total_ddi_rules}</h2>
          <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 700, background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '20px' }}>Interaction Matrix Limits</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px', width: '100%', maxWidth: '1100px' }}>

        {/* Prevalent Conditions (Bar Chart) */}
        <div className="card" style={{ padding: '32px 24px', width: '100%', maxWidth: '100%' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.25rem', textAlign: 'left', fontWeight: '700' }}>Prevalent Diagnoses</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.demographics} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(100, 116, 139, 0.15)" />
              <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="disease" type="category" width={150} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }} contentStyle={customTooltipStyle} itemStyle={{ color: '#0ea5e9' }} />
              <Bar dataKey="cases" name="Instances" radius={[0, 6, 6, 0]} animationDuration={1500} barSize={25}>
                {stats.demographics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Common Medications (Donut Chart) */}
        <div className="card" style={{ padding: '32px 24px', width: '100%', maxWidth: '100%' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.25rem', textAlign: 'left', fontWeight: '700' }}>Dominant Medications</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#0f172a' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', opacity: 0.8 }} />
              <Pie
                data={stats.medications}
                cx="50%"
                cy="45%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                stroke="none"
                animationDuration={1500}
              >
                {stats.medications.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* DDI Insights (Cards View + Graph) */}
        <div className="card" style={{ gridColumn: '1 / -1', padding: '32px 24px', width: '100%', maxWidth: '100%', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.25rem', fontWeight: '700' }}>DDI Risk Matrix Graph</h3>
          <p style={{ color: 'inherit', opacity: 0.7, fontSize: '14px', marginBottom: '32px', maxWidth: '800px' }}>
            A visualization of the high-risk drug interaction network. The radar graph maps the highest volumetric risk intersections found within the AI's internal adjacency matrix.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
            {/* Visual Spider Graph */}
            <div style={{ flex: '1', minWidth: '300px', background: 'rgba(248, 250, 252, 0.5)', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '16px' }}>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart outerRadius="75%" data={stats.ddi_risks}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
                  <Radar name="Matrix Links" dataKey="interactions" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Existing Cards Section */}
            <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.ddi_risks.map((drug, idx) => (
                <div key={idx} style={{ background: 'var(--card-hover, rgba(245, 158, 11, 0.05))', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} className="hover-lift">
                  <span style={{ fontSize: '0.95rem', color: 'inherit', fontWeight: 500, flex: 1, marginRight: '16px', lineHeight: '1.4' }}>{drug.name}</span>
                  <span style={{ background: '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{drug.interactions} Risk Links</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Procedures (List) */}
        <div className="card" style={{ gridColumn: '1 / -1', padding: '32px 24px', width: '100%', maxWidth: '100%', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.25rem', fontWeight: '700' }}>Most Requested Procedures</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.procedures.map((proc, idx) => (
              <div key={idx} style={{ background: 'var(--card-hover, rgba(14, 165, 233, 0.05))', border: '1px solid rgba(14, 165, 233, 0.1)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: 'inherit', fontWeight: 500, flex: 1, marginRight: '16px', lineHeight: '1.4' }}>{proc.procedure}</span>
                <span style={{ color: '#0ea5e9', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{proc.count} instances</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Trends (Line Chart) */}
        <div className="card" style={{ gridColumn: '1 / -1', padding: '32px 24px', width: '100%', maxWidth: '100%' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.25rem', textAlign: 'left', fontWeight: '700' }}>Visit Lifetime Distribution</h3>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={stats.trends} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.15)" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#0ea5e9' }} />
              <Line
                type="monotone"
                dataKey="patients"
                name="Volume"
                stroke="#0ea5e9"
                strokeWidth={4}
                dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 5, fill: '#ffffff' }}
                activeDot={{ r: 7, stroke: '#0284c7', strokeWidth: 0, fill: '#0ea5e9' }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;