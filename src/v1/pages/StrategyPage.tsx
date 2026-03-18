import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useTheme } from '../../shared/hooks/useTheme';
import { strategies } from '../strategies';
import ParameterPanel from '../components/ParameterPanel';
import StatCard from '../components/StatCard';
import CumulativeChart from '../components/CumulativeChart';
import AnnualReturnsChart from '../components/AnnualReturnsChart';
import DrawdownChart from '../components/DrawdownChart';
import HoldingsTable from '../components/HoldingsTable';
import { TrendingUp, TrendingDown, Activity, Target, Award, BarChart3 } from 'lucide-react';

export default function StrategyPage() {
  const { strategyId } = useParams<{ strategyId: string }>();
  const { theme } = useTheme();

  const strategy = strategyId ? strategies[strategyId] : null;

  const [params, setParams] = useState<Record<string, number | string>>(() => {
    if (!strategy) return {};
    const defaults: Record<string, number | string> = {};
    strategy.config.parameters.forEach(p => {
      defaults[p.key] = p.default;
    });
    return defaults;
  });

  // Reset params when strategy changes
  const [prevId, setPrevId] = useState(strategyId);
  if (strategyId !== prevId) {
    setPrevId(strategyId);
    if (strategy) {
      const defaults: Record<string, number | string> = {};
      strategy.config.parameters.forEach(p => {
        defaults[p.key] = p.default;
      });
      setParams(defaults);
    }
  }

  const result = useMemo(() => {
    if (!strategy) return null;
    return strategy.run(params);
  }, [strategy, params]);

  if (!strategy || !result) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ color: theme.textMuted }}>Strategy not found</h2>
        <p style={{ color: theme.textMuted }}>Select a strategy from the sidebar.</p>
      </div>
    );
  }

  const handleParamChange = (key: string, value: number | string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const fmtDollar = (v: number) => `$${Math.round(v).toLocaleString()}`;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
          {strategy.config.name}
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, maxWidth: 700 }}>
          {strategy.config.description}
        </p>
      </div>

      {/* Parameters */}
      <div style={{ marginBottom: 24 }}>
        <ParameterPanel
          parameters={strategy.config.parameters}
          values={params}
          onChange={handleParamChange}
        />
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        <StatCard
          label="Total Return"
          value={fmtPct(result.totalReturn)}
          icon={<TrendingUp size={14} />}
          positive={result.totalReturn > 0}
          negative={result.totalReturn < 0}
          subtext={`${fmtDollar(result.strategyCumulative[result.strategyCumulative.length - 1])} from $10k`}
        />
        <StatCard
          label="Annualized"
          value={fmtPct(result.annualizedReturn)}
          icon={<Activity size={14} />}
          positive={result.annualizedReturn > 0}
          negative={result.annualizedReturn < 0}
          subtext={`Over ${result.years.length} years`}
        />
        <StatCard
          label="Max Drawdown"
          value={fmtPct(result.maxDrawdown)}
          icon={<TrendingDown size={14} />}
          negative
          subtext="Peak to trough"
        />
        <StatCard
          label="Sharpe Ratio"
          value={result.sharpeRatio.toFixed(2)}
          icon={<BarChart3 size={14} />}
          subtext="Risk-adjusted return"
        />
        <StatCard
          label="Win Rate"
          value={fmtPct(result.winRate)}
          icon={<Target size={14} />}
          positive={result.winRate > 0.5}
          negative={result.winRate < 0.5}
          subtext="Years beating S&P 500"
        />
        <StatCard
          label="Best Year"
          value={`${fmtPct(result.bestYear.return)}`}
          icon={<Award size={14} />}
          positive
          subtext={`In ${result.bestYear.year}`}
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <CumulativeChart result={result} strategyName={strategy.config.name} />
        <AnnualReturnsChart result={result} strategyName={strategy.config.name} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
          <DrawdownChart result={result} />
          <HoldingsTable result={result} />
        </div>
      </div>
    </div>
  );
}
