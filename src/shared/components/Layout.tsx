import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, TrendingDown, Shuffle, Calendar, DollarSign, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

const strategies = [
  { path: '/strategy/fallen-angels', label: 'Fallen Angels', icon: TrendingDown, desc: 'Buy the dip' },
  { path: '/strategy/alphabet-soup', label: 'Alphabet Soup', icon: BarChart3, desc: 'Trade by ticker' },
  { path: '/strategy/monday-mayhem', label: 'Monday Mayhem', icon: Calendar, desc: 'Day-of-week effect' },
  { path: '/strategy/penny-pincher', label: 'Penny Pincher', icon: DollarSign, desc: 'Low price bias' },
  { path: '/strategy/dartboard', label: 'Dartboard', icon: Shuffle, desc: 'Random picks' },
];

export default function Layout() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: theme.bgSidebar,
        borderRight: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: sidebarOpen ? 0 : -260,
        zIndex: 50,
        transition: 'left 0.2s ease',
      }}
        className="sidebar"
      >
        <div style={{ padding: '24px 20px 16px', borderBottom: `1px solid ${theme.border}` }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            <span style={{ color: theme.accent }}>Weird</span> Trading
          </h1>
          <p style={{ fontSize: 12, color: theme.textMuted, margin: '4px 0 0' }}>Historical strategy backtesting</p>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          <div style={{ padding: '0 12px', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.textMuted }}>Strategies</span>
          </div>
          {strategies.map(s => (
            <NavLink
              key={s.path}
              to={s.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: isActive ? theme.accent : theme.textSecondary,
                background: isActive ? theme.accentBg : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s ease',
                marginBottom: 2,
              })}
            >
              <s.icon size={18} />
              <div>
                <div>{s.label}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 400 }}>{s.desc}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme.border}` }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              background: theme.bgInput,
              color: theme.textSecondary,
              cursor: 'pointer',
              fontSize: 13,
              width: '100%',
              transition: 'all 0.15s ease',
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Mobile header */}
        <div className="mobile-header" style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer', padding: 4 }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span style={{ fontWeight: 600, fontSize: 16 }}>
            <span style={{ color: theme.accent }}>Weird</span> Trading
          </span>
          <button
            onClick={toggleTheme}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 4 }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }} className="main-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 769px) {
          .sidebar { left: 0 !important; }
          main { margin-left: 260px; }
          .mobile-header { display: none !important; }
        }
        @media (max-width: 768px) {
          .main-content { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
