import { useTheme } from '../../shared/hooks/useTheme';
import type { StrategyResult } from '../strategies/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HoldingsTableProps {
  result: StrategyResult;
}

export default function HoldingsTable({ result }: HoldingsTableProps) {
  const { theme } = useTheme();
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 20,
      boxShadow: theme.shadow,
    }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>Holdings by Year</h3>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: theme.textMuted }}>
        Click a year to see which stocks were held
      </p>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {result.holdingsPerYear.map((h, i) => {
          const ret = result.strategyReturns[i];
          const isExpanded = expandedYear === h.year;
          const isPositive = ret > 0;

          return (
            <div key={h.year}>
              <button
                onClick={() => setExpandedYear(isExpanded ? null : h.year)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: isExpanded ? theme.accentBg : 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${theme.borderLight}`,
                  cursor: 'pointer',
                  color: theme.text,
                  fontSize: 13,
                  transition: 'background 0.15s ease',
                }}
              >
                <span style={{ fontWeight: 600 }}>{h.year}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: theme.textMuted }}>{h.count} stocks</span>
                  <span style={{
                    color: isPositive ? theme.positive : theme.negative,
                    fontWeight: 600,
                    fontSize: 12,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: isPositive ? theme.positiveBg : theme.negativeBg,
                  }}>
                    {isPositive ? '+' : ''}{(ret * 100).toFixed(1)}%
                  </span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>
              {isExpanded && (
                <div style={{
                  padding: '10px 12px',
                  background: theme.bgCardHover,
                  borderBottom: `1px solid ${theme.borderLight}`,
                }}>
                  {h.tickers.length === 0 ? (
                    <span style={{ fontSize: 12, color: theme.textMuted, fontStyle: 'italic' }}>No stocks held (cash position)</span>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {h.tickers.map(t => (
                        <span key={t} style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: theme.accentBg,
                          color: theme.accent,
                          fontFamily: 'monospace',
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
