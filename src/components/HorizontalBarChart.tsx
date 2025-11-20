import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from './ui/Card';

interface HorizontalBarChartProps {
  data: any[];
  title: string;
  dataKeys: string[];
  yAxisKey: string;
  colors?: string[];
  height?: number;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  title,
  dataKeys,
  yAxisKey,
  colors = ['#3b82f6', '#10b981', '#f59e0b'],
  height = 400,
}) => {
  return (
    <Card className="p-6">
      <h3 
        className="text-lg font-semibold mb-6"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" stroke="var(--text-muted)" />
          <YAxis 
            type="category" 
            dataKey={yAxisKey}
            width={90}
            fontSize={12}
            stroke="var(--text-muted)"
          />
          <Tooltip 
            contentStyle={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={colors[index % colors.length]}
              stackId="a"
              radius={[0, 4, 4, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

