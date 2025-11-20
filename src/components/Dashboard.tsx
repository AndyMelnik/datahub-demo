import React, { useEffect, useState, useMemo } from 'react';
import { KPICard } from './KPICard';
import { StatusDistributionChart } from './StatusDistributionChart';
import { BarChartComponent } from './BarChartComponent';
import { HorizontalBarChart } from './HorizontalBarChart';
import { ExceptionTable } from './ExceptionTable';
import { MetricsHeatmap } from './MetricsHeatmap';
import { FilterControls } from './FilterControls';
import { VehicleSelector } from './VehicleSelector';
import { VehicleDetailView } from './VehicleDetailView';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <div className="flex items-center space-x-2">
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  background: 'var(--success-light)', 
                  color: 'var(--success)' 
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-2 animate-pulse"
                  style={{ background: 'var(--success)' }}
                ></span>
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <FilterControls
          groups={availableGroups}
          departments={availableDepartments}
          selectedGroup={selectedGroup}
          selectedDepartment={selectedDepartment}
          onGroupChange={setSelectedGroup}
          onDepartmentChange={setSelectedDepartment}
          onResetFilters={handleResetFilters}
        />

        {/* Vehicle Selector */}
        <VehicleSelector
          vehicles={filteredVehicles}
          onVehicleSelect={setSelectedVehicle}
          selectedVehicle={selectedVehicle}
        />

        {/* Vehicle Detail View */}
        {selectedVehicle && (
          <section className="mb-8">
            <VehicleDetailView vehicle={selectedVehicle} />
          </section>
        )}

        {/* Results Summary */}
        {(selectedGroup !== 'all' || selectedDepartment !== 'all') && (
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{ 
              background: 'var(--info-light)', 
              border: '1px solid var(--info)' 
            }}
          >
            <p style={{ color: 'var(--info)' }}>
              <strong>Showing {filteredVehicles.length}</strong> of {vehicles.length} total vehicles
              {selectedGroup !== 'all' && ` in group "${selectedGroup}"`}
              {selectedDepartment !== 'all' && ` in department "${selectedDepartment}"`}
            </p>
          </div>
        )}

        {/* Executive Summary */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Executive Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Vehicles"
              value={metrics.totalVehicles}
              subtitle="In fleet"
              color="blue"
            />
            <KPICard
              title="Vehicles Moving"
              value={metrics.movingVehicles}
              subtitle={`${((metrics.movingVehicles / metrics.totalVehicles) * 100).toFixed(1)}% of fleet`}
              color="green"
            />
            <KPICard
              title="Online Status"
              value={metrics.onlineVehicles}
              subtitle={`${metrics.offlineVehicles} offline`}
              color="blue"
            />
            <KPICard
              title="Average Speed"
              value={metrics.averageSpeed}
              subtitle="Moving vehicles"
              color="purple"
              format="decimal"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPICard
              title="Idle Vehicles"
              value={metrics.idleVehicles}
              subtitle="Stopped status"
              color="yellow"
            />
            <KPICard
              title="Low Fuel"
              value={metrics.lowFuelCount}
              subtitle="Below 25%"
              color="red"
            />
            <KPICard
              title="Low Battery"
              value={metrics.lowBatteryCount}
              subtitle="Needs attention"
              color="red"
            />
            <KPICard
              title="Overspeeding"
              value={metrics.overspeedingCount}
              subtitle="Above threshold"
              color="red"
            />
          </div>
        </section>

        {/* Fleet Condition Overview */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Fleet Condition Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusDistributionChart
              data={statusDistribution}
              title="Moving Status Distribution"
            />
            <StatusDistributionChart
              data={connectionDistribution}
              title="Connection Status Distribution"
            />
          </div>
        </section>

        {/* Operational Distribution */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Operational Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BarChartComponent
              data={speedDistribution}
              title="Speed Distribution"
              dataKey="count"
              xAxisKey="range"
              color="#3b82f6"
            />
            <BarChartComponent
              data={fuelDistribution}
              title="Fuel Level Distribution"
              dataKey="count"
              xAxisKey="range"
              color="#10b981"
            />
            <BarChartComponent
              data={batteryDistribution}
              title="Battery Level Distribution"
              dataKey="count"
              xAxisKey="range"
              color="#f59e0b"
            />
          </div>
        </section>

        {/* Asset Group Breakdown */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Asset Group Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <BarChartComponent
              data={departmentMetrics.map(d => ({ name: d.department, count: d.count }))}
              title="Vehicles by Department"
              dataKey="count"
              xAxisKey="name"
              color="#8b5cf6"
              height={350}
            />
            <BarChartComponent
              data={modelDistribution}
              title="Top 10 Vehicle Models"
              dataKey="count"
              xAxisKey="model"
              color="#06b6d4"
              height={350}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <HorizontalBarChart
              data={groupMetrics}
              title="Connection Status by Group"
              dataKeys={['online', 'offline', 'idle']}
              yAxisKey="group"
              colors={['#10b981', '#ef4444', '#f59e0b']}
            />
          </div>
        </section>

        {/* Department Metrics Heatmap */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Department Performance Metrics
          </h2>
          <MetricsHeatmap
            data={departmentMetrics}
            title="Department Metrics Comparison"
          />
        </section>

        {/* Zone Distribution */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Geographic Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartComponent
              data={zoneDistribution.map(z => ({ name: z.status, count: z.count }))}
              title="Vehicles by Zone"
              dataKey="count"
              xAxisKey="name"
              color="#ec4899"
              height={350}
            />
            <StatusDistributionChart
              data={zoneDistribution}
              title="Zone Distribution"
            />
          </div>
        </section>

        {/* Exception & Risk Monitoring */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Exception & Risk Monitoring
          </h2>
          <ExceptionTable
            vehicles={exceptionVehicles}
            title="Vehicles Requiring Attention"
          />
        </section>

        {/* Footer */}
        <footer 
          className="mt-12 text-center text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1">Fleet Management Dashboard Demo - Powered by Navixy</p>
        </footer>
      </div>
    </div>
  );
};

