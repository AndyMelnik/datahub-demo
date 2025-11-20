import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartComponentProps {
  data: any[];
  title: string;
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
  dataKey,
  xAxisKey,
  color = '#3b82f6',
  height = 300,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey} 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            fontSize={12}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

