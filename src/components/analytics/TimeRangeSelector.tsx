import React from 'react';
import type { TimeRange } from '../../types/analytics';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '12m', label: '12 Months' },
];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span 
        className="text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        Period:
      </span>
      <div className="flex items-center gap-1">
        {TIME_RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all border ${
              value === option.value
                ? 'shadow-sm border-transparent'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={value === option.value 
              ? { background: '#60a5fa', color: 'white' }
              : { background: 'var(--surface-1)', color: 'var(--text-secondary)' }
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

