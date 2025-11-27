import React, { useState } from 'react';
import { DashboardEngine, IndustrySelector } from '../components/analytics/DashboardEngine';
import { Button } from '../components/ui/Button';
import type { IndustryId } from '../types/analytics';
import { INDUSTRIES } from '../config/industries';

interface IndustryDashboardPageProps {
  initialIndustry?: IndustryId;
}

export const IndustryDashboardPage: React.FC<IndustryDashboardPageProps> = ({
  initialIndustry,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId | null>(
    initialIndustry || null
  );

  // If no industry selected, show selector
  if (!selectedIndustry) {
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
              Industry Analytics
            </h1>
            <p 
              className="mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Select an industry to view tailored analytics and KPIs
            </p>
          </div>
        </header>

        <div className="mx-auto px-6 py-8">
          <IndustrySelector onSelect={(id) => setSelectedIndustry(id as IndustryId)} />
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
              onClick={() => setSelectedIndustry(null)}
            >
              ← Back
            </Button>
            
            {/* Industry Quick Switch */}
            <div className="hidden md:flex items-center gap-2">
              {Object.values(INDUSTRIES).map(industry => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedIndustry === industry.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {industry.icon} {industry.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Industry Selector */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value as IndustryId)}
            className="md:hidden px-3 py-1.5 rounded-lg border text-sm"
            style={{
              background: 'var(--surface-1)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {Object.values(INDUSTRIES).map(industry => (
              <option key={industry.id} value={industry.id}>
                {industry.icon} {industry.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dashboard */}
      <DashboardEngine
        mode="industry"
        industry={selectedIndustry}
      />
    </div>
  );
};

export default IndustryDashboardPage;

