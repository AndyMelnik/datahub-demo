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
      {/* Compact Header with All Controls */}
      <div 
        className="sticky top-0 z-20"
        style={{ 
          background: 'var(--surface-1)', 
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div className="px-4 py-3">
          {/* Title Row - Only if not compact */}
          {!compactHeader && (
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h1 
                  className="text-lg font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {currentConfig.name} Analytics
                </h1>
                <p 
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {metrics.length} metrics
                </p>
              </div>
            </div>
          )}

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div 
              className="flex rounded-lg p-0.5"
              style={{ background: 'var(--surface-2)' }}
            >
              <button
                onClick={() => setViewMode('industry')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'industry'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Industry
              </button>
              <button
                onClick={() => setViewMode('role')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'role'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Role
              </button>
            </div>

            {/* Industry/Role Selector */}
            {viewMode === 'industry' ? (
              <div className="flex items-center gap-1 overflow-x-auto">
                {Object.values(INDUSTRIES).map(industry => (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry.id)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                      selectedIndustry === industry.id
                        ? 'text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={selectedIndustry === industry.id ? { background: industry.color } : {}}
                  >
                    {industry.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 overflow-x-auto">
                {Object.values(ROLES).map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                      selectedRole === role.id
                        ? 'text-white shadow-sm bg-indigo-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
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
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-10 w-10 mx-auto mb-3"
              style={{ 
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: currentConfig.color,
                borderTopColor: 'transparent'
              }}
            />
            <p style={{ color: 'var(--text-muted)' }}>Loading metrics...</p>
          </div>
        </div>
      ) : (
        /* Metrics Grid */
        <div className="px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

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

