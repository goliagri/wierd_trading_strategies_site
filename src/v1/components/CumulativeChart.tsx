import { useTheme } from '../../shared/hooks/useTheme';
import type { StrategyResult } from '../strategies/types';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

interface CumulativeChartProps {
  result: StrategyResult;
  strategyName: string;
}

export default function CumulativeChart({ result, strategyName }: CumulativeChartProps) {
  const { theme } = useTheme();

  const data = result.years.map((year, i) => ({
    year,
    strategy: Math.round(result.strategyCumulative[i + 1]),
    benchmark: Math.round(result.benchmarkCumulative[i + 1]),
  }));

  // Add starting point
  data.unshift({
    year: result.years[0] - 1,
    strategy: 10000,
    benchmark: 10000,
  });

  const formatDollar = (val: number) => {
    if (val >= 100000) return `$${(val / 1000).toFixed(0)}k`;
    if (val >= 10000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 20,
      boxShadow: theme.shadow,
    }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>Growth of $10,000</h3>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: theme.textMuted }}>
        Cumulative performance vs S&P 500 benchmark
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="strategyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.chartColors[0]} stopOpacity={0.25} />
              <stop offset="100%" stopColor={theme.chartColors[0]} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.chartColors[1]} stopOpacity={0.15} />
              <stop offset="100%" stopColor={theme.chartColors[1]} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: theme.chartText }}
            tickLine={false}
            axisLine={{ stroke: theme.chartGrid }}
          />
          <YAxis
            tickFormatter={formatDollar}
            tick={{ fontSize: 11, fill: theme.chartText }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              fontSize: 13,
              boxShadow: theme.shadowLg,
            }}
            labelStyle={{ color: theme.text, fontWeight: 600, marginBottom: 4 }}
            formatter={(value: number, name: string) => [
              formatDollar(value),
              name === 'strategy' ? strategyName : 'S&P 500',
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="line"
            wrapperStyle={{ fontSize: 12, color: theme.chartText }}
            formatter={(value: string) => value === 'strategy' ? strategyName : 'S&P 500'}
          />
          <Area
            type="monotone"
            dataKey="benchmark"
            stroke={theme.chartColors[1]}
            strokeWidth={2}
            fill="url(#benchmarkGradient)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="strategy"
            stroke={theme.chartColors[0]}
            strokeWidth={2.5}
            fill="url(#strategyGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
