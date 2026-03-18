import { useTheme } from '../../shared/hooks/useTheme';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  positive?: boolean;
  negative?: boolean;
}

export default function StatCard({ label, value, subtext, icon, positive, negative }: StatCardProps) {
  const { theme } = useTheme();

  const valueColor = positive ? theme.positive : negative ? theme.negative : theme.text;
  const valueBg = positive ? theme.positiveBg : negative ? theme.negativeBg : 'transparent';

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      boxShadow: theme.shadow,
      transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon && <span style={{ color: theme.textMuted }}>{icon}</span>}
        <span style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{
        fontSize: 24,
        fontWeight: 700,
        color: valueColor,
        letterSpacing: '-0.02em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}>
        {(positive || negative) && (
          <span style={{
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 4,
            background: valueBg,
            color: valueColor,
            fontWeight: 600,
          }}>
            {positive ? '+' : '-'}
          </span>
        )}
        {value}
      </div>
      {subtext && (
        <span style={{ fontSize: 12, color: theme.textSecondary }}>{subtext}</span>
      )}
    </div>
  );
}
