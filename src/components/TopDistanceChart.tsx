import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FleetVehicle } from '../types/fleet';

interface TopDistanceChartProps {
  vehicles: FleetVehicle[];
  title?: string;
}

const COLORS = ['#60a5fa', '#93c5fd', '#bfdbfe', '#94a3b8', '#64748b'];

export const TopDistanceChart: React.FC<TopDistanceChartProps> = ({ 
  vehicles, 
  title 
}) => {
  // Sort by odometer and get top 5
  const topVehicles = [...vehicles]
    .filter(v => v.odometer && v.odometer > 0)
    .sort((a, b) => (b.odometer || 0) - (a.odometer || 0))
    .slice(0, 5)
    .map(v => ({
      name: v.object_label || v.object_id || 'Unknown',
      distance: Math.round(v.odometer || 0),
      driver: `${v.first_name || ''} ${v.last_name || ''}`.trim() || 'N/A',
    }));

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
      {topVehicles.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart 
            data={topVehicles} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              type="number" 
              stroke="var(--text-muted)"
              label={{ value: 'Distance (km)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="category" 
              dataKey="name"
              width={110}
              fontSize={12}
              stroke="var(--text-muted)"
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      boxShadow: 'var(--shadow-md)',
                    }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{data.name}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Driver: {data.driver}
                      </p>
                      <p style={{ color: 'var(--primary)', fontWeight: 500, marginTop: '0.25rem' }}>
                        {data.distance.toLocaleString()} km
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="distance" radius={[0, 4, 4, 0]}>
              {topVehicles.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: 'var(--text-secondary)' 
        }}>
          No odometer data available
        </div>
      )}
    </div>
  );
};

