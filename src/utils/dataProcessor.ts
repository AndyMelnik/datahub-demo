import Papa from 'papaparse';
import type {
  FleetVehicle,
  FleetMetrics,
  StatusDistribution,
  SpeedBucket,
  DepartmentMetrics,
  GroupMetrics,
  ModelDistribution,
  ExceptionVehicle,
} from '../types/fleet';

const SPEED_THRESHOLD = 80;
const LOW_BATTERY_THRESHOLD = 12.5; // Voltage: < 12.5V is low
const CRITICAL_BATTERY_THRESHOLD = 12.0; // Voltage: < 12.0V is critical
const LOW_FUEL_THRESHOLD = 25;

export async function loadFleetData(csvPath: string): Promise<FleetVehicle[]> {
  const response = await fetch(csvPath);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Transform headers to match our interface
        if (header === 'fuel_level_%') return 'fuel_level_percent';
        return header;
      },
      transform: (value, field) => {
        // Convert numeric fields
        if (['object_id', 'device_id', 'speed', 'battery_level', 'fuel_level_percent', 'odometer'].includes(field)) {
          return parseFloat(value) || 0;
        }
        return value;
      },
      complete: (results) => {
        resolve(results.data as FleetVehicle[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function calculateFleetMetrics(vehicles: FleetVehicle[]): FleetMetrics {
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.moving_status === 'moving').length;
  const idleVehicles = vehicles.filter(v => v.moving_status === 'stopped').length;
  const parkedVehicles = vehicles.filter(v => v.moving_status === 'parked').length;
  const onlineVehicles = vehicles.filter(v => v.connection_status === 'online').length;
  const offlineVehicles = vehicles.filter(v => v.connection_status === 'offline').length;
  const movingVehicles = vehicles.filter(v => v.speed > 0).length;
  
  const movingVehiclesData = vehicles.filter(v => v.speed > 0);
  const averageSpeed = movingVehiclesData.length > 0
    ? movingVehiclesData.reduce((sum, v) => sum + v.speed, 0) / movingVehiclesData.length
    : 0;

  const lowBatteryCount = vehicles.filter(v => v.battery_level < LOW_BATTERY_THRESHOLD).length;
  const criticalBatteryCount = vehicles.filter(v => v.battery_level < CRITICAL_BATTERY_THRESHOLD).length;
  const lowFuelCount = vehicles.filter(v => v.fuel_level_percent < LOW_FUEL_THRESHOLD).length;
  const overspeedingCount = vehicles.filter(v => v.speed > SPEED_THRESHOLD).length;

  return {
    totalVehicles,
    activeVehicles,
    idleVehicles,
    parkedVehicles,
    onlineVehicles,
    offlineVehicles,
    movingVehicles,
    averageSpeed,
    lowBatteryCount,
    lowFuelCount,
    criticalBatteryCount,
    overspeedingCount,
  };
}

export function getStatusDistribution(vehicles: FleetVehicle[]): StatusDistribution[] {
  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.moving_status] = (acc[vehicle.moving_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = vehicles.length;

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: (count / total) * 100,
  }));
}

export function getConnectionDistribution(vehicles: FleetVehicle[]): StatusDistribution[] {
  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.connection_status] = (acc[vehicle.connection_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = vehicles.length;

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: (count / total) * 100,
  }));
}

export function getSpeedDistribution(vehicles: FleetVehicle[]): SpeedBucket[] {
  const buckets = [
    { range: '0 km/h', min: 0, max: 0, count: 0 },
    { range: '1-30 km/h', min: 1, max: 30, count: 0 },
    { range: '31-60 km/h', min: 31, max: 60, count: 0 },
    { range: '61+ km/h', min: 61, max: Infinity, count: 0 },
  ];

  vehicles.forEach(vehicle => {
    const bucket = buckets.find(b => vehicle.speed >= b.min && vehicle.speed <= b.max);
    if (bucket) bucket.count++;
  });

  return buckets.map(({ range, count }) => ({ range, count }));
}

export function getFuelDistribution(vehicles: FleetVehicle[]): SpeedBucket[] {
  const buckets = [
    { range: '0-25%', min: 0, max: 25, count: 0 },
    { range: '26-50%', min: 26, max: 50, count: 0 },
    { range: '51-75%', min: 51, max: 75, count: 0 },
    { range: '76-100%', min: 76, max: 100, count: 0 },
  ];

  vehicles.forEach(vehicle => {
    const bucket = buckets.find(b => vehicle.fuel_level_percent >= b.min && vehicle.fuel_level_percent <= b.max);
    if (bucket) bucket.count++;
  });

  return buckets.map(({ range, count }) => ({ range, count }));
}

export function getBatteryDistribution(vehicles: FleetVehicle[]): SpeedBucket[] {
  // Battery voltage ranges for typical 12V vehicle systems
  const buckets = [
    { range: '<11.8V Critical', min: 0, max: 11.8, count: 0 },
    { range: '11.8-12.4V Low', min: 11.8, max: 12.4, count: 0 },
    { range: '12.4-12.8V Good', min: 12.4, max: 12.8, count: 0 },
    { range: '>12.8V Full', min: 12.8, max: 20, count: 0 },
  ];

  vehicles.forEach(vehicle => {
    const battery = vehicle.battery_level;
    const bucket = buckets.find(b => battery >= b.min && battery <= b.max);
    if (bucket) bucket.count++;
  });

  return buckets.map(({ range, count }) => ({ range, count }));
}

export function getDepartmentMetrics(vehicles: FleetVehicle[]): DepartmentMetrics[] {
  const deptMap = new Map<string, FleetVehicle[]>();

  vehicles.forEach(vehicle => {
    const dept = vehicle.department_label || 'Unassigned';
    if (!deptMap.has(dept)) {
      deptMap.set(dept, []);
    }
    deptMap.get(dept)!.push(vehicle);
  });

  return Array.from(deptMap.entries()).map(([department, deptVehicles]) => {
    const count = deptVehicles.length;
    const averageSpeed = deptVehicles.reduce((sum, v) => sum + v.speed, 0) / count;
    const averageFuel = deptVehicles.reduce((sum, v) => sum + v.fuel_level_percent, 0) / count;
    const averageBattery = deptVehicles.reduce((sum, v) => sum + v.battery_level, 0) / count;
    const offlineCount = deptVehicles.filter(v => v.connection_status === 'offline').length;
    const offlineRate = (offlineCount / count) * 100;

    return {
      department,
      count,
      averageSpeed,
      averageFuel,
      averageBattery,
      offlineRate,
    };
  }).sort((a, b) => b.count - a.count);
}

export function getGroupMetrics(vehicles: FleetVehicle[]): GroupMetrics[] {
  const groupMap = new Map<string, FleetVehicle[]>();

  vehicles.forEach(vehicle => {
    const group = vehicle.group_label || 'Unassigned';
    if (!groupMap.has(group)) {
      groupMap.set(group, []);
    }
    groupMap.get(group)!.push(vehicle);
  });

  return Array.from(groupMap.entries()).map(([group, groupVehicles]) => {
    const count = groupVehicles.length;
    const online = groupVehicles.filter(v => v.connection_status === 'online').length;
    const offline = groupVehicles.filter(v => v.connection_status === 'offline').length;
    const idle = groupVehicles.filter(v => v.connection_status === 'idle').length;

    return {
      group,
      count,
      online,
      offline,
      idle,
    };
  }).sort((a, b) => b.count - a.count);
}

export function getModelDistribution(vehicles: FleetVehicle[]): ModelDistribution[] {
  const modelMap = new Map<string, number>();

  vehicles.forEach(vehicle => {
    const model = vehicle.object_label.split(' - ')[0] || 'Unknown';
    modelMap.set(model, (modelMap.get(model) || 0) + 1);
  });

  return Array.from(modelMap.entries())
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 models
}

export function getExceptionVehicles(vehicles: FleetVehicle[]): ExceptionVehicle[] {
  return vehicles
    .map(vehicle => {
      const reasons: string[] = [];

      if (vehicle.speed > SPEED_THRESHOLD) {
        reasons.push('Overspeeding');
      }
      if (vehicle.connection_status === 'offline') {
        reasons.push('Offline');
      }
      if (vehicle.battery_level < CRITICAL_BATTERY_THRESHOLD) {
        reasons.push('Critical Battery');
      } else if (vehicle.battery_level < LOW_BATTERY_THRESHOLD) {
        reasons.push('Low Battery');
      }
      if (vehicle.fuel_level_percent < LOW_FUEL_THRESHOLD) {
        reasons.push('Low Fuel');
      }

      if (reasons.length > 0) {
        return { ...vehicle, reason: reasons };
      }
      return null;
    })
    .filter((v): v is ExceptionVehicle => v !== null);
}

export function getZoneDistribution(vehicles: FleetVehicle[]): StatusDistribution[] {
  const zoneMap = new Map<string, number>();

  vehicles.forEach(vehicle => {
    const zone = vehicle.zone_label || 'Unassigned';
    zoneMap.set(zone, (zoneMap.get(zone) || 0) + 1);
  });

  const total = vehicles.length;

  return Array.from(zoneMap.entries())
    .map(([status, count]) => ({
      status,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

