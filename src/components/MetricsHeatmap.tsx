import React from 'react';
import type { DepartmentMetrics } from '../types/fleet';

interface MetricsHeatmapProps {
  data: DepartmentMetrics[];
  title?: string;
}

const getColorForValue = (value: number, max: number, min: number): string => {
  const normalized = (value - min) / (max - min);
  
  if (normalized >= 0.75) return 'bg-green-500 text-white';
  if (normalized >= 0.5) return 'bg-green-300 text-gray-800';
  if (normalized >= 0.25) return 'bg-yellow-300 text-gray-800';
  return 'bg-red-300 text-gray-800';
};

const getColorForOfflineRate = (rate: number): string => {
  if (rate >= 50) return 'bg-red-500 text-white';
  if (rate >= 25) return 'bg-yellow-300 text-gray-800';
  return 'bg-green-300 text-gray-800';
};

export const MetricsHeatmap: React.FC<MetricsHeatmapProps> = ({ data, title }) => {
  const maxSpeed = Math.max(...data.map(d => d.averageSpeed));
  const minSpeed = Math.min(...data.map(d => d.averageSpeed));
  
  const maxFuel = Math.max(...data.map(d => d.averageFuel));
  const minFuel = Math.min(...data.map(d => d.averageFuel));
  
  const maxBattery = Math.max(...data.map(d => d.averageBattery));
  const minBattery = Math.min(...data.map(d => d.averageBattery));

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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: 'var(--border)' }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicles
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Speed
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Fuel
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Battery
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offline Rate
              </th>
            </tr>
          </thead>
            <tbody style={{ background: 'var(--surface-1)' }} className="divide-y">
              {data.map((dept, idx) => (
                <tr key={idx} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {dept.department}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">
                  {dept.count}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getColorForValue(dept.averageSpeed, maxSpeed, minSpeed)}`}>
                    {dept.averageSpeed.toFixed(1)} km/h
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getColorForValue(dept.averageFuel, maxFuel, minFuel)}`}>
                    {dept.averageFuel.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getColorForValue(dept.averageBattery, maxBattery, minBattery)}`}>
                    {dept.averageBattery.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getColorForOfflineRate(dept.offlineRate)}`}>
                    {dept.offlineRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

