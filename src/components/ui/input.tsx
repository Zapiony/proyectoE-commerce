import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    labelClassName?: string;
}

const Input = ({ label, className = '', labelClassName = 'text-white', ...props }: InputProps) => {
    return (
        <div className="text-start">
            <label className={`form-label fw-bold small mb-1 ${labelClassName}`}>
                {label}
            </label>
            <input
                className={`form-control ${className}`}
                style={{
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                }}
                {...props}
            />
        </div>
    );
};

export default Input;
