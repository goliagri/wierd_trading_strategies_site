import { getStockData, getTickers } from '../data/marketData';
import { runStrategy } from './engine';
import type { StrategyConfig, StrategyRunner } from './types';

export const mondayMayhemConfig: StrategyConfig = {
  id: 'monday-mayhem',
  name: 'Monday Mayhem',
  description: 'Select stocks based on the day of the week the year starts on. The "Monday Effect" is a real market anomaly — stocks tend to drop on Mondays. This strategy takes it to an absurd extreme: your entire portfolio depends on what day January 1st falls on.',
  parameters: [
    {
      key: 'targetDay',
      label: 'Target Day',
      type: 'select',
      default: 'monday',
      options: [
        { label: 'Monday', value: 'monday' },
        { label: 'Tuesday', value: 'tuesday' },
        { label: 'Wednesday', value: 'wednesday' },
        { label: 'Thursday', value: 'thursday' },
        { label: 'Friday', value: 'friday' },
      ],
    },
    {
      key: 'strategy',
      label: 'When Day Matches',
      type: 'select',
      default: 'aggressive',
      options: [
        { label: 'Go aggressive (high-beta)', value: 'aggressive' },
        { label: 'Go defensive (low-beta)', value: 'defensive' },
        { label: 'Go to cash', value: 'cash' },
      ],
    },
    {
      key: 'holdCount',
      label: 'Number of Stocks',
      type: 'range',
      min: 5,
      max: 50,
      step: 5,
      default: 20,
    },
  ],
};

function getDayOfWeek(year: number): string {
  const day = new Date(year, 0, 1).getDay();
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day];
}

export const runMondayMayhem: StrategyRunner = (params) => {
  const targetDay = params.targetDay as string;
  const strategy = params.strategy as string;
  const holdCount = params.holdCount as number;
  const allData = getStockData();

  return runStrategy((year) => {
    const dayOfWeek = getDayOfWeek(year);
    const isTargetDay = dayOfWeek === targetDay;

    if (isTargetDay && strategy === 'cash') return [];

    const yearData = allData.filter(d => d.year === year);

    // Sort by volatility proxy (absolute return of prior year)
    const priorData = allData.filter(d => d.year === year - 1);
    const tickerVolatility = new Map<string, number>();
    priorData.forEach(d => tickerVolatility.set(d.ticker, Math.abs(d.returnPct)));

    const available = yearData
      .filter(d => tickerVolatility.has(d.ticker))
      .sort((a, b) => {
        const volA = tickerVolatility.get(a.ticker)!;
        const volB = tickerVolatility.get(b.ticker)!;
        // Aggressive = highest volatility; defensive = lowest
        if (isTargetDay && strategy === 'aggressive') return volB - volA;
        if (isTargetDay && strategy === 'defensive') return volA - volB;
        // Non-target day: just pick the middle
        return volA - volB;
      });

    return available.slice(0, holdCount).map(d => d.ticker);
  });
};
