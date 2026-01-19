import React from 'react';
import '../styles/button.css';

export const Button = ({ variant = 'primary', fullWidth = false, loading = false, disabled, children, ...props }) => {
  return (
    <button
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
