import React, { useMemo, useEffect } from 'react';
import { UnifiedDashboard } from '../components/analytics/UnifiedDashboard';
import type { IndustryId, RoleId, TimeRange } from '../types/analytics';

/**
 * UnifiedEmbedPage - Single embeddable frame with all analytics
 * 
 * Shows industry and role dashboards in one interface with instant visibility.
 * No selection steps required - metrics are displayed immediately.
 * 
 * URL Parameters:
 * - view: "industry" | "role" (default view mode)
 * - industry: IndustryId (default industry if view=industry)
 * - role: RoleId (default role if view=role)
 * - timeRange: "7d" | "30d" | "90d" | "12m"
 * - compact: "true" | "false" (compact header mode)
 * 
 * Example embed code:
 * <iframe 
 *   src="https://your-domain.com/unified-embed"
 *   width="100%"
 *   height="800"
 *   style="border: none;"
 * ></iframe>
 * 
 * With defaults:
 * <iframe 
 *   src="https://your-domain.com/unified-embed?view=industry&industry=logistics&timeRange=30d"
 *   width="100%"
 *   height="800"
 *   style="border: none;"
 * ></iframe>
 */
export const UnifiedEmbedPage: React.FC = () => {
  // Parse URL parameters
  const params = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    return {
      view: (searchParams.get('view') || 'industry') as 'industry' | 'role',
      industry: (searchParams.get('industry') || 'logistics') as IndustryId,
      role: (searchParams.get('role') || 'fleet_operations_manager') as RoleId,
      timeRange: (searchParams.get('timeRange') || '30d') as TimeRange,
      compact: searchParams.get('compact') === 'true',
    };
  }, []);

  // Report ready state to parent
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'unified-analytics-ready',
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
          type: 'unified-analytics-resize',
          source: 'navixy-analytics',
          height: document.body.scrollHeight,
        }, '*');
      }
    };

    reportHeight();
    const observer = new ResizeObserver(reportHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return (
    <UnifiedDashboard
      defaultMode={params.view}
      defaultIndustry={params.industry}
      defaultRole={params.role}
      defaultTimeRange={params.timeRange}
      embedded={true}
      compactHeader={params.compact}
    />
  );
};

export default UnifiedEmbedPage;

