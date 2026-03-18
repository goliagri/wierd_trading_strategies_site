import { useTheme } from '../../shared/hooks/useTheme';
import type { ParameterDef } from '../strategies/types';

interface ParameterPanelProps {
  parameters: ParameterDef[];
  values: Record<string, number | string>;
  onChange: (key: string, value: number | string) => void;
}

export default function ParameterPanel({ parameters, values, onChange }: ParameterPanelProps) {
  const { theme } = useTheme();

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 20,
      boxShadow: theme.shadow,
    }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Parameters
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {parameters.map(param => (
          <div key={param.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>
                {param.label}
              </label>
              {param.type === 'range' && (
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.accent,
                  background: theme.accentBg,
                  padding: '2px 8px',
                  borderRadius: 4,
                }}>
                  {param.unit === '$' && '$'}{values[param.key]}{param.unit === '%' && '%'}
                </span>
              )}
            </div>
            {param.type === 'range' ? (
              <div style={{ position: 'relative' }}>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={values[param.key] as number}
                  onChange={e => onChange(param.key, Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    appearance: 'none',
                    background: `linear-gradient(to right, ${theme.accent} 0%, ${theme.accent} ${
                      ((values[param.key] as number) - (param.min ?? 0)) / ((param.max ?? 100) - (param.min ?? 0)) * 100
                    }%, ${theme.bgInput} ${
                      ((values[param.key] as number) - (param.min ?? 0)) / ((param.max ?? 100) - (param.min ?? 0)) * 100
                    }%, ${theme.bgInput} 100%)`,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                />
              </div>
            ) : (
              <select
                value={values[param.key]}
                onChange={e => onChange(param.key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.bgInput,
                  color: theme.text,
                  fontSize: 13,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {param.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {param.tooltip && (
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{param.tooltip}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
