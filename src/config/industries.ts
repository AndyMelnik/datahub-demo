import type { IndustryConfig, IndustryId } from '../types/analytics';

export const INDUSTRIES: Record<IndustryId, IndustryConfig> = {
  logistics: {
    id: 'logistics',
    name: 'Logistics',
    description: 'Fleet management for delivery, distribution, and transportation companies',
    icon: '🚚',
    color: '#3b82f6', // blue
  },
  heavy_machinery: {
    id: 'heavy_machinery',
    name: 'Heavy Machinery',
    description: 'Equipment management for construction, mining, and industrial operations',
    icon: '🏗️',
    color: '#f59e0b', // amber
  },
  cold_chain: {
    id: 'cold_chain',
    name: 'Cold Chain',
    description: 'Temperature-controlled logistics for pharmaceuticals, food, and perishables',
    icon: '❄️',
    color: '#06b6d4', // cyan
  },
  leasing: {
    id: 'leasing',
    name: 'Leasing',
    description: 'Vehicle and equipment leasing fleet management',
    icon: '🔑',
    color: '#8b5cf6', // violet
  },
};

export const INDUSTRY_LIST = Object.values(INDUSTRIES);

export function getIndustryById(id: IndustryId): IndustryConfig | undefined {
  return INDUSTRIES[id];
}

export function getIndustryIds(): IndustryId[] {
  return Object.keys(INDUSTRIES) as IndustryId[];
}

