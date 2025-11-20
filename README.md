# Fleet Management Dashboard Demo

An interactive, real-time fleet management dashboard built with React, TypeScript, and modern data visualization libraries. This dashboard provides comprehensive insights into fleet operations with multiple chart types and metrics.

## 🚀 Features

### 🎯 Interactive Controls (NEW!)
- **Filter by Group**: Select specific vehicle groups to focus analysis
- **Filter by Department**: Filter fleet by department (Delivery, Logistics, Drivers, Sales)
- **Vehicle/Driver Search**: Quick search and selection of individual vehicles or drivers
- **Detailed Vehicle View**: Comprehensive analysis of selected vehicle with:
  - Real-time telemetry data
  - Battery and fuel level gauges
  - Complete vehicle information
  - Active alerts and warnings
  - Driver details
- **Dynamic Updates**: All charts and metrics update based on filter selections

### Executive Summary
- **Total Fleet Metrics**: Overview of total vehicles, active/idle status, and online/offline states
- **Real-time KPIs**: Moving vehicles, average speed, low fuel/battery alerts, overspeeding detection

### Fleet Condition Overview
- Vehicle status distribution (moving, stopped, parked)
- Connection status visualization (online, offline, idle)
- Interactive pie charts for quick insights

### Operational Distribution
- **Speed Distribution**: Vehicles grouped by speed ranges (0, 1-30, 31-60, 61+ km/h)
- **Fuel Level Distribution**: Fuel status across the fleet (0-25%, 26-50%, 51-75%, 76-100%)
- **Battery Level Distribution**: Battery health monitoring

### Asset Group Breakdown
- Vehicles by department with performance metrics
- Top 10 vehicle models in the fleet
- Connection status by group (stacked bar charts)

### Department Performance Metrics
- Heatmap visualization of department performance
- Average speed, fuel, battery levels per department
- Offline rate monitoring

### Geographic Distribution
- Vehicles by zone/location
- Zone distribution pie chart

### Exception & Risk Monitoring
- Real-time alert table for vehicles requiring attention
- Filters for: overspeeding, offline vehicles, low battery, low fuel
- Color-coded severity indicators

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Variables (Modern Design System)
- **Charts**: Recharts
- **Data Processing**: PapaParse (CSV parsing)
- **UI Components**: Custom Card components with modern design

### Design System

The dashboard uses a professional design system with:
- **CSS Variables** for consistent theming (colors, surfaces, borders)
- **Modern Card Components** with shadows and hover effects
- **Gradient Backgrounds** for KPI cards
- **Consistent Typography** and spacing
- **Smooth Transitions** and animations
- **Professional Color Palette** optimized for data visualization

## 📦 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/AndyMelnik/datahub-demo.git
cd datahub-demo
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## 🏗️ Build for Production

Build the dashboard for production deployment:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
navixy-lp/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx         # Main dashboard component
│   │   ├── KPICard.tsx           # Key performance indicator cards
│   │   ├── StatusDistributionChart.tsx  # Pie charts
│   │   ├── BarChartComponent.tsx # Vertical bar charts
│   │   ├── HorizontalBarChart.tsx # Horizontal stacked bars
│   │   ├── ExceptionTable.tsx    # Alert/exception table
│   │   └── MetricsHeatmap.tsx    # Department metrics heatmap
│   ├── types/
│   │   └── fleet.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── dataProcessor.ts      # Data processing functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── data_sample.csv           # Sample fleet data
├── index.html                     # Dashboard entry point
├── landing.html                   # Landing page with embedded dashboard
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎮 Using Interactive Features

### Filtering Data

1. **Group Filter**: Use the dropdown to select a specific vehicle group
   - All groups are automatically detected from your data
   - Charts and metrics update instantly

2. **Department Filter**: Filter vehicles by department
   - Choose from Delivery, Logistics, Drivers, Sales, or other departments in your data
   - Can be combined with group filter for precise analysis

3. **Reset Filters**: Click "Reset Filters" to return to viewing all vehicles

### Vehicle Detail Analysis

1. **Search**: Type vehicle name, driver name, or vehicle ID in the search box
2. **Select**: Click on any vehicle from the dropdown results
3. **View Details**: See comprehensive information including:
   - Current speed and connection status
   - Battery and fuel levels with visual gauges
   - Complete telemetry data
   - Vehicle and driver information
   - Active alerts and warnings
4. **Clear Selection**: Click "Clear Selection" to return to fleet overview

### Filter Combination

- Filters can be combined for targeted analysis
- Example: View all "Logistics" department vehicles in "Office Berlin" group
- Active filters are displayed as removable badges
- Vehicle count updates to show filtered results

## 📊 Data Format

The dashboard expects CSV data with the following columns:

```csv
object_id,device_id,object_label,model,first_name,last_name,speed,device_time,platform_time,moving_status,connection_status,last_connect_formatted,battery_level,zone_label,group_label,department_label,fuel_level_%,odometer
```

### Key Fields:
- **object_id**: Unique vehicle identifier
- **speed**: Current speed in km/h
- **moving_status**: moving | stopped | parked
- **connection_status**: online | offline | idle
- **battery_level**: Battery percentage (0-100)
- **fuel_level_%**: Fuel percentage (0-100)
- **department_label**: Department assignment
- **group_label**: Group assignment
- **zone_label**: Geographic zone

## 🎨 Customization

### Thresholds

You can customize alert thresholds in `src/utils/dataProcessor.ts`:

```typescript
const SPEED_THRESHOLD = 80;           // Overspeeding limit
const LOW_BATTERY_THRESHOLD = 20;     // Low battery warning
const CRITICAL_BATTERY_THRESHOLD = 13; // Critical battery alert
const LOW_FUEL_THRESHOLD = 25;        // Low fuel warning
```

### Colors

Modify color schemes in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Main brand color
    // ... other shades
  },
}
```

## 🌐 Embedding in Landing Page

The project includes `landing.html` which demonstrates how to embed the dashboard:

```html
<iframe 
  src="index.html" 
  class="w-full h-full border-0"
  title="Fleet Management Dashboard Demo">
</iframe>
```

Open `landing.html` in your browser to see the complete landing page with the embedded dashboard.

## 📈 Dashboard Sections

1. **Executive Summary**: 8 KPI cards with critical metrics
2. **Fleet Condition Overview**: 2 pie charts for status distribution
3. **Operational Distribution**: 3 bar charts for speed/fuel/battery
4. **Asset Group Breakdown**: Department and model analytics
5. **Department Performance Metrics**: Heatmap with performance indicators
6. **Geographic Distribution**: Zone-based vehicle distribution
7. **Exception & Risk Monitoring**: Detailed exception table

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** (recommended) for code formatting

## 📝 License

This project is part of the Navixy fleet management platform demonstration.

## 🤝 Contributing

This is a demo project. For production use with Navixy platform, please contact [Navixy](https://www.navixy.com).

## 📞 Support

For questions or support regarding the Navixy platform:
- Website: https://www.navixy.com
- Documentation: https://docs.navixy.com

## 🎯 Use Cases

This dashboard demo is perfect for:
- **Fleet Managers**: Monitor vehicle health and performance
- **Operations Teams**: Track real-time status and exceptions
- **Executives**: View high-level KPIs and trends
- **Sales Demonstrations**: Showcase dashboard capabilities
- **Landing Pages**: Embed interactive demo for customer trials

---

Built with ❤️ using React + TypeScript + Vite

