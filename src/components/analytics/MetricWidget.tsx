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
} from 'recharts';
import { Card } from '../ui/Card';
import type { MetricConfig, MetricDataset } from '../../types/analytics';

interface MetricWidgetProps {
  metric: MetricConfig;
  data: MetricDataset;
  onClick?: () => void;
  compact?: boolean;
}

// Color styles matching Fleet dashboard KPICard
const colorStyles = {
  blue: {
    bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    text: '#1e3a8a',
  },
  gray: {
    bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    text: '#334155',
  },
};

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

  // Determine color based on metric directionality (blue for positive metrics, gray for caution metrics)
  const getColorStyle = () => {
    if (metric.directionality === 'lower_is_better') {
      return colorStyles.gray;
    }
    return colorStyles.blue;
  };

  const styles = getColorStyle();

  const renderChart = () => {
    if (data.series.length === 0) return null;

    const chartData = data.series.slice(-14).map(point => ({
      date: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: point.value,
    }));

    const height = compact ? 60 : 100;
    const chartColor = metric.directionality === 'lower_is_better' ? '#64748b' : '#60a5fa';

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
                stroke={chartColor}
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
              <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'gauge':
        const percentage = metric.unit === 'percentage' 
          ? data.currentValue 
          : Math.min(100, (data.currentValue / (metric.thresholds?.warning || 100)) * 100);
        return (
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div 
              className="absolute h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${percentage}%`,
                background: chartColor,
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
      className={`cursor-pointer transition-all hover:shadow-lg overflow-hidden relative ${compact ? 'p-3' : 'p-4'}`}
      hover={true}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ background: styles.bg }}
      />
      
      <div className="relative z-10" onClick={onClick}>
        {/* Title */}
        <p 
          className="text-xs font-medium mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {metric.label}
        </p>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-2">
          <p 
            className={`font-bold ${compact ? 'text-2xl' : 'text-2xl'}`}
            style={{ color: styles.text }}
          >
            {formatValue(data.currentValue)}
          </p>
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()} {Math.abs(data.trend).toFixed(1)}%
          </span>
        </div>

        {/* Subtitle/Description */}
        {!compact && metric.description && (
          <p 
            className="text-xs mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {metric.description}
          </p>
        )}

        {/* Chart */}
        {renderChart()}
      </div>
    </Card>
  );
};
