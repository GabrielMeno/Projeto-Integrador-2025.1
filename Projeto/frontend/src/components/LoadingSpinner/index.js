import React from 'react';
import './styles.css';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-backdrop">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;