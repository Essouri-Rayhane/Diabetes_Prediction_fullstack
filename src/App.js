import React, { useState } from 'react';
import "./App.css";

const MedicalTracking = () => {
  // Physiological parameters
  const [pregnancies, setPregnancies] = useState({ current: 0, max: 20 });
  const [age, setAge] = useState({ current: 29.6, max: 100 });
  const [bmi, setBmi] = useState({ current: 20.3, max: 50 });
  const [skinThickness, setSkinThickness] = useState({ current: 25, max: 100 });

  // Biochemical parameters
  const [glucose, setGlucose] = useState({ current: 200, max: 200 });
  const [bloodPressure, setBloodPressure] = useState({ current: 96, max: 150 });
  const [insulin, setInsulin] = useState({ current: 222, max: 900 });
  const [peritonealFunction, setPeritonealFunction] = useState({ current: 0.62, max: 3 });

  // Prediction result
  const [result, setResult] = useState(""); 
//-----------------------------------------------------------------------------------------------------------
// flask connection code -
//-----------------------------------------------------------------------------------------------------------
  const handleAnalyze = async () => {
  const payload = {
    pregnancies: pregnancies.current,
    age: age.current,
    bmi: bmi.current,
    skinThickness: skinThickness.current,
    glucose: glucose.current,
    bloodPressure: bloodPressure.current,
    insulin: insulin.current,
    peritonealFunction: peritonealFunction.current,
  };

  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if(data.error) {
      setResult(`Error: ${data.error}`);
    } else {
      setResult(`Prediction: ${data.prediction === 1 ? "Diabetic" : "Non-diabetic"} 
                  (Probability: ${(data.probability*100).toFixed(2)}%)`);
    }
  } catch (err) {
    setResult(`Error: ${err.message}`);
  }
};


  const SliderComponent = ({ label, value, max, unit = "", onChange }) => (
    <div className="slider-container">
      <label className="slider-label">
        {label}
        <span className="current-value">{value.current}{unit}</span>
      </label>
      <div className="slider-wrapper">
        <input
          type="range"
          min="0"
          max={max}
          value={value.current}
          onChange={(e) => onChange({ ...value, current: parseFloat(e.target.value) })}
          className="slider"
        />
        <div className="slider-limits">
          <span>0</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="medical-tracking">
      <header className="header">
        <h1>Medical Tracking: Diabetes Prediction</h1>
        <p className="subtitle">
          Analyze your diabetes risk based on your health parameters
        </p>
      </header>

      <div className="content">
        {/* Physiological Parameters */}
        <section className="parameters-section">
          <h2>Physiological Parameters</h2>
          <div className="sliders-grid">
            <SliderComponent label="Pregnancies" value={pregnancies} max={pregnancies.max} onChange={setPregnancies} />
            <SliderComponent label="Age (years)" value={age} max={age.max} onChange={setAge} />
            <SliderComponent label="BMI" value={bmi} max={bmi.max} onChange={setBmi} />
            <SliderComponent label="Skin Thickness (mm)" value={skinThickness} max={skinThickness.max} onChange={setSkinThickness} />
          </div>
        </section>

        {/* Biochemical Parameters */}
        <section className="parameters-section">
          <h2>Biochemical Parameters</h2>
          <div className="sliders-grid">
            <SliderComponent label="Glucose (mg/dL)" value={glucose} max={glucose.max} onChange={setGlucose} />
            <SliderComponent label="Blood Pressure (mm Hg)" value={bloodPressure} max={bloodPressure.max} onChange={setBloodPressure} />
            <SliderComponent label="Insulin (mu U/ml)" value={insulin} max={insulin.max} onChange={setInsulin} />
            <SliderComponent label="Peritoneal Function (DPF)" value={peritonealFunction} max={peritonealFunction.max} onChange={setPeritonealFunction} />
          </div>
        </section>

        <div className="separator"></div>

        {/* Analyze Button */}
        <div className="analysis-section">
          <button className="analyze-button" onClick={handleAnalyze}>
            Analyze My Results
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="result-display">
            <h3>Prediction Result:</h3>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalTracking;
