import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { StatusDistribution } from '../types/fleet';

interface StatusDistributionChartProps {
  data: StatusDistribution[];
  title?: string;
}

const COLORS = {
  moving: '#60a5fa',    // light blue
  stopped: '#94a3b8',   // slate grey
  parked: '#64748b',    // darker slate grey
  online: '#3b82f6',    // blue
  offline: '#475569',   // dark slate
  idle: '#94a3b8',      // slate grey
};

const getColor = (status: string): string => {
  return COLORS[status as keyof typeof COLORS] || '#6b7280';
};

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data, title }) => {
  const chartData = data.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    percentage: item.percentage,
  }));

  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <div>
      {title && (
        <h3 
          className="text-base font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(data[index].status)} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any, name: any, props: any) => [
              `${value} vehicles (${props.payload.percentage.toFixed(1)}%)`,
              name
            ]}
            contentStyle={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

