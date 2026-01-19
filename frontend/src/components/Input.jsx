import React from 'react';
import '../styles/input.css';

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={`input ${error ? 'error' : ''}`} {...props} />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
