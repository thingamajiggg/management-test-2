import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className={`input ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;