// ============================================
// Analytics Dashboard Type Definitions
// ============================================

export type MetricId = string;

export type MetricUnit = 
  | 'number' 
  | 'currency' 
  | 'percentage' 
  | 'duration' 
  | 'ratio'
  | 'distance'
  | 'speed'
  | 'hours';

export type MetricDirectionality = 
  | 'higher_is_better' 
  | 'lower_is_better' 
  | 'neutral';

export type ChartType = 
  | 'kpi' 
  | 'timeseries' 
  | 'bar' 
  | 'pie' 
  | 'table' 
  | 'funnel'
  | 'gauge'
  | 'heatmap';

export type TimeRange = '7d' | '30d' | '90d' | '12m' | 'all';

export type IndustryId = 
  | 'logistics' 
  | 'heavy_machinery' 
  | 'cold_chain' 
  | 'leasing';

export type RoleId = 
  | 'fleet_operations_manager'
  | 'maintenance_manager'
  | 'safety_compliance_manager'
  | 'security_manager'
  | 'operations_director';

// ============================================
// Metric Configuration
// ============================================

export interface MetricConfig {
  id: MetricId;
  label: string;
  description: string;
  businessValue: string;
  industry: IndustryId;
  roles: RoleId[];
  group?: string;
  unit: MetricUnit;
  directionality: MetricDirectionality;
  chartType: ChartType;
  defaultTimeRange: TimeRange;
  tags?: string[];
  thresholds?: {
    warning?: number;
    critical?: number;
  };
  format?: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
  };
}

// ============================================
// Dummy Data Types
// ============================================

export interface MetricDataPoint {
  timestamp: string; // ISO 8601
  value: number;
}

export interface MetricDataset {
  metricId: MetricId;
  series: MetricDataPoint[];
  currentValue: number;
  previousValue: number;
  trend: number; // percentage change
}

export interface MetricBreakdown {
  dimension: string;
  segments: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

// ============================================
// Dashboard Engine Types
// ============================================

export type DashboardMode = 'industry' | 'role';

export interface DashboardEngineProps {
  mode: DashboardMode;
  industry?: IndustryId;
  role?: RoleId;
  timeRange?: TimeRange;
  embedded?: boolean;
  onMetricClick?: (metricId: MetricId) => void;
}

export interface IndustryConfig {
  id: IndustryId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface RoleConfig {
  id: RoleId;
  name: string;
  description: string;
  icon: string;
}

// ============================================
// Filter Types
// ============================================

export interface DashboardFilters {
  timeRange: TimeRange;
  segments?: Record<string, string>;
  search?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

// ============================================
// Widget Layout Types
// ============================================

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  metricId: MetricId;
  position: WidgetPosition;
  pinned?: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface MetricApiResponse {
  metricId: MetricId;
  data: MetricDataset;
  breakdowns?: MetricBreakdown[];
  loading: boolean;
  error?: string;
}

// ============================================
// Detail Modal Types
// ============================================

export interface MetricDetailProps {
  metric: MetricConfig;
  data: MetricDataset;
  breakdowns: MetricBreakdown[];
  isOpen: boolean;
  onClose: () => void;
}

