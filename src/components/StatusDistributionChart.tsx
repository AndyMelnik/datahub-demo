import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { StatusDistribution } from '../types/fleet';

interface StatusDistributionChartProps {
  data: StatusDistribution[];
  title: string;
}

const COLORS = {
  moving: '#10b981',
  stopped: '#f59e0b',
  parked: '#6b7280',
  online: '#3b82f6',
  offline: '#ef4444',
  idle: '#f59e0b',
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
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
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
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(data[index].status)} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any, name: any, props: any) => [
              `${value} vehicles (${props.payload.percentage.toFixed(1)}%)`,
              name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

