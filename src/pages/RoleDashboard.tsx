import React, { useState } from 'react';
import { DashboardEngine, RoleSelector } from '../components/analytics/DashboardEngine';
import { Button } from '../components/ui/Button';
import type { RoleId } from '../types/analytics';
import { ROLES } from '../config/roles';

interface RoleDashboardPageProps {
  initialRole?: RoleId;
}

export const RoleDashboardPage: React.FC<RoleDashboardPageProps> = ({
  initialRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(
    initialRole || null
  );

  // If no role selected, show selector
  if (!selectedRole) {
    return (
      <div 
        className="min-h-screen"
        style={{ background: 'var(--surface-2)' }}
      >
        <header 
          className="shadow-sm"
          style={{ 
            background: 'var(--surface-1)', 
            borderBottom: '1px solid var(--border)' 
          }}
        >
          <div className="mx-auto px-6 py-6">
            <h1 
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Role-Based Analytics
            </h1>
            <p 
              className="mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Select your role to view relevant metrics and KPIs
            </p>
          </div>
        </header>

        <div className="mx-auto px-6 py-8">
          <RoleSelector onSelect={(id) => setSelectedRole(id as RoleId)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
      {/* Navigation Bar */}
      <div 
        className="sticky top-0 z-20"
        style={{ 
          background: 'var(--surface-1)', 
          borderBottom: '1px solid var(--border)' 
        }}
      >
        <div className="mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRole(null)}
            >
              ← Back
            </Button>
            
            {/* Role Quick Switch - Compact for Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {Object.values(ROLES).map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedRole === role.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {role.icon} {role.name.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Role Selector */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as RoleId)}
            className="lg:hidden px-3 py-1.5 rounded-lg border text-sm"
            style={{
              background: 'var(--surface-1)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {Object.values(ROLES).map(role => (
              <option key={role.id} value={role.id}>
                {role.icon} {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dashboard */}
      <DashboardEngine
        mode="role"
        role={selectedRole}
      />
    </div>
  );
};

export default RoleDashboardPage;

