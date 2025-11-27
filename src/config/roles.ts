import type { RoleConfig, RoleId } from '../types/analytics';

export const ROLES: Record<RoleId, RoleConfig> = {
  fleet_operations_manager: {
    id: 'fleet_operations_manager',
    name: 'Fleet Operations Manager',
    description: 'Oversees day-to-day fleet operations, utilization, and route efficiency',
    icon: '📊',
  },
  maintenance_manager: {
    id: 'maintenance_manager',
    name: 'Maintenance Manager',
    description: 'Manages vehicle maintenance schedules, repairs, and equipment health',
    icon: '🔧',
  },
  safety_compliance_manager: {
    id: 'safety_compliance_manager',
    name: 'Safety & Compliance Manager',
    description: 'Ensures fleet safety standards and regulatory compliance',
    icon: '🛡️',
  },
  security_manager: {
    id: 'security_manager',
    name: 'Security Manager',
    description: 'Monitors fleet security, theft prevention, and unauthorized usage',
    icon: '🔒',
  },
  operations_director: {
    id: 'operations_director',
    name: 'Operations Director',
    description: 'Executive oversight of all fleet operations and strategic decisions',
    icon: '👔',
  },
};

export const ROLE_LIST = Object.values(ROLES);

export function getRoleById(id: RoleId): RoleConfig | undefined {
  return ROLES[id];
}

export function getRoleIds(): RoleId[] {
  return Object.keys(ROLES) as RoleId[];
}

