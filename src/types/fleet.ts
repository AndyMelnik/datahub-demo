export interface FleetVehicle {
  object_id: number;
  device_id: number;
  object_label: string;
  model: string;
  first_name: string;
  last_name: string;
  speed: number;
  device_time: string;
  platform_time: string;
  moving_status: 'moving' | 'stopped' | 'parked';
  connection_status: 'online' | 'offline' | 'idle';
  last_connect_formatted: string;
  battery_level: number; // Voltage measurement (V)
  zone_label: string;
  group_label: string;
  department_label: string;
  fuel_level_percent: number;
  odometer: number;
}

export interface FleetMetrics {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  parkedVehicles: number;
  onlineVehicles: number;
  offlineVehicles: number;
  movingVehicles: number;
  averageSpeed: number;
  lowBatteryCount: number;
  lowFuelCount: number;
  criticalBatteryCount: number;
  overspeedingCount: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface SpeedBucket {
  range: string;
  count: number;
}

export interface DepartmentMetrics {
  department: string;
  count: number;
  averageSpeed: number;
  averageFuel: number;
  averageBattery: number;
  offlineRate: number;
}

export interface GroupMetrics {
  group: string;
  count: number;
  online: number;
  offline: number;
  idle: number;
}

export interface ModelDistribution {
  model: string;
  count: number;
}

export interface ExceptionVehicle extends FleetVehicle {
  reason: string[];
}

