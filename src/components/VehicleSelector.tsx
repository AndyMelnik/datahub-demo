import React, { useState } from 'react';
import { Card } from './ui/Card';
import type { FleetVehicle } from '../types/fleet';

interface VehicleSelectorProps {
  vehicles: FleetVehicle[];
  onVehicleSelect: (vehicle: FleetVehicle | null) => void;
  selectedVehicle: FleetVehicle | null;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  onVehicleSelect,
  selectedVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.object_label.toLowerCase().includes(searchLower) ||
      `${vehicle.first_name} ${vehicle.last_name}`.toLowerCase().includes(searchLower) ||
      vehicle.object_id.toString().includes(searchLower)
    );
  });

  const handleSelect = (vehicle: FleetVehicle) => {
    onVehicleSelect(vehicle);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onVehicleSelect(null);
    setSearchTerm('');
  };

  return (
    <Card className="mb-6 p-6">
      <h3 
        className="text-lg font-semibold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Vehicle / Driver Analysis
      </h3>
      
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by vehicle, driver name, or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="absolute right-3 top-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {selectedVehicle && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && searchTerm && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.slice(0, 10).map((vehicle) => (
                <button
                  key={vehicle.object_id}
                  onClick={() => handleSelect(vehicle)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.object_label}</p>
                      <p className="text-sm text-gray-600">
                        Driver: {vehicle.first_name} {vehicle.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.connection_status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : vehicle.connection_status === 'offline'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {vehicle.connection_status}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No vehicles found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Vehicle Display */}
      {selectedVehicle && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-indigo-900">{selectedVehicle.object_label}</p>
              <p className="text-sm text-indigo-700">
                Driver: {selectedVehicle.first_name} {selectedVehicle.last_name}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedVehicle.connection_status === 'online'
                  ? 'bg-green-500 text-white'
                  : selectedVehicle.connection_status === 'offline'
                  ? 'bg-red-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              {selectedVehicle.connection_status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

