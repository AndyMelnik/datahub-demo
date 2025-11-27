import React, { useMemo, useEffect } from 'react';
import { DashboardEngine } from '../components/analytics/DashboardEngine';
import type { DashboardMode, IndustryId, RoleId, TimeRange } from '../types/analytics';

/**
 * EmbedDashboard - Embeddable version designed for iframe usage
 * 
 * Accepts URL query parameters:
 * - mode: "industry" | "role" (required)
 * - industry: IndustryId (required if mode=industry)
 * - role: RoleId (required if mode=role)
 * - timeRange: "7d" | "30d" | "90d" | "12m" (optional, defaults to 30d)
 * 
 * Example embed code:
 * <iframe 
 *   src="https://your-domain.com/embed?mode=industry&industry=logistics&timeRange=30d"
 *   width="100%"
 *   height="600"
 *   style="border: none;"
 * ></iframe>
 */
export const EmbedDashboard: React.FC = () => {
  // Parse URL parameters
  const params = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    return {
      mode: (searchParams.get('mode') || 'industry') as DashboardMode,
      industry: searchParams.get('industry') as IndustryId | null,
      role: searchParams.get('role') as RoleId | null,
      timeRange: (searchParams.get('timeRange') || '30d') as TimeRange,
    };
  }, []);

  // Report ready state to parent
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'analytics-dashboard-ready',
        source: 'navixy-analytics',
        params,
      }, '*');
    }
  }, [params]);

  // Report height changes for auto-resize
  useEffect(() => {
    const reportHeight = () => {
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'analytics-dashboard-resize',
          source: 'navixy-analytics',
          height: document.body.scrollHeight,
        }, '*');
      }
    };

    // Initial report
    reportHeight();

    // Report on resize
    const observer = new ResizeObserver(reportHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  // Listen for configuration messages from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'analytics-dashboard-config') {
        // Handle configuration updates from parent
        console.log('Received config from parent:', event.data);
        // Could implement dynamic config updates here
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Validate parameters
  const isValid = useMemo(() => {
    if (params.mode === 'industry' && !params.industry) {
      return false;
    }
    if (params.mode === 'role' && !params.role) {
      return false;
    }
    return true;
  }, [params]);

  // Show error for invalid params
  if (!isValid) {
    return (
      <div 
        className="min-h-[400px] flex items-center justify-center p-6"
        style={{ background: 'var(--surface-2)' }}
      >
        <div 
          className="text-center max-w-md p-6 rounded-lg"
          style={{ 
            background: 'var(--surface-1)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="text-4xl mb-4">⚠️</div>
          <h2 
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Invalid Configuration
          </h2>
          <p 
            className="text-sm mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Please provide the required URL parameters.
          </p>
          <div 
            className="text-left text-xs p-3 rounded font-mono"
            style={{ 
              background: 'var(--surface-2)',
              color: 'var(--text-muted)'
            }}
          >
            <p className="mb-2"><strong>Required parameters:</strong></p>
            <p>• mode=industry|role</p>
            <p>• industry=logistics|heavy_machinery|cold_chain|leasing</p>
            <p>• role=fleet_operations_manager|maintenance_manager|...</p>
            <p className="mt-2"><strong>Optional:</strong></p>
            <p>• timeRange=7d|30d|90d|12m</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="embed-dashboard"
      style={{ 
        background: 'var(--surface-2)',
        minHeight: '400px',
      }}
    >
      <DashboardEngine
        mode={params.mode}
        industry={params.industry || undefined}
        role={params.role || undefined}
        timeRange={params.timeRange}
        embedded={true}
      />
    </div>
  );
};

export default EmbedDashboard;

