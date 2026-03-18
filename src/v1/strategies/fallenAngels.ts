import { getStockData } from '../data/marketData';
import { runStrategy } from './engine';
import type { StrategyConfig, StrategyRunner } from './types';

export const fallenAngelsConfig: StrategyConfig = {
  id: 'fallen-angels',
  name: 'Fallen Angels',
  description: 'Each year, buy only S&P 500 stocks that fell by at least X% the previous year. The contrarian bet: last year\'s losers become this year\'s winners. Based on the idea of mean reversion — stocks that crash often bounce back.',
  parameters: [
    {
      key: 'dropThreshold',
      label: 'Min Drop Threshold',
      type: 'range',
      min: -80,
      max: -5,
      step: 5,
      default: -10,
      unit: '%',
      tooltip: 'Minimum percentage decline in prior year to qualify',
    },
    {
      key: 'rebalance',
      label: 'Rebalance Frequency',
      type: 'select',
      default: 'annual',
      options: [
        { label: 'Annual', value: 'annual' },
        { label: 'Semi-Annual', value: 'semi' },
        { label: 'Quarterly', value: 'quarterly' },
      ],
    },
    {
      key: 'maxHoldings',
      label: 'Max Holdings',
      type: 'range',
      min: 5,
      max: 50,
      step: 5,
      default: 50,
      tooltip: 'Maximum number of stocks to hold',
    },
  ],
};

export const runFallenAngels: StrategyRunner = (params) => {
  const threshold = (params.dropThreshold as number) / 100;
  const maxHoldings = params.maxHoldings as number;
  const allData = getStockData();

  return runStrategy((year) => {
    const priorYear = year - 1;
    const priorData = allData.filter(d => d.year === priorYear && d.returnPct <= threshold);

    // Sort by worst performers first, take up to maxHoldings
    priorData.sort((a, b) => a.returnPct - b.returnPct);
    return priorData.slice(0, maxHoldings).map(d => d.ticker);
  });
};
