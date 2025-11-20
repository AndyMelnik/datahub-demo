import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <div 
      className={`modern-card ${hover ? 'hover:shadow-lg' : ''} ${className}`}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </div>
  );
};

