import { useTheme } from '../../shared/hooks/useTheme';
import type { StrategyResult } from '../strategies/types';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';

interface DrawdownChartProps {
  result: StrategyResult;
}

export default function DrawdownChart({ result }: DrawdownChartProps) {
  const { theme } = useTheme();

  // Compute drawdown series
  let peak = result.strategyCumulative[0];
  const data = result.years.map((year, i) => {
    const val = result.strategyCumulative[i + 1];
    if (val > peak) peak = val;
    const dd = -((peak - val) / peak) * 100;
    return { year, drawdown: +dd.toFixed(1) };
  });

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 20,
      boxShadow: theme.shadow,
    }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>Drawdown</h3>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: theme.textMuted }}>
        Peak-to-trough decline over time
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.negative} stopOpacity={0.05} />
              <stop offset="100%" stopColor={theme.negative} stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: theme.chartText }}
            tickLine={false}
            axisLine={{ stroke: theme.chartGrid }}
          />
          <YAxis
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11, fill: theme.chartText }}
            tickLine={false}
            axisLine={false}
            width={50}
            domain={['dataMin', 0]}
          />
          <Tooltip
            contentStyle={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              fontSize: 13,
              boxShadow: theme.shadowLg,
            }}
            labelStyle={{ color: theme.text, fontWeight: 600 }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Drawdown']}
          />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke={theme.negative}
            strokeWidth={2}
            fill="url(#drawdownGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
