# Analytics Dashboard System

This document explains the industry and role-based analytics dashboard system, how to extend it, and how to embed it.

## Overview

The analytics dashboard system provides:
- **Industry-specific dashboards** for Logistics, Heavy Machinery, Cold Chain, and Leasing
- **Role-based dashboards** for Fleet Operations Manager, Maintenance Manager, Safety & Compliance Manager, Security Manager, and Operations Director
- **Shared dashboard engine** that renders metrics based on configuration
- **Embeddable iframe version** with URL parameter support

## Architecture

```
src/
├── config/
│   ├── metrics.ts       # All metric definitions
│   ├── industries.ts    # Industry configurations
│   ├── roles.ts         # Role configurations
│   └── dummyData.ts     # Dummy data generation
├── types/
│   └── analytics.ts     # TypeScript definitions
├── components/
│   └── analytics/
│       ├── DashboardEngine.tsx    # Core engine
│       ├── MetricWidget.tsx       # Metric cards
│       ├── MetricDetailModal.tsx  # Detail view
│       └── TimeRangeSelector.tsx  # Time filter
├── pages/
│   ├── AnalyticsHome.tsx      # Landing page
│   ├── IndustryDashboard.tsx  # Industry view
│   ├── RoleDashboard.tsx      # Role view
│   └── EmbedDashboard.tsx     # Embeddable version
```

## Adding a New Metric

To add a new metric, simply add an entry to `src/config/metrics.ts`:

```typescript
{
  id: 'my_new_metric',
  label: 'My New Metric',
  description: 'What this metric measures',
  businessValue: 'Why this metric matters for business',
  industry: 'logistics',           // Which industry
  roles: ['fleet_operations_manager'], // Which roles see it
  group: 'Efficiency',             // Category grouping
  unit: 'percentage',              // number, currency, percentage, duration, etc.
  directionality: 'higher_is_better', // or 'lower_is_better' or 'neutral'
  chartType: 'timeseries',         // kpi, timeseries, bar, pie, gauge
  defaultTimeRange: '30d',
  tags: ['efficiency', 'fuel'],
  thresholds: { warning: 80, critical: 60 },
  format: { decimals: 1, suffix: '%' },
}
```

**No component changes required!** The dashboard engine automatically picks up new metrics.

## Adding a New Industry

1. Add to `src/types/analytics.ts`:
```typescript
export type IndustryId = 
  | 'logistics' 
  | 'heavy_machinery' 
  | 'cold_chain' 
  | 'leasing'
  | 'my_new_industry';  // Add here
```

2. Add configuration to `src/config/industries.ts`:
```typescript
my_new_industry: {
  id: 'my_new_industry',
  name: 'My New Industry',
  description: 'Description of the industry',
  icon: '🏭',
  color: '#10b981',
}
```

3. Add metrics for the new industry in `src/config/metrics.ts`

## Adding a New Role

1. Add to `src/types/analytics.ts`:
```typescript
export type RoleId = 
  | 'fleet_operations_manager'
  | 'maintenance_manager'
  | 'my_new_role';  // Add here
```

2. Add configuration to `src/config/roles.ts`:
```typescript
my_new_role: {
  id: 'my_new_role',
  name: 'My New Role',
  description: 'What this role does',
  icon: '👷',
}
```

3. Add the role to relevant metrics' `roles` array in `src/config/metrics.ts`

## Embedding the Dashboard

### Basic Embed

```html
<iframe 
  src="https://your-domain.com/embed?mode=industry&industry=logistics&timeRange=30d"
  width="100%"
  height="600"
  style="border: none;"
></iframe>
```

### URL Parameters

| Parameter | Required | Values | Description |
|-----------|----------|--------|-------------|
| `mode` | Yes | `industry`, `role` | Dashboard type |
| `industry` | If mode=industry | `logistics`, `heavy_machinery`, `cold_chain`, `leasing` | Industry ID |
| `role` | If mode=role | `fleet_operations_manager`, `maintenance_manager`, etc. | Role ID |
| `timeRange` | No | `7d`, `30d`, `90d`, `12m` | Time period (default: 30d) |

### Example Embeds

**Industry Dashboard:**
```html
<iframe 
  src="https://your-domain.com/embed?mode=industry&industry=logistics"
  width="100%" 
  height="800"
></iframe>
```

**Role Dashboard:**
```html
<iframe 
  src="https://your-domain.com/embed?mode=role&role=fleet_operations_manager"
  width="100%" 
  height="800"
></iframe>
```

**With Custom Time Range:**
```html
<iframe 
  src="https://your-domain.com/embed?mode=industry&industry=cold_chain&timeRange=90d"
  width="100%" 
  height="800"
></iframe>
```

### Communication with Embed

The embedded dashboard sends postMessage events:

```javascript
window.addEventListener('message', function(event) {
  if (event.data.source === 'navixy-analytics') {
    if (event.data.type === 'analytics-dashboard-ready') {
      console.log('Dashboard ready');
    }
    if (event.data.type === 'analytics-dashboard-resize') {
      console.log('Dashboard height:', event.data.height);
    }
  }
});
```

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Fleet management dashboard (original) |
| `/analytics` | Analytics home page |
| `/industry` | Industry dashboard selector |
| `/industry?id=logistics` | Direct to specific industry |
| `/role` | Role dashboard selector |
| `/role?id=fleet_operations_manager` | Direct to specific role |
| `/embed?mode=industry&industry=...` | Embeddable industry dashboard |
| `/embed?mode=role&role=...` | Embeddable role dashboard |

## Configuration Reference

### Metric Units
- `number` - Plain numbers
- `currency` - Dollar amounts
- `percentage` - Percentages (0-100)
- `duration` - Time durations
- `hours` - Hours
- `distance` - Distance measurements
- `speed` - Speed measurements
- `ratio` - Ratios

### Chart Types
- `kpi` - Simple KPI card with value
- `timeseries` - Line chart over time
- `bar` - Bar chart
- `pie` - Pie chart
- `gauge` - Progress gauge
- `table` - Data table
- `funnel` - Funnel visualization
- `heatmap` - Heat map

### Directionality
- `higher_is_better` - Green when increasing
- `lower_is_better` - Green when decreasing
- `neutral` - No color indication

## Data Layer

The system uses a simulated API layer in `src/config/dummyData.ts`:

```typescript
// Fetch single metric data
const data = await fetchMetricData('vehicle_utilization_rate', '30d');

// Fetch multiple metrics
const data = await fetchMultipleMetrics(['metric1', 'metric2'], '30d');

// Fetch breakdowns
const breakdowns = await fetchMetricBreakdowns('vehicle_utilization_rate');
```

To connect to real APIs, replace these functions with actual API calls. The response shapes are typed in `src/types/analytics.ts`.

## Styling

The dashboard uses CSS variables defined in `src/index.css`:

```css
:root {
  --surface-1: #ffffff;
  --surface-2: #e8f0f7;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --primary: #6366f1;
  --border: #e2e8f0;
  /* ... more variables */
}
```

## Development

```bash
# Start development server
npm run dev

# View analytics home
# http://localhost:3000/analytics

# View industry dashboard
# http://localhost:3000/industry

# View role dashboard
# http://localhost:3000/role

# Test embed
# http://localhost:3000/embed?mode=industry&industry=logistics
```

## Testing

Key functions to test:

1. **Metric filtering** - `getMetricsByIndustry()`, `getMetricsByRole()`
2. **Time range filtering** - `generateMetricDataset()` with different ranges
3. **URL parameter parsing** - `EmbedDashboard` component
4. **Data generation** - `generateTimeSeries()` determinism

## File Size Considerations

The analytics system adds:
- ~15KB for type definitions
- ~25KB for metric configurations
- ~10KB for dummy data generation
- ~40KB for dashboard components

Total: ~90KB additional (before minification)

## Metrics Included

### Logistics Industry
- Vehicle Utilization Rate
- Idle Time
- TCO / Maintenance Cost per Mile
- Stops per Trip
- Dwell Time
- On-Time Delivery Rate
- Preventive Maintenance Compliance
- Speeding Incidents
- Geofence Alerts

### Heavy Machinery Industry
- Equipment Utilization Rate
- Idle Time %
- Geofence Compliance
- Equipment Availability
- MTTR (Mean Time to Repair)
- Preventive Maintenance Compliance
- Maintenance Cost per Operating Hour
- Overspeed Incidents
- Geofence Safety Alerts
- After-Hours Usage
- Tampering Alerts
- Overall Fleet Utilization
- Total Fleet Downtime

### Cold Chain Industry
- Real-Time Fleet Status
- On-Time Delivery Rate
- Temperature / Equipment Alerts
- Door Open / Reefer Status
- Vehicle Dwell Time
- Fleet Utilization & Availability
- Cost per Mile / Shipment
- Compliance Dashboard

### Leasing Industry
- Idle Time %
- Avg Distance/Hours per Vehicle
- Vehicle Availability/Uptime
- Route Plan vs Actual
- Empty Miles %
- Stops/Deliveries per Day
- Downtime (Planned + Unplanned)
- MTBF
- Maintenance Cost per Mile
- Harsh Events Count
- Speeding Violations

---

Built for Navixy Fleet Management Platform

