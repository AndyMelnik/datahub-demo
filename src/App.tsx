import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AnalyticsHome } from './pages/AnalyticsHome';
import { IndustryDashboardPage } from './pages/IndustryDashboard';
import { RoleDashboardPage } from './pages/RoleDashboard';
import { EmbedDashboard } from './pages/EmbedDashboard';
import { UnifiedEmbedPage } from './pages/UnifiedEmbedPage';
import { UnifiedDashboard } from './components/analytics/UnifiedDashboard';
import type { IndustryId, RoleId } from './types/analytics';
import './App.css';

type Page = 'home' | 'fleet' | 'industry' | 'role' | 'embed' | 'unified' | 'unified-embed';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId | undefined>();
  const [selectedRole, setSelectedRole] = useState<RoleId | undefined>();

  // Handle URL routing
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      if (path === '/unified-embed' || path === '/unified-embed/') {
        setCurrentPage('unified-embed');
      } else if (path === '/unified' || path === '/unified/') {
        setCurrentPage('unified');
      } else if (path === '/embed' || path === '/embed/') {
        setCurrentPage('embed');
      } else if (path === '/industry' || path === '/industry/') {
        setCurrentPage('industry');
        const industry = params.get('id') as IndustryId | null;
        if (industry) setSelectedIndustry(industry);
      } else if (path === '/role' || path === '/role/') {
        setCurrentPage('role');
        const role = params.get('id') as RoleId | null;
        if (role) setSelectedRole(role);
      } else if (path === '/fleet' || path === '/fleet/') {
        setCurrentPage('fleet');
      } else if (path === '/analytics' || path === '/analytics/') {
        setCurrentPage('home');
      } else if (path === '/' || path === '') {
        // Default to fleet dashboard for root path
        setCurrentPage('fleet');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  const navigate = (page: string) => {
    if (page === 'industry') {
      setCurrentPage('industry');
      window.history.pushState({}, '', '/industry');
    } else if (page === 'role') {
      setCurrentPage('role');
      window.history.pushState({}, '', '/role');
    } else if (page === 'fleet') {
      setCurrentPage('fleet');
      window.history.pushState({}, '', '/fleet');
    } else if (page === 'home') {
      setCurrentPage('home');
      window.history.pushState({}, '', '/analytics');
    } else if (page === 'unified') {
      setCurrentPage('unified');
      window.history.pushState({}, '', '/unified');
    }
  };

  // Render based on current page
  switch (currentPage) {
    case 'unified-embed':
      return <UnifiedEmbedPage />;
    
    case 'embed':
      return <EmbedDashboard />;
    
    case 'unified':
      return (
        <div>
          <TopNav currentPage={currentPage} onNavigate={navigate} />
          <UnifiedDashboard embedded={false} />
        </div>
      );
    
    case 'industry':
      return (
        <div>
          <TopNav currentPage={currentPage} onNavigate={navigate} />
          <IndustryDashboardPage initialIndustry={selectedIndustry} />
        </div>
      );
    
    case 'role':
      return (
        <div>
          <TopNav currentPage={currentPage} onNavigate={navigate} />
          <RoleDashboardPage initialRole={selectedRole} />
        </div>
      );
    
    case 'fleet':
      return (
        <div>
          <TopNav currentPage={currentPage} onNavigate={navigate} />
          <Dashboard />
        </div>
      );
    
    case 'home':
    default:
      return (
        <div>
          <TopNav currentPage={currentPage} onNavigate={navigate} />
          <AnalyticsHome onNavigate={navigate} />
        </div>
      );
  }
}

// Top Navigation Component
interface TopNavProps {
  currentPage: Page;
  onNavigate: (page: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav 
      className="sticky top-0 z-50 shadow-sm"
      style={{ 
        background: 'var(--surface-1)', 
        borderBottom: '1px solid var(--border)' 
      }}
    >
      <div className="mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span 
              className="text-xl font-bold cursor-pointer"
              style={{ color: 'var(--primary)' }}
              onClick={() => onNavigate('home')}
            >
              Navixy Analytics
            </span>
            
            <div className="hidden md:flex items-center gap-1">
              <NavButton 
                active={currentPage === 'home'} 
                onClick={() => onNavigate('home')}
              >
                Home
              </NavButton>
              <NavButton 
                active={currentPage === 'fleet'} 
                onClick={() => onNavigate('fleet')}
              >
                Fleet
              </NavButton>
              <NavButton 
                active={currentPage === 'unified'} 
                onClick={() => onNavigate('unified')}
              >
                Analytics
              </NavButton>
              <NavButton 
                active={currentPage === 'industry'} 
                onClick={() => onNavigate('industry')}
              >
                Industry
              </NavButton>
              <NavButton 
                active={currentPage === 'role'} 
                onClick={() => onNavigate('role')}
              >
                Role
              </NavButton>
            </div>
          </div>

          {/* Mobile Nav */}
          <select
            value={currentPage}
            onChange={(e) => onNavigate(e.target.value)}
            className="md:hidden px-3 py-1.5 rounded-lg border text-sm"
            style={{
              background: 'var(--surface-1)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="home">Home</option>
            <option value="fleet">Fleet Dashboard</option>
            <option value="unified">Analytics</option>
            <option value="industry">Industry</option>
            <option value="role">Role</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

// Nav Button Component
interface NavButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
};

export default App;
