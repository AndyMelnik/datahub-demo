import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './ui/Card';
import type { FleetVehicle } from '../types/fleet';

interface VehicleDetailViewProps {
  vehicle: FleetVehicle;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({ vehicle }) => {
  const statusColor =
    vehicle.connection_status === 'online'
      ? 'green'
      : vehicle.connection_status === 'offline'
      ? 'red'
      : 'yellow';

  const getStatusIcon = () => {
    if (vehicle.moving_status === 'moving') return '🚗';
    if (vehicle.moving_status === 'stopped') return '⏸️';
    return '🅿️';
  };

  // Create gauge data for battery (voltage) and fuel (percentage)
  // Battery voltage scale: 11V-15V mapped to visual representation
  const batteryPercentage = Math.min(100, Math.max(0, ((vehicle.battery_level - 11) / (15 - 11)) * 100));
  
  const gaugeData = [
    {
      name: 'Battery (V)',
      value: batteryPercentage,
      actualValue: vehicle.battery_level,
      unit: 'V',
      color: vehicle.battery_level < 12.0 ? '#ef4444' : vehicle.battery_level < 12.5 ? '#f59e0b' : '#10b981',
    },
    {
      name: 'Fuel (%)',
      value: vehicle.fuel_level_percent,
      actualValue: vehicle.fuel_level_percent,
      unit: '%',
      color: vehicle.fuel_level_percent < 25 ? '#ef4444' : vehicle.fuel_level_percent < 50 ? '#f59e0b' : '#10b981',
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ 
      boxShadow: 'var(--shadow-lg)', 
      border: '2px solid var(--primary)'
    }}>
      {/* Header */}
      <div className="gradient-primary text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{vehicle.object_label}</h2>
            <p className="text-indigo-100">
              Driver: {vehicle.first_name} {vehicle.last_name}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-${statusColor}-500`}>
              {getStatusIcon()} {vehicle.moving_status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" style={{ background: 'var(--surface-1)' }}>
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Current Speed</p>
            <p className="text-2xl font-bold text-blue-700">{vehicle.speed}</p>
            <p className="text-xs text-gray-500">km/h</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Connection</p>
            <p className="text-2xl font-bold text-green-700 capitalize">{vehicle.connection_status}</p>
            <p className="text-xs text-gray-500">Status</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Odometer</p>
            <p className="text-2xl font-bold text-purple-700">{vehicle.odometer.toFixed(1)}</p>
            <p className="text-xs text-gray-500">km</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Device ID</p>
            <p className="text-xl font-bold text-orange-700">{vehicle.device_id}</p>
            <p className="text-xs text-gray-500">ID</p>
          </div>
        </div>

        {/* Battery and Fuel Levels */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Battery & Fuel Levels</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gaugeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip 
                formatter={(value, name, props) => {
                  const item = props.payload;
                  return [`${item.actualValue.toFixed(1)}${item.unit}`, name];
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Model:</span>
                <span className="font-medium text-gray-900">{vehicle.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Object ID:</span>
                <span className="font-medium text-gray-900">{vehicle.object_id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Zone:</span>
                <span className="font-medium text-gray-900">{vehicle.zone_label || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Group:</span>
                <span className="font-medium text-gray-900">{vehicle.group_label || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium text-gray-900">{vehicle.department_label || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Telemetry Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Device Time:</span>
                <span className="font-medium text-gray-900">{vehicle.device_time}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Platform Time:</span>
                <span className="font-medium text-gray-900">{vehicle.platform_time}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Last Connect:</span>
                <span className="font-medium text-gray-900">{vehicle.last_connect_formatted}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Battery Voltage:</span>
                <span className={`font-medium ${
                  vehicle.battery_level < 12.0 ? 'text-red-600' : 
                  vehicle.battery_level < 12.5 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {vehicle.battery_level.toFixed(2)}V
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Fuel Level:</span>
                <span className={`font-medium ${
                  vehicle.fuel_level_percent < 25 ? 'text-red-600' : 
                  vehicle.fuel_level_percent < 50 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {vehicle.fuel_level_percent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Alerts</h3>
          <div className="flex flex-wrap gap-2">
            {vehicle.speed > 80 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                ⚠️ Overspeeding
              </span>
            )}
            {vehicle.connection_status === 'offline' && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                📡 Offline
              </span>
            )}
            {vehicle.battery_level < 12.0 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                🔋 Critical Battery ({vehicle.battery_level.toFixed(2)}V)
              </span>
            )}
            {vehicle.battery_level >= 12.0 && vehicle.battery_level < 12.5 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                🔋 Low Battery ({vehicle.battery_level.toFixed(2)}V)
              </span>
            )}
            {vehicle.fuel_level_percent < 25 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                ⛽ Low Fuel
              </span>
            )}
            {vehicle.speed <= 80 && 
             vehicle.connection_status !== 'offline' && 
             vehicle.battery_level >= 12.5 && 
             vehicle.fuel_level_percent >= 25 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✅ All Systems Normal
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

