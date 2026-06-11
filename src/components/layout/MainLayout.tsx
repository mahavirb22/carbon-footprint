import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';
import type { RegionCode } from '../../types';

const NAV = [
  { to: '/chat', icon: '💬', aria: 'Chat with AI guide', label: 'AI Chat' },
  { to: '/calculator', icon: '🧮', aria: 'Calculate footprint', label: 'Calculator' },
  { to: '/lifecycle', icon: '🌱', aria: 'View carbon lifecycle', label: 'Lifecycle' },
  { to: '/timeline', icon: '📅', aria: 'View climate timeline', label: 'Timeline' },
  { to: '/quiz', icon: '🧠', aria: 'Take carbon quiz', label: 'Quiz' },
  { to: '/next-step', icon: '✅', aria: 'View next steps', label: 'Next Steps' }
];

const REGIONS: { code: RegionCode; label: string }[] = [
  { code: 'global', label: 'Global' },
  { code: 'us', label: 'USA' },
  { code: 'eu', label: 'Europe' },
  { code: 'uk', label: 'UK' },
  { code: 'au', label: 'Australia' }
];

export function MainLayout() {
  const { region, setRegion } = useAppStore();

  return (
    <div className="flex h-screen bg-brand-50">
      {/* Desktop sidebar navigation */}
      <nav aria-label="Main navigation" className="hidden md:flex flex-col w-64 bg-brand-900 text-white flex-shrink-0 shadow-soft z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span aria-hidden="true">🌍</span> CarbonIQ
          </h1>
        </div>
        
        <div className="px-4 pb-4">
          <label htmlFor="region-sel-desktop" className="sr-only">🌍 Region</label>
          <select 
            id="region-sel-desktop" 
            aria-label="Select your region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionCode)}
            className="w-full bg-brand-800 text-sm rounded-lg px-3 py-2 border-transparent focus:ring-2 focus:ring-brand-500"
          >
            {REGIONS.map(r => <option key={r.code} value={r.code} className="bg-brand-800 text-white">{r.label}</option>)}
          </select>
        </div>

        <ul role="list" className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                aria-label={item.aria}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                  isActive ? 'nav-active shadow-sm' : 'text-brand-200 hover:bg-white/10 hover:text-white'
                )}
              >
                <span aria-hidden="true" className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile bottom navigation */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-white border-t shadow-soft">
        {NAV.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            aria-label={item.aria}
            className={({ isActive }) => clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 transition-colors',
              isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <span aria-hidden="true" className="text-lg">{item.icon}</span>
            <span className="leading-none text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main content area */}
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0 relative" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
