import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({
  label,
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`submit-button ${className}`}
    >
      {label}
    </button>
  );
};

SubmitButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,   
  disabled: PropTypes.bool,            
  type: PropTypes.string,            
  className: PropTypes.string          
};

export default SubmitButton;
