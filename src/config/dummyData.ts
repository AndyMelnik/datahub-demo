import type { 
  MetricId, 
  MetricDataset, 
  MetricDataPoint, 
  MetricBreakdown,
  TimeRange,
  MetricConfig 
} from '../types/analytics';
import { METRICS, getMetricById } from './metrics';

// ============================================
// Deterministic Random Number Generator
// ============================================

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// ============================================
// Data Generation Patterns
// ============================================

type DataPattern = 'linear_growth' | 'linear_decline' | 'seasonal' | 'stable' | 'volatile';

function getPatternForMetric(metric: MetricConfig): DataPattern {
  if (metric.directionality === 'higher_is_better') {
    return 'linear_growth';
  } else if (metric.directionality === 'lower_is_better') {
    return 'linear_decline';
  }
  return 'stable';
}

function generatePattern(
  pattern: DataPattern,
  dayIndex: number,
  totalDays: number,
  baseValue: number,
  random: () => number
): number {
  const progress = dayIndex / totalDays;
  const noise = (random() - 0.5) * 0.1 * baseValue;
  
  switch (pattern) {
    case 'linear_growth':
      return baseValue * (0.8 + progress * 0.4) + noise;
    case 'linear_decline':
      return baseValue * (1.2 - progress * 0.4) + noise;
    case 'seasonal':
      const seasonalFactor = Math.sin(dayIndex * Math.PI / 15) * 0.2;
      return baseValue * (1 + seasonalFactor) + noise;
    case 'volatile':
      return baseValue * (0.7 + random() * 0.6) + noise;
    case 'stable':
    default:
      return baseValue + noise;
  }
}

// ============================================
// Base Values for Metrics
// ============================================

const BASE_VALUES: Record<string, number> = {
  // Logistics
  vehicle_utilization_rate: 72,
  idle_time: 1.8,
  tco_per_mile: 0.45,
  stops_per_trip: 12.5,
  dwell_time: 28,
  on_time_delivery_rate: 94.2,
  preventive_maintenance_compliance: 88,
  speeding_incidents: 8,
  geofence_alerts: 3,
  
  // Heavy Machinery
  equipment_utilization_rate: 65,
  equipment_idle_time: 18,
  geofence_compliance: 96,
  equipment_availability: 89,
  mttr: 5.2,
  pm_compliance_heavy: 82,
  maintenance_cost_per_hour: 12.50,
  overspeed_incidents: 4,
  geofence_safety_alerts: 2,
  after_hours_usage: 1,
  tampering_alerts: 0,
  overall_fleet_utilization: 68,
  total_fleet_downtime: 12,
  
  // Cold Chain
  realtime_fleet_status: 45,
  on_time_delivery_cold: 97,
  temperature_alerts: 6,
  door_reefer_status: 14,
  vehicle_dwell_time: 35,
  fleet_utilization_cold: 78,
  cost_per_shipment: 125,
  compliance_dashboard: 96,
  
  // Leasing
  idle_time_leasing: 12,
  avg_distance_per_vehicle: 280,
  vehicle_availability_uptime: 92,
  route_plan_vs_actual: 88,
  empty_miles: 18,
  stops_per_day: 8.5,
  downtime_planned_unplanned: 18,
  mtbf: 720,
  maintenance_cost_per_mile: 0.082,
  harsh_events_count: 42,
  speeding_violations: 15,
};

// ============================================
// Time Range Configuration
// ============================================

function getDaysForTimeRange(timeRange: TimeRange): number {
  switch (timeRange) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '12m': return 365;
    case 'all': return 365;
    default: return 30;
  }
}

// ============================================
// Generate Time Series Data
// ============================================

function generateTimeSeries(
  metricId: MetricId,
  timeRange: TimeRange
): MetricDataPoint[] {
  const metric = getMetricById(metricId);
  if (!metric) return [];
  
  const days = getDaysForTimeRange(timeRange);
  const baseValue = BASE_VALUES[metricId] || 50;
  const pattern = getPatternForMetric(metric);
  const random = seededRandom(metricId.length * 1000 + days);
  
  const series: MetricDataPoint[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    let value = generatePattern(pattern, days - i, days, baseValue, random);
    
    // Ensure value stays within reasonable bounds
    if (metric.unit === 'percentage') {
      value = Math.max(0, Math.min(100, value));
    } else if (metric.directionality === 'lower_is_better') {
      value = Math.max(0, value);
    }
    
    series.push({
      timestamp: date.toISOString(),
      value: Math.round(value * 100) / 100,
    });
  }
  
  return series;
}

// ============================================
// Generate Metric Dataset
// ============================================

export function generateMetricDataset(
  metricId: MetricId,
  timeRange: TimeRange = '30d'
): MetricDataset {
  const series = generateTimeSeries(metricId, timeRange);
  
  if (series.length === 0) {
    return {
      metricId,
      series: [],
      currentValue: 0,
      previousValue: 0,
      trend: 0,
    };
  }
  
  const currentValue = series[series.length - 1].value;
  const previousValue = series.length > 7 
    ? series[series.length - 8].value 
    : series[0].value;
  
  const trend = previousValue !== 0 
    ? ((currentValue - previousValue) / previousValue) * 100 
    : 0;
  
  return {
    metricId,
    series,
    currentValue,
    previousValue,
    trend: Math.round(trend * 10) / 10,
  };
}

// ============================================
// Generate Breakdowns
// ============================================

const BREAKDOWN_DIMENSIONS = {
  region: ['North', 'South', 'East', 'West', 'Central'],
  vehicle_type: ['Van', 'Truck', 'Semi', 'Trailer', 'Utility'],
  department: ['Delivery', 'Logistics', 'Sales', 'Service', 'Corporate'],
  driver_group: ['Team A', 'Team B', 'Team C', 'Team D'],
  time_of_day: ['Morning', 'Afternoon', 'Evening', 'Night'],
};

export function generateBreakdown(
  metricId: MetricId,
  dimension: keyof typeof BREAKDOWN_DIMENSIONS
): MetricBreakdown {
  const segments = BREAKDOWN_DIMENSIONS[dimension];
  const random = seededRandom(metricId.length * 100 + dimension.length);
  
  const values = segments.map(() => Math.round(random() * 100));
  const total = values.reduce((a, b) => a + b, 0);
  
  return {
    dimension,
    segments: segments.map((name, i) => ({
      name,
      value: values[i],
      percentage: Math.round((values[i] / total) * 1000) / 10,
    })),
  };
}

export function generateAllBreakdowns(metricId: MetricId): MetricBreakdown[] {
  return Object.keys(BREAKDOWN_DIMENSIONS).map(dim => 
    generateBreakdown(metricId, dim as keyof typeof BREAKDOWN_DIMENSIONS)
  );
}

// ============================================
// API Simulation Layer
// ============================================

const API_DELAY_MS = 300;

export async function fetchMetricData(
  metricId: MetricId,
  timeRange: TimeRange = '30d'
): Promise<MetricDataset> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
  return generateMetricDataset(metricId, timeRange);
}

export async function fetchMetricBreakdowns(
  metricId: MetricId
): Promise<MetricBreakdown[]> {
  await new Promise(resolve => setTimeout(resolve, API_DELAY_MS / 2));
  return generateAllBreakdowns(metricId);
}

export async function fetchMultipleMetrics(
  metricIds: MetricId[],
  timeRange: TimeRange = '30d'
): Promise<Record<MetricId, MetricDataset>> {
  await new Promise(resolve => setTimeout(resolve, API_DELAY_MS));
  
  const result: Record<MetricId, MetricDataset> = {};
  for (const id of metricIds) {
    result[id] = generateMetricDataset(id, timeRange);
  }
  return result;
}

// ============================================
// Pre-generate All Metrics Data (for initial load)
// ============================================

export function generateAllMetricsData(
  timeRange: TimeRange = '30d'
): Record<MetricId, MetricDataset> {
  const result: Record<MetricId, MetricDataset> = {};
  for (const metric of METRICS) {
    result[metric.id] = generateMetricDataset(metric.id, timeRange);
  }
  return result;
}

