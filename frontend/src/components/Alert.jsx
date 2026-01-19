import React from 'react';
import '../styles/alert.css';

export const Alert = ({ type, message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert alert-${type}`}>
      {message}
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};
