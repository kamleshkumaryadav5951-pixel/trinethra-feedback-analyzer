import { useState } from "react";
import "./index.css";

function App() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    if (!transcript.trim()) {
      setError("Please paste a transcript first.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResult(null);
    
    try {
      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the backend or Ollama is not running.");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult(data.result);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    setTranscript("He helps me with production tracking. Every evening he updates it and sends it to me on WhatsApp. He doesn't really push back. If I tell him to do something, he does it.");
  };

  return (
    <div className="app-container">
      <header className="glass-header">
        <h1>Trinethra <span>Feedback Analyzer</span></h1>
        <p>AI-assisted transcript analysis for Fellow evaluation</p>
      </header>

      <main className="main-content">
        <div className="input-section glass-panel">
          <div className="input-header">
            <h2>Supervisor Transcript</h2>
            <button className="btn-secondary" onClick={loadSample}>Load Sample</button>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste the 10-15 minute supervisor transcript here..."
            className="transcript-input"
          />
          <div className="actions">
            <button 
              className={`btn-primary ${isLoading ? 'loading' : ''}`} 
              onClick={runAnalysis}
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="spinner"></span> Processing with Ollama...</>
              ) : (
                "Run Analysis"
              )}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        {result && (
          <div className="results-section">
            <div className="score-kpi-row">
              <div className="score-card glass-panel">
                <h3>Rubric Score</h3>
                <div className="score-circle">
                  <span>{result.score?.value || "?"}</span>/10
                </div>
                <h4 style={{ margin: "0 0 10px 0", color: "#f8fafc" }}>{result.score?.label}</h4>
                <div className="tag-badge" style={{ marginBottom: "15px", background: "rgba(255,255,255,0.1)" }}>
                  Band: {result.score?.band} | Confidence: {result.score?.confidence}
                </div>
                <p className="justification">{result.score?.justification}</p>
              </div>

              <div className="kpi-card glass-panel">
                <h3>Mapped KPIs</h3>
                <ul className="kpi-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.kpiMapping?.map((item, idx) => (
                    <li key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <strong style={{ color: '#c4b5fd' }}>{item.kpi}</strong>
                        <span className="tag-badge" style={{ background: item.systemOrPersonal === 'system' ? '#10b981' : '#3b82f6', color: '#fff' }}>
                          {item.systemOrPersonal}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9em', color: '#e2e8f0' }}>{item.evidence}</div>
                    </li>
                  ))}
                  {(!result.kpiMapping || result.kpiMapping.length === 0) && <li style={{ color: '#94a3b8' }}>No KPIs mapped.</li>}
                </ul>
                
                <h3 className="mt-4">Gap Analysis</h3>
                <ul className="gap-list">
                  {result.gaps?.map((gap, idx) => (
                    <li key={idx}>
                      <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '4px' }}>{gap.dimension.replace('_', ' ').toUpperCase()}</strong>
                      {gap.detail}
                    </li>
                  ))}
                  {(!result.gaps || result.gaps.length === 0) && <li style={{ color: '#94a3b8' }}>No gaps identified.</li>}
                </ul>
              </div>
            </div>

            <div className="evidence-card glass-panel">
              <h3>Extracted Evidence</h3>
              <div className="evidence-grid">
                {result.evidence?.map((item, idx) => (
                  <div key={idx} className={`evidence-item ${item.signal?.toLowerCase()}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="tag-badge">{item.signal}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{item.dimension?.replace('_', ' ')}</span>
                    </div>
                    <blockquote>"{item.quote}"</blockquote>
                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '5px' }}>
                      <strong>Interpretation:</strong> {item.interpretation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="questions-card glass-panel">
              <h3>Suggested Follow-up Questions</h3>
              <p className="subtitle">Ask the supervisor these questions in the next call to address gaps:</p>
              <ul className="questions-list">
                {result.followUpQuestions?.map((q, idx) => (
                  <li key={idx}>
                    <span className="q-icon">?</span>
                    <div>
                      <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '6px' }}>{q.question}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        <span style={{ color: '#a78bfa' }}>Target Gap:</span> {q.targetGap?.replace('_', ' ')} <br/>
                        <span style={{ color: '#a78bfa' }}>Looking For:</span> {q.lookingFor}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;