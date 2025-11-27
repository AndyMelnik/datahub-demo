import React, { useState, useEffect, useMemo } from 'react';
import { MetricWidget } from './MetricWidget';
import { MetricDetailModal } from './MetricDetailModal';
import { TimeRangeSelector } from './TimeRangeSelector';
import type { 
  TimeRange, 
  MetricConfig, 
  MetricDataset,
  MetricId,
  IndustryId,
  RoleId,
} from '../../types/analytics';
import { getMetricsByIndustry, getMetricsByRole } from '../../config/metrics';
import { fetchMultipleMetrics } from '../../config/dummyData';
import { INDUSTRIES } from '../../config/industries';
import { ROLES } from '../../config/roles';

type ViewMode = 'industry' | 'role';

interface UnifiedDashboardProps {
  defaultMode?: ViewMode;
  defaultIndustry?: IndustryId;
  defaultRole?: RoleId;
  defaultTimeRange?: TimeRange;
  embedded?: boolean;
  compactHeader?: boolean;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  defaultMode = 'industry',
  defaultIndustry = 'logistics',
  defaultRole = 'fleet_operations_manager',
  defaultTimeRange = '30d',
  embedded = false,
  compactHeader = false,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId>(defaultIndustry);
  const [selectedRole, setSelectedRole] = useState<RoleId>(defaultRole);
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);
  const [metricsData, setMetricsData] = useState<Record<MetricId, MetricDataset>>({});
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricConfig | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get metrics based on current view
  const metrics = useMemo((): MetricConfig[] => {
    if (viewMode === 'industry') {
      return getMetricsByIndustry(selectedIndustry);
    } else {
      return getMetricsByRole(selectedRole);
    }
  }, [viewMode, selectedIndustry, selectedRole]);


  // Load metrics data
  useEffect(() => {
    const loadData = async () => {
      if (metrics.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const metricIds = metrics.map(m => m.id);
        const data = await fetchMultipleMetrics(metricIds, timeRange);
        setMetricsData(data);
      } catch (error) {
        console.error('Failed to load metrics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [metrics, timeRange]);

  // Get current config info
  const currentConfig = useMemo(() => {
    if (viewMode === 'industry') {
      const industry = INDUSTRIES[selectedIndustry];
      return {
        name: industry.name,
        color: industry.color,
      };
    } else {
      const role = ROLES[selectedRole];
      return {
        name: role.name,
        color: '#6366f1',
      };
    }
  }, [viewMode, selectedIndustry, selectedRole]);

  const handleMetricClick = (metric: MetricConfig) => {
    setSelectedMetric(metric);
    setModalOpen(true);
  };

  return (
    <div 
      className={embedded ? '' : 'min-h-screen'}
      style={{ background: 'var(--surface-2)' }}
    >
      {/* Header - matching Fleet dashboard style */}
      <header 
        className="shadow-sm"
        style={{ 
          background: 'var(--surface-1)', 
          borderBottom: '1px solid var(--border)' 
        }}
      >
        <div className="mx-auto px-6 py-4">
          {/* Title Row */}
          {!compactHeader && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {currentConfig.name} Analytics
                </h1>
                <p 
                  className="mt-1 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {metrics.length} metrics available
                </p>
              </div>
            </div>
          )}

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                View:
              </span>
              <div 
                className="flex rounded-lg p-0.5"
                style={{ background: 'var(--surface-2)' }}
              >
                <button
                  onClick={() => setViewMode('industry')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'industry'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-white/50'
                  }`}
                  style={{ color: viewMode === 'industry' ? '#1e3a8a' : 'var(--text-muted)' }}
                >
                  Industry
                </button>
                <button
                  onClick={() => setViewMode('role')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'role'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-white/50'
                  }`}
                  style={{ color: viewMode === 'role' ? '#1e3a8a' : 'var(--text-muted)' }}
                >
                  Role
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px" style={{ background: 'var(--border)' }} />

            {/* Industry/Role Selector */}
            {viewMode === 'industry' ? (
              <div className="flex items-center gap-2 overflow-x-auto">
                {Object.values(INDUSTRIES).map(industry => (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all border ${
                      selectedIndustry === industry.id
                        ? 'text-white shadow-sm border-transparent'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={selectedIndustry === industry.id 
                      ? { background: '#60a5fa', color: 'white' } 
                      : { background: 'var(--surface-1)', color: 'var(--text-secondary)' }
                    }
                  >
                    {industry.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto">
                {Object.values(ROLES).map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all border ${
                      selectedRole === role.id
                        ? 'text-white shadow-sm border-transparent'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={selectedRole === role.id 
                      ? { background: '#60a5fa', color: 'white' } 
                      : { background: 'var(--surface-1)', color: 'var(--text-secondary)' }
                    }
                  >
                    {role.name.replace(' Manager', '').replace(' Director', '')}
                  </button>
                ))}
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Time Range */}
            <TimeRangeSelector 
              value={timeRange} 
              onChange={setTimeRange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto px-6 py-6">
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div 
                className="animate-spin rounded-full h-16 w-16 mx-auto mb-4"
                style={{ 
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'var(--primary)',
                  borderTopColor: 'transparent'
                }}
              />
              <p 
                className="text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                Loading metrics...
              </p>
            </div>
          </div>
        ) : (
          /* Metrics Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {metrics.map(metric => (
              <MetricWidget
                key={metric.id}
                metric={metric}
                data={metricsData[metric.id] || {
                  metricId: metric.id,
                  series: [],
                  currentValue: 0,
                  previousValue: 0,
                  trend: 0,
                }}
                onClick={() => handleMetricClick(metric)}
                compact={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <MetricDetailModal
        metric={selectedMetric}
        data={selectedMetric ? metricsData[selectedMetric.id] : null}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMetric(null);
        }}
      />
    </div>
  );
};

export default UnifiedDashboard;

