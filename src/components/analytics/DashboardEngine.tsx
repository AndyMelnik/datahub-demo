import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MetricWidget } from './MetricWidget';
import { MetricDetailModal } from './MetricDetailModal';
import { TimeRangeSelector } from './TimeRangeSelector';
import type { 
  DashboardEngineProps, 
  TimeRange, 
  MetricConfig, 
  MetricDataset,
  MetricId,
} from '../../types/analytics';
import { 
  getMetricsByIndustry, 
  getMetricsByRole,
  searchMetrics,
} from '../../config/metrics';
import { fetchMultipleMetrics } from '../../config/dummyData';
import { getIndustryById, INDUSTRIES } from '../../config/industries';
import { getRoleById, ROLES } from '../../config/roles';

export const DashboardEngine: React.FC<DashboardEngineProps> = ({
  mode,
  industry,
  role,
  timeRange: initialTimeRange = '30d',
  embedded = false,
  onMetricClick,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [metricsData, setMetricsData] = useState<Record<MetricId, MetricDataset>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<MetricConfig | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Resolve metrics based on mode
  const metrics = useMemo((): MetricConfig[] => {
    let result: MetricConfig[] = [];
    
    if (mode === 'industry' && industry) {
      result = getMetricsByIndustry(industry);
    } else if (mode === 'role' && role) {
      result = getMetricsByRole(role);
    }
    
    // Apply search filter
    if (searchQuery) {
      const searchResults = searchMetrics(searchQuery);
      result = result.filter(m => searchResults.some(s => s.id === m.id));
    }
    
    // Apply group filter
    if (selectedGroup !== 'all') {
      result = result.filter(m => m.group === selectedGroup);
    }
    
    return result;
  }, [mode, industry, role, searchQuery, selectedGroup]);

  // Get unique groups for filter
  const availableGroups = useMemo(() => {
    let baseMetrics: MetricConfig[] = [];
    if (mode === 'industry' && industry) {
      baseMetrics = getMetricsByIndustry(industry);
    } else if (mode === 'role' && role) {
      baseMetrics = getMetricsByRole(role);
    }
    const groups = new Set(baseMetrics.map(m => m.group).filter(Boolean));
    return ['all', ...Array.from(groups)] as string[];
  }, [mode, industry, role]);

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

  // Handle metric click
  const handleMetricClick = useCallback((metric: MetricConfig) => {
    if (onMetricClick) {
      onMetricClick(metric.id);
    }
    setSelectedMetric(metric);
    setModalOpen(true);
  }, [onMetricClick]);

  // Get header info
  const headerInfo = useMemo(() => {
    if (mode === 'industry' && industry) {
      const industryConfig = getIndustryById(industry);
      return {
        icon: industryConfig?.icon || '📊',
        title: industryConfig?.name || 'Dashboard',
        description: industryConfig?.description || '',
        color: industryConfig?.color || '#6366f1',
      };
    } else if (mode === 'role' && role) {
      const roleConfig = getRoleById(role);
      return {
        icon: roleConfig?.icon || '👤',
        title: roleConfig?.name || 'Dashboard',
        description: roleConfig?.description || '',
        color: '#6366f1',
      };
    }
    return {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Select an industry or role to view metrics',
      color: '#6366f1',
    };
  }, [mode, industry, role]);

  // Group metrics by category
  const groupedMetrics = useMemo(() => {
    const groups: Record<string, MetricConfig[]> = {};
    
    for (const metric of metrics) {
      const group = metric.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(metric);
    }
    
    return groups;
  }, [metrics]);

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center ${embedded ? 'min-h-[400px]' : 'min-h-screen'}`}
        style={{ background: 'var(--surface-2)' }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            style={{ 
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'var(--primary)',
              borderTopColor: 'transparent'
            }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={embedded ? '' : 'min-h-screen'}
      style={{ background: 'var(--surface-2)' }}
    >
      {/* Header */}
      {!embedded && (
        <header 
          className="shadow-sm"
          style={{ 
            background: 'var(--surface-1)', 
            borderBottom: '1px solid var(--border)' 
          }}
        >
          <div className="mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{headerInfo.icon}</span>
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {headerInfo.title}
                </h1>
                <p 
                  className="mt-1 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {headerInfo.description}
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Filter Bar */}
      <div 
        className={`${embedded ? '' : 'sticky top-0 z-10'}`}
        style={{ 
          background: 'var(--surface-1)', 
          borderBottom: '1px solid var(--border)' 
        }}
      >
        <div className="mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Time Range */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Time Range:
              </span>
              <TimeRangeSelector 
                value={timeRange} 
                onChange={setTimeRange}
              />
            </div>

            {/* Group Filter */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Group:
              </span>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-1.5 rounded-lg border text-sm"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {availableGroups.map(group => (
                  <option key={group} value={group}>
                    {group === 'all' ? 'All Groups' : group}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border text-sm"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Metrics Count */}
            <span 
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              {metrics.length} metric{metrics.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mx-auto px-6 py-6">
        {metrics.length === 0 ? (
          <div 
            className="text-center py-12"
            style={{ color: 'var(--text-muted)' }}
          >
            <p className="text-lg">No metrics found</p>
            <p className="text-sm mt-2">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Select a different industry or role'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMetrics).map(([group, groupMetrics]) => (
              <div key={group}>
                <h2 
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span 
                    className="w-1.5 h-6 rounded-full"
                    style={{ background: headerInfo.color }}
                  />
                  {group}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupMetrics.map(metric => (
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
                      compact={embedded}
                    />
                  ))}
                </div>
              </div>
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

// ============================================
// Selector Components for Navigation
// ============================================

interface IndustrySelectorProps {
  onSelect: (industry: string) => void;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(INDUSTRIES).map(industry => (
        <button
          key={industry.id}
          onClick={() => onSelect(industry.id)}
          className="p-6 rounded-xl text-left transition-all hover:shadow-lg border"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--border)',
          }}
        >
          <span className="text-4xl">{industry.icon}</span>
          <h3 
            className="text-lg font-semibold mt-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {industry.name}
          </h3>
          <p 
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {industry.description}
          </p>
        </button>
      ))}
    </div>
  );
};

interface RoleSelectorProps {
  onSelect: (role: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(ROLES).map(role => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className="p-6 rounded-xl text-left transition-all hover:shadow-lg border"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--border)',
          }}
        >
          <span className="text-4xl">{role.icon}</span>
          <h3 
            className="text-lg font-semibold mt-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {role.name}
          </h3>
          <p 
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {role.description}
          </p>
        </button>
      ))}
    </div>
  );
};

