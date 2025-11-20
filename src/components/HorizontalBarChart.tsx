import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface HorizontalBarChartProps {
  data: any[];
  title?: string;
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
  colors = ['#60a5fa', '#94a3b8', '#64748b'],
  height = 260,
}) => {
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
    </div>
  );
};

