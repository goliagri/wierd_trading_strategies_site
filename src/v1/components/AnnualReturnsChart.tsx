import { useTheme } from '../../shared/hooks/useTheme';
import type { StrategyResult } from '../strategies/types';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';

interface AnnualReturnsChartProps {
  result: StrategyResult;
  strategyName: string;
}

export default function AnnualReturnsChart({ result, strategyName }: AnnualReturnsChartProps) {
  const { theme } = useTheme();

  const data = result.years.map((year, i) => ({
    year,
    strategy: +(result.strategyReturns[i] * 100).toFixed(1),
    benchmark: +(result.benchmarkReturns[i] * 100).toFixed(1),
  }));

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 20,
      boxShadow: theme.shadow,
    }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>Annual Returns</h3>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: theme.textMuted }}>
        Year-by-year performance comparison
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }} barCategoryGap="20%">
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
              `${value > 0 ? '+' : ''}${value.toFixed(1)}%`,
              name === 'strategy' ? strategyName : 'S&P 500',
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="square"
            wrapperStyle={{ fontSize: 12, color: theme.chartText }}
            formatter={(value: string) => value === 'strategy' ? strategyName : 'S&P 500'}
          />
          <ReferenceLine y={0} stroke={theme.chartGrid} strokeWidth={1.5} />
          <Bar dataKey="strategy" fill={theme.chartColors[0]} radius={[3, 3, 0, 0]} />
          <Bar dataKey="benchmark" fill={theme.chartColors[1]} radius={[3, 3, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
