import { useState } from "react";
import { getPrediction } from "../utils/openai";
import "../App.css";

// RiskIndicator component remains unchanged
const RiskIndicator = ({ riskLevel }) => {
  const getColor = () => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "#00cc00";
      case "moderate":
        return "#ff9900";
      case "high":
        return "#ff0000";
      default:
        return "#808080";
    }
  };

  return (
    <svg width="50" height="50" style={{ marginLeft: "10px" }}>
      <circle cx="25" cy="25" r="20" fill={getColor()} />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fill="white"
        fontSize="14"
      >
        {riskLevel.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
};

// InputField, SelectBox, CustomCheckbox, and CustomButton remain unchanged
const InputField = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="input-container">
      <label className="label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

const SelectBox = ({ label, options, value, onChange, setOptions }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    if (value && !options.includes(value)) {
      setOptions((prevOptions) => [...prevOptions, value]);
    }
  };

  return (
    <div className="select-container">
      <label className="label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        list="category-options"
        placeholder="Select or type a category"
        className="select-field"
      />
      <datalist id="category-options">
        {options.map((opt, idx) => (
          <option key={idx} value={opt} />
        ))}
      </datalist>
    </div>
  );
};

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        id="check-medication"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="checkbox-input"
      />
      <label htmlFor="check-medication" className="checkbox-label">
        {label}
      </label>
    </div>
  );
};

const CustomButton = ({ text, onClick }) => {
  return (
    <button className="btn" onClick={onClick}>
      {text}
    </button>
  );
};

const Home = () => {
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [probDescrip, setProbDescrip] = useState(""); // New state for problem description
  const [checkMedication, setCheckMedication] = useState(false);
  const [medication, setMedication] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handlePrediction = async () => {
    const result = await getPrediction(
      age,
      category,
      probDescrip, // Added problem description parameter
      checkMedication ? medication : null
    );
    // Handle both string and object responses from getPrediction
    setPrediction({
      description:
        typeof result === "string"
          ? result
          : result.description || "No prediction available",
      confidence: result.confidence || 0.85,
      riskLevel: result.riskLevel || "moderate",
    });
  };

  return (
    <div className={`container ${prediction ? "split" : ""}`}>
      <div className="home-container">
        <h2 className="heading">Health Prediction</h2>
        <InputField
          label="Age *"
          value={age}
          onChange={setAge}
          placeholder="Enter your age"
        />
        <SelectBox
          label="Category"
          options={[
            "Loneliness",
            "Mild Stress",
            "Fatigue",
            "Anxiety",
            "Depression",
            "Stress",
            "PTSD",
            "Heart",
            "Cardiovascular",
            "Hypertension",
            "Diabetes",
            "Blood Sugar",
            "Insulin Resistance",
            "Obesity",
            "High Cholesterol",
            "Migraine",
            "Headache"
          ]}
          
          value={category}
          onChange={setCategory}
        />
        <InputField
          label="Problem Description *"
          value={probDescrip}
          onChange={setProbDescrip}
          placeholder="Describe your symptoms (e.g., sharp pain in lower back)"
        />
        <CustomCheckbox
          label="Do you want to check medication effect?"
          checked={checkMedication}
          onChange={setCheckMedication}
        />
        {checkMedication && (
          <InputField
            label="Medication (e.g., Paracetamol)"
            value={medication}
            onChange={setMedication}
            placeholder="Enter medication name"
          />
        )}
        <CustomButton text="Get Prediction" onClick={handlePrediction} />
      </div>
      {prediction && (
        <div className="prediction-container">
          <h3>Prediction Results:</h3>
          <p className="prediction-text">
            <strong>Description:</strong> {prediction.description}
          </p>
          <p className="prediction-text">
            <strong>Confidence:</strong>{" "}
            {(prediction.confidence * 100).toFixed(1)}%
          </p>
          <div className="risk-display">
            <strong>Risk Level:</strong>
            <span style={{ marginLeft: "5px" }}>{prediction.riskLevel}</span>
            <RiskIndicator riskLevel={prediction.riskLevel} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
