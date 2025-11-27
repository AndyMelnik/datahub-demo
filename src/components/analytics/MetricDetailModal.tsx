import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import type { MetricConfig, MetricDataset, MetricBreakdown } from '../../types/analytics';
import { fetchMetricBreakdowns } from '../../config/dummyData';

interface MetricDetailModalProps {
  metric: MetricConfig | null;
  data: MetricDataset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  metric,
  data,
  isOpen,
  onClose,
}) => {
  const [breakdowns, setBreakdowns] = useState<MetricBreakdown[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<string>('region');

  useEffect(() => {
    if (isOpen && metric) {
      setLoading(true);
      fetchMetricBreakdowns(metric.id).then(data => {
        setBreakdowns(data);
        setLoading(false);
      });
    }
  }, [isOpen, metric]);

  if (!isOpen || !metric || !data) return null;

  const formatValue = (value: number): string => {
    const { format, unit } = metric;
    let formatted = value.toFixed(format?.decimals ?? 1);
    
    if (format?.prefix) formatted = format.prefix + formatted;
    if (format?.suffix) formatted = formatted + format.suffix;
    
    if (unit === 'currency' && !format?.prefix) {
      formatted = '$' + formatted;
    }
    
    return formatted;
  };

  const chartData = data.series.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    value: point.value,
  }));

  const currentBreakdown = breakdowns.find(b => b.dimension === selectedBreakdown);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl"
        style={{ background: 'var(--surface-1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 flex items-start justify-between p-6 border-b"
          style={{ 
            background: 'var(--surface-1)', 
            borderColor: 'var(--border)' 
          }}
        >
          <div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {metric.label}
            </h2>
            <p 
              className="mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {metric.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  background: 'var(--primary-light)', 
                  color: 'var(--primary)' 
                }}
              >
                {metric.industry.replace('_', ' ')}
              </span>
              {metric.group && (
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    background: 'var(--surface-2)', 
                    color: 'var(--text-secondary)' 
                  }}
                >
                  {metric.group}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Value & Trend */}
          <div className="grid grid-cols-3 gap-4">
            <div 
              className="p-4 rounded-lg"
              style={{ background: 'var(--surface-2)' }}
            >
              <p 
                className="text-sm font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Current Value
              </p>
              <p 
                className="text-3xl font-bold mt-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatValue(data.currentValue)}
              </p>
            </div>
            <div 
              className="p-4 rounded-lg"
              style={{ background: 'var(--surface-2)' }}
            >
              <p 
                className="text-sm font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Previous Period
              </p>
              <p 
                className="text-3xl font-bold mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {formatValue(data.previousValue)}
              </p>
            </div>
            <div 
              className="p-4 rounded-lg"
              style={{ background: 'var(--surface-2)' }}
            >
              <p 
                className="text-sm font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Trend
              </p>
              <p 
                className={`text-3xl font-bold mt-1 ${
                  data.trend >= 0 
                    ? metric.directionality === 'higher_is_better' 
                      ? 'text-emerald-600' 
                      : 'text-red-500'
                    : metric.directionality === 'higher_is_better'
                      ? 'text-red-500'
                      : 'text-emerald-600'
                }`}
              >
                {data.trend >= 0 ? '+' : ''}{data.trend.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Main Chart */}
          <div 
            className="p-4 rounded-lg"
            style={{ background: 'var(--surface-2)' }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Trend Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="var(--text-muted)"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="var(--text-muted)"
                />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [formatValue(value), metric.label]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={metric.label}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdowns */}
          <div 
            className="p-4 rounded-lg"
            style={{ background: 'var(--surface-2)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Breakdown by Dimension
              </h3>
              <select
                value={selectedBreakdown}
                onChange={(e) => setSelectedBreakdown(e.target.value)}
                className="px-3 py-1.5 rounded-lg border text-sm"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {breakdowns.map(b => (
                  <option key={b.dimension} value={b.dimension}>
                    {b.dimension.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <div 
                  className="animate-spin rounded-full h-8 w-8 border-2"
                  style={{ 
                    borderColor: 'var(--primary)',
                    borderTopColor: 'transparent'
                  }}
                />
              </div>
            ) : currentBreakdown ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={currentBreakdown.segments} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--text-muted)" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80}
                    tick={{ fontSize: 12 }}
                    stroke="var(--text-muted)"
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                    }}
                    formatter={(value: number) => [value, 'Value']}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>

          {/* Business Value */}
          <div 
            className="p-4 rounded-lg"
            style={{ 
              background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
              border: '1px solid #c7d2fe'
            }}
          >
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: '#4338ca' }}
            >
              💡 Why This Metric Matters
            </h3>
            <p style={{ color: '#4338ca' }}>
              {metric.businessValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

