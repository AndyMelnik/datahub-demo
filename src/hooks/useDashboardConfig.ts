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
  charts: Record<string, ChartConfig>;
  layout: LayoutItem[];
}

const DEFAULT_CONFIG: DashboardConfig = {
  charts: {
    'executive-summary': { id: 'executive-summary', title: 'Executive Summary', visible: true },
    'fleet-condition': { id: 'fleet-condition', title: 'Fleet Condition Overview', visible: true },
    'operational-dist': { id: 'operational-dist', title: 'Operational Distribution', visible: true },
    'asset-group': { id: 'asset-group', title: 'Asset Group Breakdown', visible: true },
    'dept-metrics': { id: 'dept-metrics', title: 'Department Performance Metrics', visible: true },
    'geo-dist': { id: 'geo-dist', title: 'Geographic Distribution', visible: true },
    'exceptions': { id: 'exceptions', title: 'Exception & Risk Monitoring', visible: true },
  },
  layout: [
    { i: 'executive-summary', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'fleet-condition', x: 0, y: 4, w: 12, h: 3, minW: 6, minH: 2 },
    { i: 'operational-dist', x: 0, y: 7, w: 12, h: 3, minW: 6, minH: 2 },
    { i: 'asset-group', x: 0, y: 10, w: 12, h: 4, minW: 6, minH: 3 },
    { i: 'dept-metrics', x: 0, y: 14, w: 12, h: 3, minW: 6, minH: 2 },
    { i: 'geo-dist', x: 0, y: 17, w: 12, h: 3, minW: 6, minH: 2 },
    { i: 'exceptions', x: 0, y: 20, w: 12, h: 4, minW: 6, minH: 2 },
  ],
};

const STORAGE_KEY = 'fleet-dashboard-config';

export const useDashboardConfig = () => {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
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
    setConfig(DEFAULT_CONFIG);
  };

  return {
    config,
    updateChartTitle,
    toggleChartVisibility,
    updateLayout,
    resetConfig,
  };
};

