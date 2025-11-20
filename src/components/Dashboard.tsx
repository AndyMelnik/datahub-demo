import React, { useEffect, useState, useMemo } from 'react';
import { KPICard } from './KPICard';
import { StatusDistributionChart } from './StatusDistributionChart';
import { BarChartComponent } from './BarChartComponent';
import { HorizontalBarChart } from './HorizontalBarChart';
import { ExceptionTable } from './ExceptionTable';
import { MetricsHeatmap } from './MetricsHeatmap';
import { TopDistanceChart } from './TopDistanceChart';
import { VehicleDetailView } from './VehicleDetailView';
import { EditableTitle } from './EditableTitle';
import { Button } from './ui/Button';
import { DraggableDashboard } from './DraggableDashboard';
import { useDashboardConfig } from '../hooks/useDashboardConfig';
import type { Layout } from 'react-grid-layout';
import {
  loadFleetData,
  calculateFleetMetrics,
  getStatusDistribution,
  getConnectionDistribution,
  getSpeedDistribution,
  getFuelDistribution,
  getBatteryDistribution,
  getDepartmentMetrics,
  getGroupMetrics,
  getModelDistribution,
  getExceptionVehicles,
  getZoneDistribution,
} from '../utils/dataProcessor';
import type { FleetVehicle } from '../types/fleet';

export const Dashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { config, updateChartTitle, updateLayout, resetConfig } = useDashboardConfig();

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (isEditMode) {
      updateLayout(newLayout);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadFleetData('/data_sample.csv');
        setVehicles(data);
        setError(null);
      } catch (err) {
        setError('Failed to load fleet data. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Extract unique groups and departments for filter options
  const availableGroups = useMemo(() => {
    const groups = Array.from(new Set(vehicles.map(v => v.group_label).filter(Boolean)));
    return groups.sort();
  }, [vehicles]);

  const availableDepartments = useMemo(() => {
    const departments = Array.from(new Set(vehicles.map(v => v.department_label).filter(Boolean)));
    return departments.sort();
  }, [vehicles]);

  // Filter vehicles based on selected filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const groupMatch = selectedGroup === 'all' || vehicle.group_label === selectedGroup;
      const departmentMatch = selectedDepartment === 'all' || vehicle.department_label === selectedDepartment;
      return groupMatch && departmentMatch;
    });
  }, [vehicles, selectedGroup, selectedDepartment]);

  const handleResetFilters = () => {
    setSelectedGroup('all');
    setSelectedDepartment('all');
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--surface-2)' }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 mx-auto mb-4"
            style={{ 
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'var(--primary)',
              borderTopColor: 'transparent'
            }}
          ></div>
          <p 
            className="text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Loading fleet data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--surface-2)' }}
      >
        <div 
          className="rounded-lg p-6 max-w-md"
          style={{ 
            background: 'var(--danger-light)', 
            border: '1px solid var(--danger)' 
          }}
        >
          <h3 
            className="font-semibold text-lg mb-2"
            style={{ color: 'var(--danger)' }}
          >
            Error Loading Data
          </h3>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      </div>
    );
  }

  const metrics = calculateFleetMetrics(filteredVehicles);
  const statusDistribution = getStatusDistribution(filteredVehicles);
  const connectionDistribution = getConnectionDistribution(filteredVehicles);
  const speedDistribution = getSpeedDistribution(filteredVehicles);
  const fuelDistribution = getFuelDistribution(filteredVehicles);
  const batteryDistribution = getBatteryDistribution(filteredVehicles);
  const departmentMetrics = getDepartmentMetrics(filteredVehicles);
  const groupMetrics = getGroupMetrics(filteredVehicles);
  const modelDistribution = getModelDistribution(filteredVehicles);
  const exceptionVehicles = getExceptionVehicles(filteredVehicles);
  const zoneDistribution = getZoneDistribution(filteredVehicles);

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
      {/* Header */}
      <header 
        className="shadow-sm"
        style={{ 
          background: 'var(--surface-1)', 
          borderBottom: '1px solid var(--border)' 
        }}
      >
        <div className="mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Fleet Management Dashboard
              </h1>
              <p 
                className="mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Real-time monitoring and analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditMode && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetConfig}
                  >
                    Reset Layout
                  </Button>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    ✏️ Edit Mode
                  </span>
                </div>
              )}
              <Button
                variant={isEditMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? '💾 Save & Exit' : '✏️ Edit Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-6 py-8">
        {/* Vehicle Detail View */}
        {selectedVehicle && (
          <section className="mb-6">
            <VehicleDetailView vehicle={selectedVehicle} />
          </section>
        )}

        <DraggableDashboard
          layout={config.layout}
          onLayoutChange={handleLayoutChange}
          isEditMode={isEditMode}
        >
        {/* Filters & Controls */}
        {config.charts['filters']?.visible !== false && (
        <div key="filters" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Filters
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Filter by Group
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="all">All Groups</option>
                    {availableGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Filter by Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="all">All Departments</option>
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Vehicle / Driver Analysis
                  </label>
                  <select
                    value={selectedVehicle?.object_id || ''}
                    onChange={(e) => {
                      const vehicleId = e.target.value;
                      if (vehicleId) {
                        const vehicle = filteredVehicles.find(v => v.object_id.toString() === vehicleId);
                        setSelectedVehicle(vehicle || null);
                      } else {
                        setSelectedVehicle(null);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="">Select Vehicle/Driver</option>
                    {filteredVehicles.map((vehicle) => (
                      <option key={vehicle.object_id} value={vehicle.object_id}>
                        {vehicle.object_label} - {vehicle.first_name} {vehicle.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(selectedGroup !== 'all' || selectedDepartment !== 'all' || selectedVehicle) && (
                <button
                  onClick={() => {
                    handleResetFilters();
                    setSelectedVehicle(null);
                  }}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
        )}

        {/* KPI: Total Vehicles */}
        {config.charts['kpi-total-vehicles']?.visible !== false && (
        <div key="kpi-total-vehicles" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Total Vehicles"
              value={metrics.totalVehicles}
              subtitle="In fleet"
              color="blue"
            />
          </div>
        </div>
        )}

        {/* KPI: Vehicles Moving */}
        {config.charts['kpi-vehicles-moving']?.visible !== false && (
        <div key="kpi-vehicles-moving" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Vehicles Moving"
              value={metrics.movingVehicles}
              subtitle={`${((metrics.movingVehicles / metrics.totalVehicles) * 100).toFixed(1)}% of fleet`}
              color="blue"
            />
          </div>
        </div>
        )}

        {/* KPI: Online Status */}
        {config.charts['kpi-online-status']?.visible !== false && (
        <div key="kpi-online-status" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Online Status"
              value={metrics.onlineVehicles}
              subtitle={`${metrics.offlineVehicles} offline`}
              color="blue"
            />
          </div>
        </div>
        )}

        {/* KPI: Average Speed */}
        {config.charts['kpi-average-speed']?.visible !== false && (
        <div key="kpi-average-speed" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Average Speed"
              value={metrics.averageSpeed}
              subtitle="Moving vehicles"
              color="blue"
              format="decimal"
            />
          </div>
        </div>
        )}

        {/* KPI: Idle Vehicles */}
        {config.charts['kpi-idle-vehicles']?.visible !== false && (
        <div key="kpi-idle-vehicles" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Idle Vehicles"
              value={metrics.idleVehicles}
              subtitle="Stopped status"
              color="gray"
            />
          </div>
        </div>
        )}

        {/* KPI: Low Fuel */}
        {config.charts['kpi-low-fuel']?.visible !== false && (
        <div key="kpi-low-fuel" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Low Fuel"
              value={metrics.lowFuelCount}
              subtitle="Below 25%"
              color="gray"
            />
          </div>
        </div>
        )}

        {/* KPI: Low Battery */}
        {config.charts['kpi-low-battery']?.visible !== false && (
        <div key="kpi-low-battery" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Low Battery"
              value={metrics.lowBatteryCount}
              subtitle="Below 12.5V"
              color="gray"
            />
          </div>
        </div>
        )}

        {/* KPI: Overspeeding */}
        {config.charts['kpi-overspeeding']?.visible !== false && (
        <div key="kpi-overspeeding" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <KPICard
              title="Overspeeding"
              value={metrics.overspeedingCount}
              subtitle="Above threshold"
              color="gray"
            />
          </div>
        </div>
        )}

        {/* Moving Status Distribution */}
        {config.charts['moving-status']?.visible !== false && (
        <div key="moving-status" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['moving-status']?.title || 'Moving Status Distribution'}
              onChange={(title) => updateChartTitle('moving-status', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <StatusDistributionChart
              data={statusDistribution}
              title=""
            />
          </div>
        </div>
        )}

        {/* Connection Status Distribution */}
        {config.charts['connection-status']?.visible !== false && (
        <div key="connection-status" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['connection-status']?.title || 'Connection Status Distribution'}
              onChange={(title) => updateChartTitle('connection-status', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <StatusDistributionChart
              data={connectionDistribution}
              title=""
            />
          </div>
        </div>
        )}

        {/* Speed Distribution */}
        {config.charts['speed-dist']?.visible !== false && (
        <div key="speed-dist" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['speed-dist']?.title || 'Speed Distribution'}
              onChange={(title) => updateChartTitle('speed-dist', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <BarChartComponent
              data={speedDistribution}
              title=""
              dataKey="count"
              xAxisKey="range"
              color="#60a5fa"
            />
          </div>
        </div>
        )}

        {/* Fuel Level Distribution */}
        {config.charts['fuel-dist']?.visible !== false && (
        <div key="fuel-dist" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['fuel-dist']?.title || 'Fuel Level Distribution'}
              onChange={(title) => updateChartTitle('fuel-dist', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <BarChartComponent
              data={fuelDistribution}
              title=""
              dataKey="count"
              xAxisKey="range"
              color="#94a3b8"
            />
          </div>
        </div>
        )}

        {/* Battery Voltage Distribution */}
        {config.charts['battery-dist']?.visible !== false && (
        <div key="battery-dist" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['battery-dist']?.title || 'Battery Voltage Distribution'}
              onChange={(title) => updateChartTitle('battery-dist', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <BarChartComponent
              data={batteryDistribution}
              title=""
              dataKey="count"
              xAxisKey="range"
              color="#64748b"
            />
          </div>
        </div>
        )}

        {/* Vehicles by Department */}
        {config.charts['vehicles-by-dept']?.visible !== false && (
        <div key="vehicles-by-dept" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['vehicles-by-dept']?.title || 'Vehicles by Department'}
              onChange={(title) => updateChartTitle('vehicles-by-dept', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <BarChartComponent
              data={departmentMetrics.map(d => ({ name: d.department, count: d.count }))}
              title=""
              dataKey="count"
              xAxisKey="name"
              color="#60a5fa"
              height={400}
            />
          </div>
        </div>
        )}

        {/* Top 10 Vehicle Models */}
        {config.charts['top-models']?.visible !== false && (
        <div key="top-models" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['top-models']?.title || 'Top 10 Vehicle Models'}
              onChange={(title) => updateChartTitle('top-models', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <BarChartComponent
              data={modelDistribution}
              title=""
              dataKey="count"
              xAxisKey="model"
              color="#94a3b8"
              height={400}
            />
          </div>
        </div>
        )}

        {/* Connection Status by Group */}
        {config.charts['connection-by-group']?.visible !== false && (
        <div key="connection-by-group" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['connection-by-group']?.title || 'Connection Status by Group'}
              onChange={(title) => updateChartTitle('connection-by-group', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <HorizontalBarChart
              data={groupMetrics}
              title=""
              dataKeys={['online', 'offline', 'idle']}
              yAxisKey="group"
              colors={['#60a5fa', '#64748b', '#94a3b8']}
            />
          </div>
        </div>
        )}

        {/* Department Metrics Heatmap */}
        {config.charts['dept-metrics']?.visible !== false && (
        <div key="dept-metrics" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['dept-metrics']?.title || 'Department Performance Metrics'}
              onChange={(title) => updateChartTitle('dept-metrics', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <MetricsHeatmap
              data={departmentMetrics}
              title="Department Metrics Comparison"
            />
          </div>
        </div>
        )}

        {/* Vehicles by Zone */}
        {config.charts['vehicles-by-zone']?.visible !== false && (
        <div key="vehicles-by-zone" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['vehicles-by-zone']?.title || 'Vehicles by Zone'}
              onChange={(title) => updateChartTitle('vehicles-by-zone', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <BarChartComponent
              data={zoneDistribution.map(z => ({ name: z.status, count: z.count }))}
              title=""
              dataKey="count"
              xAxisKey="name"
              color="#64748b"
              height={400}
            />
          </div>
        </div>
        )}

        {/* TOP 5 Distance Traveled */}
        {config.charts['top-distance']?.visible !== false && (
        <div key="top-distance" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['top-distance']?.title || 'TOP 5 Distance Traveled'}
              onChange={(title) => updateChartTitle('top-distance', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <TopDistanceChart
              vehicles={filteredVehicles}
              title=""
            />
          </div>
        </div>
        )}

        {/* Exception & Risk Monitoring */}
        {config.charts['exceptions']?.visible !== false && (
        <div key="exceptions" className={isEditMode ? 'react-grid-item--editing' : ''}>
          <div className="h-full p-4 overflow-auto">
            {isEditMode && (
              <div className="drag-handle mb-2">
                <div className="drag-handle-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-xs text-gray-500">Drag to move</span>
              </div>
            )}
            <EditableTitle
              value={config.charts['exceptions']?.title || 'Exception & Risk Monitoring'}
              onChange={(title) => updateChartTitle('exceptions', title)}
              isEditing={isEditMode}
              className="text-xl font-bold mb-4"
            />
            <ExceptionTable
              vehicles={exceptionVehicles}
              title="Vehicles Requiring Attention"
            />
          </div>
        </div>
        )}
        </DraggableDashboard>

        {/* Footer */}
        <footer 
          className="mt-8 text-center text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1">Fleet Management Dashboard Demo - Powered by Navixy</p>
        </footer>
      </div>
    </div>
  );
};
