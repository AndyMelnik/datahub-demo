import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '../ui/Card';
import type { MetricConfig, MetricDataset } from '../../types/analytics';

interface MetricWidgetProps {
  metric: MetricConfig;
  data: MetricDataset;
  onClick?: () => void;
  compact?: boolean;
}

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export const MetricWidget: React.FC<MetricWidgetProps> = ({
  metric,
  data,
  onClick,
  compact = false,
}) => {
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

  const getTrendColor = (): string => {
    if (data.trend === 0) return 'text-gray-500';
    
    const isPositive = data.trend > 0;
    const isGood = metric.directionality === 'higher_is_better' 
      ? isPositive 
      : !isPositive;
    
    return isGood ? 'text-emerald-600' : 'text-red-500';
  };

  const getTrendIcon = (): string => {
    if (data.trend === 0) return '→';
    return data.trend > 0 ? '↑' : '↓';
  };

  const getStatusColor = (): string => {
    const { thresholds, directionality } = metric;
    if (!thresholds) return 'bg-gray-100';
    
    const value = data.currentValue;
    const isHigherBetter = directionality === 'higher_is_better';
    
    if (isHigherBetter) {
      if (thresholds.critical && value < thresholds.critical) return 'bg-red-100 border-red-300';
      if (thresholds.warning && value < thresholds.warning) return 'bg-amber-100 border-amber-300';
      return 'bg-emerald-100 border-emerald-300';
    } else {
      if (thresholds.critical && value > thresholds.critical) return 'bg-red-100 border-red-300';
      if (thresholds.warning && value > thresholds.warning) return 'bg-amber-100 border-amber-300';
      return 'bg-emerald-100 border-emerald-300';
    }
  };

  const renderChart = () => {
    if (data.series.length === 0) return null;

    const chartData = data.series.slice(-14).map(point => ({
      date: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: point.value,
    }));

    const height = compact ? 60 : 120;

    switch (metric.chartType) {
      case 'timeseries':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }} 
                interval="preserveStartEnd"
                stroke="var(--text-muted)"
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [formatValue(value), metric.label]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData.slice(-7)}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                stroke="var(--text-muted)"
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [formatValue(value), metric.label]}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = chartData.slice(-5).map((d, i) => ({
          ...d,
          fill: CHART_COLORS[i % CHART_COLORS.length],
        }));
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="date"
                cx="50%"
                cy="50%"
                outerRadius={height / 3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'gauge':
        const percentage = metric.unit === 'percentage' 
          ? data.currentValue 
          : Math.min(100, (data.currentValue / (metric.thresholds?.warning || 100)) * 100);
        return (
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${percentage}%`,
                background: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        );

      case 'kpi':
      default:
        return null;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${getStatusColor()} ${compact ? 'p-3' : 'p-4'}`}
      hover={true}
    >
      <div onClick={onClick}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 
              className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`}
              style={{ color: 'var(--text-primary)' }}
            >
              {metric.label}
            </h3>
            {!compact && (
              <p 
                className="text-xs mt-0.5 truncate"
                style={{ color: 'var(--text-muted)' }}
              >
                {metric.description}
              </p>
            )}
          </div>
          {metric.group && (
            <span 
              className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
              style={{ 
                background: 'var(--primary-light)', 
                color: 'var(--primary)' 
              }}
            >
              {metric.group}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-3 mb-3">
          <span 
            className={`font-bold ${compact ? 'text-2xl' : 'text-3xl'}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {formatValue(data.currentValue)}
          </span>
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()} {Math.abs(data.trend).toFixed(1)}%
          </span>
        </div>

        {/* Chart */}
        {renderChart()}

        {/* Footer */}
        {!compact && (
          <div 
            className="flex items-center justify-between mt-3 pt-3 text-xs"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <span style={{ color: 'var(--text-muted)' }}>
              vs previous period
            </span>
            <span 
              className="text-xs font-medium"
              style={{ color: 'var(--primary)' }}
            >
              View details →
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

