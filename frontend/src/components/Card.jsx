import React from 'react';
import '../styles/card.css';

export const Card = ({ children, className = '' }) => {
  return <div className={`card ${className}`}>{children}</div>;
};
