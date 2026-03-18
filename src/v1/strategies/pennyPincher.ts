import { getStockData } from '../data/marketData';
import { runStrategy } from './engine';
import type { StrategyConfig, StrategyRunner } from './types';

export const pennyPincherConfig: StrategyConfig = {
  id: 'penny-pincher',
  name: 'Penny Pincher',
  description: 'Buy only the cheapest stocks by share price. Ignore fundamentals — if it\'s cheap, it\'s in. This exploits a real behavioral bias: retail investors love low-priced stocks, believing $5 shares have "more room to grow" than $500 ones.',
  parameters: [
    {
      key: 'maxPrice',
      label: 'Max Share Price',
      type: 'range',
      min: 5,
      max: 200,
      step: 5,
      default: 30,
      unit: '$',
      tooltip: 'Only buy stocks priced below this amount',
    },
    {
      key: 'minPrice',
      label: 'Min Share Price',
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
      default: 1,
      unit: '$',
      tooltip: 'Only buy stocks priced above this amount',
    },
    {
      key: 'sortBy',
      label: 'Sort By',
      type: 'select',
      default: 'cheapest',
      options: [
        { label: 'Cheapest first', value: 'cheapest' },
        { label: 'Most expensive first', value: 'expensive' },
        { label: 'Random within range', value: 'random' },
      ],
    },
    {
      key: 'maxHoldings',
      label: 'Max Holdings',
      type: 'range',
      min: 5,
      max: 50,
      step: 5,
      default: 20,
    },
  ],
};

export const runPennyPincher: StrategyRunner = (params) => {
  const maxPrice = params.maxPrice as number;
  const minPrice = params.minPrice as number;
  const sortBy = params.sortBy as string;
  const maxHoldings = params.maxHoldings as number;
  const allData = getStockData();

  return runStrategy((year) => {
    // Use prior year-end price to select
    const priorYear = year - 1;
    const candidates = allData.filter(d =>
      d.year === priorYear && d.price >= minPrice && d.price <= maxPrice
    );

    if (sortBy === 'cheapest') {
      candidates.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'expensive') {
      candidates.sort((a, b) => b.price - a.price);
    } else {
      // Deterministic shuffle based on year
      candidates.sort((a, b) => {
        const hashA = (a.ticker.charCodeAt(0) * 31 + year) % 1000;
        const hashB = (b.ticker.charCodeAt(0) * 31 + year) % 1000;
        return hashA - hashB;
      });
    }

    return candidates.slice(0, maxHoldings).map(d => d.ticker);
  });
};
