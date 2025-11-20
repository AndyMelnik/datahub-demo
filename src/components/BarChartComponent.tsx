import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from './ui/Card';

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
    <Card className="p-4">
      <h3 
        className="text-base font-semibold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey={xAxisKey} 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            fontSize={12}
            stroke="var(--text-muted)"
          />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip 
            contentStyle={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <Legend />
          <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

