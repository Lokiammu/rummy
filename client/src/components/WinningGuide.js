import React, { useState } from 'react';
import './WinningGuide.css';

function WinningGuide({ steps, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="winning-guide-overlay" onClick={onClose}>
      <div className="winning-guide" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="guide-header">
          <div className="trophy-icon">🏆</div>
          <h2>Winning Guide</h2>
          <p className="guide-subtitle">Follow these steps to guarantee your win!</p>
        </div>

        <div className="guide-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="guide-content">
          <div className="step-number">STEP {step.step}</div>
          <h3 className="step-action">{step.action}</h3>
          <p className="step-description">{step.description}</p>

          {Array.isArray(step.details) ? (
            <ul className="step-details">
              {step.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          ) : (
            <div className="step-details-text">{step.details}</div>
          )}
        </div>

        <div className="guide-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button className="nav-btn done-btn" onClick={onClose}>
              Got It! 🎯
            </button>
          ) : (
            <button className="nav-btn next-btn" onClick={handleNext}>
              Next →
            </button>
          )}
        </div>

        <div className="step-indicators">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`step-dot ${idx === currentStep ? 'active' : ''} ${
                idx < currentStep ? 'completed' : ''
              }`}
              onClick={() => setCurrentStep(idx)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WinningGuide;
