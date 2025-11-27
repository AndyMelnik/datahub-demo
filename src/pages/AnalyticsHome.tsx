import React from 'react';
import { INDUSTRIES } from '../config/industries';
import { ROLES } from '../config/roles';

interface AnalyticsHomeProps {
  onNavigate: (path: string) => void;
}

export const AnalyticsHome: React.FC<AnalyticsHomeProps> = ({ onNavigate }) => {
  return (
    <div 
      className="min-h-screen"
      style={{ background: 'var(--surface-2)' }}
    >
      {/* Hero Header */}
      <header 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23fff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>
        <div className="relative mx-auto px-6 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fleet Analytics Dashboard
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Industry-specific and role-based analytics for data-driven fleet management decisions
          </p>
        </div>
      </header>

      <div className="mx-auto px-6 py-12 max-w-7xl">
        {/* Dashboard Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Industry Dashboards Card */}
          <div 
            className="group p-8 rounded-2xl cursor-pointer transition-all hover:shadow-xl"
            style={{ 
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
            }}
            onClick={() => onNavigate('industry')}
          >
            <div className="text-6xl mb-4">🏭</div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Industry Dashboards
            </h2>
            <p 
              className="mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              Analytics tailored to specific industries - Logistics, Heavy Machinery, Cold Chain, and Leasing
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.values(INDUSTRIES).map(industry => (
                <span 
                  key={industry.id}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    background: industry.color + '20',
                    color: industry.color,
                  }}
                >
                  {industry.icon} {industry.name}
                </span>
              ))}
            </div>
            <span 
              className="text-sm font-medium group-hover:translate-x-1 transition-transform inline-block"
              style={{ color: 'var(--primary)' }}
            >
              Explore Industry Dashboards →
            </span>
          </div>

          {/* Role Dashboards Card */}
          <div 
            className="group p-8 rounded-2xl cursor-pointer transition-all hover:shadow-xl"
            style={{ 
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
            }}
            onClick={() => onNavigate('role')}
          >
            <div className="text-6xl mb-4">👤</div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Role-Based Dashboards
            </h2>
            <p 
              className="mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              Metrics curated for your specific role - from Operations Manager to Security Director
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.values(ROLES).slice(0, 4).map(role => (
                <span 
                  key={role.id}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                  }}
                >
                  {role.icon} {role.name.split(' ').slice(0, 2).join(' ')}
                </span>
              ))}
              <span 
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  background: 'var(--surface-2)',
                  color: 'var(--text-muted)',
                }}
              >
                +{Object.values(ROLES).length - 4} more
              </span>
            </div>
            <span 
              className="text-sm font-medium group-hover:translate-x-1 transition-transform inline-block"
              style={{ color: 'var(--primary)' }}
            >
              Explore Role Dashboards →
            </span>
          </div>
        </div>

        {/* Quick Access to Fleet Dashboard */}
        <div 
          className="p-6 rounded-xl mb-12"
          style={{ 
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 
                className="text-lg font-semibold"
                style={{ color: '#0369a1' }}
              >
                🚀 Original Fleet Dashboard
              </h3>
              <p style={{ color: '#0369a1' }}>
                Access the classic fleet management dashboard with real-time vehicle monitoring
              </p>
            </div>
            <button
              onClick={() => onNavigate('fleet')}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{ 
                background: '#0ea5e9',
                color: 'white',
              }}
            >
              Open Fleet Dashboard
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Dashboard Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '📊',
              title: '40+ Metrics',
              description: 'Comprehensive KPIs across industries and roles',
            },
            {
              icon: '⏱️',
              title: 'Time Ranges',
              description: 'View trends over 7 days to 12 months',
            },
            {
              icon: '🔍',
              title: 'Drill-Down',
              description: 'Click any metric for detailed breakdowns',
            },
            {
              icon: '📱',
              title: 'Responsive',
              description: 'Works on desktop, tablet, and mobile',
            },
            {
              icon: '🎯',
              title: 'Role-Specific',
              description: 'Metrics tailored to your job function',
            },
            {
              icon: '🏢',
              title: 'Industry-Focused',
              description: 'Domain-specific analytics and benchmarks',
            },
            {
              icon: '📈',
              title: 'Trend Analysis',
              description: 'Compare against previous periods',
            },
            {
              icon: '🔌',
              title: 'Embeddable',
              description: 'Easily embed in any website via iframe',
            },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-4 rounded-lg"
              style={{ 
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 
                className="font-semibold mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHome;

