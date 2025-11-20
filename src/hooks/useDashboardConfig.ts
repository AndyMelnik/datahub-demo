import { useState, useEffect } from 'react';

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  visible: boolean;
  height?: number;
}

export interface DashboardConfig {
  version?: number;
  charts: Record<string, ChartConfig>;
  layout: LayoutItem[];
}

const CURRENT_VERSION = 9; // Increment this when default layout changes

const DEFAULT_CONFIG: DashboardConfig = {
  version: CURRENT_VERSION,
  charts: {
    'filters': { id: 'filters', title: 'Filters & Controls', visible: true },
    'kpi-total-vehicles': { id: 'kpi-total-vehicles', title: 'Total Vehicles', visible: true },
    'kpi-vehicles-moving': { id: 'kpi-vehicles-moving', title: 'Vehicles Moving', visible: true },
    'kpi-online-status': { id: 'kpi-online-status', title: 'Online Status', visible: true },
    'kpi-average-speed': { id: 'kpi-average-speed', title: 'Average Speed', visible: true },
    'kpi-idle-vehicles': { id: 'kpi-idle-vehicles', title: 'Idle Vehicles', visible: true },
    'kpi-low-fuel': { id: 'kpi-low-fuel', title: 'Low Fuel', visible: true },
    'kpi-low-battery': { id: 'kpi-low-battery', title: 'Low Battery', visible: true },
    'kpi-overspeeding': { id: 'kpi-overspeeding', title: 'Overspeeding', visible: true },
    'moving-status': { id: 'moving-status', title: 'Moving Status Distribution', visible: true },
    'connection-status': { id: 'connection-status', title: 'Connection Status Distribution', visible: true },
    'speed-dist': { id: 'speed-dist', title: 'Speed Distribution', visible: true },
    'fuel-dist': { id: 'fuel-dist', title: 'Fuel Level Distribution', visible: true },
    'battery-dist': { id: 'battery-dist', title: 'Battery Voltage Distribution', visible: true },
    'vehicles-by-dept': { id: 'vehicles-by-dept', title: 'Vehicles by Department', visible: true },
    'top-models': { id: 'top-models', title: 'Top 10 Vehicle Models', visible: true },
    'connection-by-group': { id: 'connection-by-group', title: 'Connection Status by Group', visible: true },
    'dept-metrics': { id: 'dept-metrics', title: 'Department Performance Metrics', visible: true },
    'vehicles-by-zone': { id: 'vehicles-by-zone', title: 'Vehicles by Zone', visible: true },
    'top-distance': { id: 'top-distance', title: 'TOP 5 Distance Traveled', visible: true },
    'exceptions': { id: 'exceptions', title: 'Exception & Risk Monitoring', visible: true },
  },
  layout: [
    // Filters - full width (80px * 2 = 160px height)
    { i: 'filters', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
    
    // KPI Indicators Row 1 - 4 in a row (80px * 2 = 160px height)
    { i: 'kpi-total-vehicles', x: 0, y: 2, w: 3, h: 2, minW: 3, minH: 2 },
    { i: 'kpi-vehicles-moving', x: 3, y: 2, w: 3, h: 2, minW: 3, minH: 2 },
    { i: 'kpi-online-status', x: 6, y: 2, w: 3, h: 2, minW: 3, minH: 2 },
    { i: 'kpi-average-speed', x: 9, y: 2, w: 3, h: 2, minW: 3, minH: 2 },
    
    // Connection Status by Group - between KPI rows (80px * 4 = 320px height)
    { i: 'connection-by-group', x: 0, y: 4, w: 12, h: 4, minW: 6, minH: 3 },
    
    // KPI Indicators Row 2 - 4 in a row (80px * 2 = 160px height)
    { i: 'kpi-idle-vehicles', x: 0, y: 8, w: 3, h: 2, minW: 3, minH: 2 },
    { i: 'kpi-low-fuel', x: 3, y: 8, w: 3, h: 2, minW: 3, minH: 2 },
    { i: 'kpi-low-battery', x: 6, y: 8, w: 3, h: 2, minW: 3, minH: 2 },
    { i: 'kpi-overspeeding', x: 9, y: 8, w: 3, h: 2, minW: 3, minH: 2 },
    
    // Pie Charts - 2 in a row (80px * 5 = 400px height)
    { i: 'moving-status', x: 0, y: 10, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'connection-status', x: 6, y: 10, w: 6, h: 5, minW: 4, minH: 4 },
    
    // Department Metrics Table - after pie charts (80px * 6 = 480px height)
    { i: 'dept-metrics', x: 0, y: 15, w: 12, h: 6, minW: 6, minH: 4 },
    
    // Vertical Bar Charts - 2 in a row (80px * 5 = 400px height)
    { i: 'speed-dist', x: 0, y: 21, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'fuel-dist', x: 6, y: 21, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'battery-dist', x: 0, y: 26, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'vehicles-by-dept', x: 6, y: 26, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'top-models', x: 0, y: 31, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'vehicles-by-zone', x: 6, y: 31, w: 6, h: 5, minW: 4, minH: 4 },
    
    // Horizontal Bar Chart - full width (80px * 4 = 320px height)
    { i: 'top-distance', x: 0, y: 36, w: 12, h: 4, minW: 6, minH: 3 },
    
    // Exception Table - full width (80px * 6 = 480px height)
    { i: 'exceptions', x: 0, y: 40, w: 12, h: 6, minW: 6, minH: 4 },
  ],
};

const STORAGE_KEY = 'fleet-dashboard-config';

export const useDashboardConfig = () => {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        // Check if stored config version matches current version
        if (parsedConfig.version === CURRENT_VERSION) {
          return parsedConfig;
        }
        // Version mismatch - use default config with new layout
        console.log('Dashboard layout updated - applying new default layout');
        return DEFAULT_CONFIG;
      }
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save dashboard config:', error);
    }
  }, [config]);

  const updateChartTitle = (chartId: string, title: string) => {
    setConfig((prev) => ({
      ...prev,
      charts: {
        ...prev.charts,
        [chartId]: {
          ...prev.charts[chartId],
          title,
        },
      },
    }));
  };

  const toggleChartVisibility = (chartId: string) => {
    setConfig((prev) => ({
      ...prev,
      charts: {
        ...prev.charts,
        [chartId]: {
          ...prev.charts[chartId],
          visible: !prev.charts[chartId].visible,
        },
      },
    }));
  };

  const updateLayout = (newLayout: LayoutItem[]) => {
    setConfig((prev) => ({
      ...prev,
      layout: newLayout,
    }));
  };

  const resetConfig = () => {
    setConfig({ ...DEFAULT_CONFIG, version: CURRENT_VERSION });
  };

  return {
    config,
    updateChartTitle,
    toggleChartVisibility,
    updateLayout,
    resetConfig,
  };
};

