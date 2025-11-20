import React from 'react';
import { Card } from './ui/Card';
import type { ExceptionVehicle } from '../types/fleet';

interface ExceptionTableProps {
  vehicles: ExceptionVehicle[];
  title: string;
}

const getSeverityColor = (reasons: string[]): string => {
  if (reasons.includes('Critical Battery') || reasons.includes('Overspeeding')) {
    return 'bg-red-50 border-red-200';
  }
  if (reasons.includes('Low Battery') || reasons.includes('Low Fuel')) {
    return 'bg-yellow-50 border-yellow-200';
  }
  return 'bg-gray-50 border-gray-200';
};

const getReasonBadgeColor = (reason: string): string => {
  switch (reason) {
    case 'Critical Battery':
    case 'Overspeeding':
      return 'bg-red-100 text-red-800';
    case 'Low Battery':
    case 'Low Fuel':
      return 'bg-yellow-100 text-yellow-800';
    case 'Offline':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

export const ExceptionTable: React.FC<ExceptionTableProps> = ({ vehicles, title }) => {
  return (
    <Card className="p-4">
      <h3 
        className="text-base font-semibold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y" style={{ borderColor: 'var(--border)' }}>
            <thead className="sticky top-0" style={{ background: 'var(--surface-2)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speed
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Battery
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.object_id} className={`${getSeverityColor(vehicle.reason)} border-l-4`}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.object_label}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vehicle.first_name} {vehicle.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vehicle.speed} km/h
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vehicle.battery_level.toFixed(2)}V
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {vehicle.fuel_level_percent}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.connection_status === 'online' ? 'bg-green-100 text-green-800' :
                      vehicle.connection_status === 'offline' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vehicle.connection_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {vehicle.reason.map((reason, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getReasonBadgeColor(reason)}`}
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {vehicles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No exceptions found. All vehicles operating normally.
        </div>
      )}
    </Card>
  );
};

