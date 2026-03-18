import { getStockData, getTickers } from '../data/marketData';
import { runStrategy } from './engine';
import type { StrategyConfig, StrategyRunner } from './types';

export const dartboardConfig: StrategyConfig = {
  id: 'dartboard',
  name: 'Dartboard Portfolio',
  description: 'Throw darts at a board of stocks and buy whatever you hit. This is the classic "monkey with a dartboard" thought experiment. Research shows random stock picking often beats professional fund managers — a humbling benchmark for any strategy.',
  parameters: [
    {
      key: 'numStocks',
      label: 'Number of Darts',
      type: 'range',
      min: 1,
      max: 50,
      step: 1,
      default: 10,
      tooltip: 'How many stocks to randomly select',
    },
    {
      key: 'seed',
      label: 'Luck Factor (Random Seed)',
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
      default: 42,
      tooltip: 'Different seeds = different dart throws. Try a few!',
    },
    {
      key: 'reshuffleFreq',
      label: 'Reshuffle Every',
      type: 'select',
      default: 'annual',
      options: [
        { label: 'Every year', value: 'annual' },
        { label: 'Every 2 years', value: 'biennial' },
        { label: 'Every 5 years', value: 'quinquennial' },
        { label: 'Never (buy & hold)', value: 'never' },
      ],
    },
  ],
};

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  const next = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const runDartboard: StrategyRunner = (params) => {
  const numStocks = params.numStocks as number;
  const seed = params.seed as number;
  const reshuffleFreq = params.reshuffleFreq as string;
  const tickers = getTickers();
  const allData = getStockData();

  let currentPicks: string[] = [];
  let lastShuffleYear = 0;

  return runStrategy((year) => {
    const shouldReshuffle = (() => {
      if (currentPicks.length === 0) return true;
      if (reshuffleFreq === 'never') return lastShuffleYear === 0;
      if (reshuffleFreq === 'annual') return true;
      if (reshuffleFreq === 'biennial') return (year - lastShuffleYear) >= 2;
      if (reshuffleFreq === 'quinquennial') return (year - lastShuffleYear) >= 5;
      return true;
    })();

    if (shouldReshuffle) {
      const yearSeed = seed * 1000 + year;
      const available = tickers.filter(t => allData.some(d => d.ticker === t && d.year === year));
      currentPicks = seededShuffle(available, yearSeed).slice(0, numStocks);
      lastShuffleYear = year;
    }

    return currentPicks;
  });
};
