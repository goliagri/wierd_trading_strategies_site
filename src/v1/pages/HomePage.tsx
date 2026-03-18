import { Link } from 'react-router-dom';
import { useTheme } from '../../shared/hooks/useTheme';
import { useMemo } from 'react';
import { strategies } from '../strategies';
import { TrendingDown, BarChart3, Calendar, DollarSign, Shuffle, ArrowRight } from 'lucide-react';

const strategyIcons: Record<string, typeof TrendingDown> = {
  'fallen-angels': TrendingDown,
  'alphabet-soup': BarChart3,
  'monday-mayhem': Calendar,
  'penny-pincher': DollarSign,
  'dartboard': Shuffle,
};

export default function HomePage() {
  const { theme } = useTheme();

  // Run each strategy with defaults to show a quick preview
  const previews = useMemo(() => {
    return Object.entries(strategies).map(([id, { config, run }]) => {
      const defaults: Record<string, number | string> = {};
      config.parameters.forEach(p => { defaults[p.key] = p.default; });
      const result = run(defaults);
      return { id, config, result };
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 36, maxWidth: 600 }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          margin: '0 0 8px',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}>
          What if your trading strategy was <span style={{ color: theme.accent }}>completely absurd</span>?
        </h2>
        <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.6, margin: 0 }}>
          Explore historical backtests of unconventional stock-picking strategies.
          Adjust parameters in real time and see how they would have performed against the S&P 500.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}>
        {previews.map(({ id, config, result }) => {
          const Icon = strategyIcons[id] || BarChart3;
          const totalReturn = result.totalReturn;
          const isPositive = totalReturn > 0;

          return (
            <Link
              key={id}
              to={`/strategy/${id}`}
              style={{
                textDecoration: 'none',
                color: theme.text,
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: theme.shadow,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = theme.accent;
                e.currentTarget.style.boxShadow = theme.shadowLg;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.boxShadow = theme.shadow;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: theme.accentBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.accent,
                }}>
                  <Icon size={20} />
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isPositive ? theme.positive : theme.negative,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: isPositive ? theme.positiveBg : theme.negativeBg,
                }}>
                  {isPositive ? '+' : ''}{(totalReturn * 100).toFixed(0)}%
                </span>
              </div>

              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>{config.name}</h3>
                <p style={{
                  margin: 0,
                  fontSize: 13,
                  color: theme.textSecondary,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {config.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: 11, color: theme.textMuted }}>
                    Annualized: <strong style={{ color: theme.text }}>{(result.annualizedReturn * 100).toFixed(1)}%</strong>
                  </span>
                  <span style={{ fontSize: 11, color: theme.textMuted }}>
                    Sharpe: <strong style={{ color: theme.text }}>{result.sharpeRatio.toFixed(2)}</strong>
                  </span>
                </div>
                <ArrowRight size={16} color={theme.accent} />
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{
        marginTop: 36,
        padding: '16px 20px',
        background: theme.accentBg,
        borderRadius: 10,
        border: `1px solid ${theme.accent}20`,
      }}>
        <p style={{ margin: 0, fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>
          <strong style={{ color: theme.accent }}>Disclaimer:</strong> This is a fun educational tool using simulated data.
          Past performance (even real) does not guarantee future results.
          These strategies are intentionally weird — please don't actually trade based on them!
        </p>
      </div>
    </div>
  );
}
