import React from 'react';
import { Card } from './ui/Card';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  format?: 'number' | 'percentage' | 'decimal';
}

const colorStyles = {
  blue: {
    bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    text: '#1e40af',
    icon: '#3b82f6',
  },
  green: {
    bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    text: '#065f46',
    icon: '#10b981',
  },
  red: {
    bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    text: '#991b1b',
    icon: '#ef4444',
  },
  yellow: {
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    text: '#92400e',
    icon: '#f59e0b',
  },
  purple: {
    bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    text: '#5b21b6',
    icon: '#8b5cf6',
  },
  gray: {
    bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    text: '#1e293b',
    icon: '#64748b',
  },
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  format = 'number',
}) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'decimal':
        return val.toFixed(1);
      default:
        return val.toLocaleString();
    }
  };

  const styles = colorStyles[color];

  return (
    <Card className="p-4 overflow-hidden relative">
      <div 
        className="absolute inset-0 opacity-30"
        style={{ background: styles.bg }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p 
            className="text-xs font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </p>
          <p 
            className="text-2xl font-bold mb-1"
            style={{ color: styles.text }}
          >
            {formatValue(value)}
          </p>
          {subtitle && (
            <p 
              className="text-xs mt-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div 
            className="ml-3 p-2 rounded-lg bg-white/50"
            style={{ color: styles.icon }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

