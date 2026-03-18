import { getStockData, getTickers } from '../data/marketData';
import { runStrategy } from './engine';
import type { StrategyConfig, StrategyRunner } from './types';

export const alphabetSoupConfig: StrategyConfig = {
  id: 'alphabet-soup',
  name: 'Alphabet Soup',
  description: 'Buy only stocks whose ticker symbol starts with a specific letter. Does the alphabet predict returns? Probably not, but some letters are associated with specific sectors (X for energy/mining, F for Ford, etc.).',
  parameters: [
    {
      key: 'letter',
      label: 'Starting Letter',
      type: 'select',
      default: 'A',
      options: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({ label: l, value: l })),
    },
    {
      key: 'minLength',
      label: 'Min Ticker Length',
      type: 'range',
      min: 1,
      max: 5,
      step: 1,
      default: 1,
      tooltip: 'Minimum number of characters in ticker symbol',
    },
    {
      key: 'maxLength',
      label: 'Max Ticker Length',
      type: 'range',
      min: 1,
      max: 5,
      step: 1,
      default: 5,
      tooltip: 'Maximum number of characters in ticker symbol',
    },
  ],
};

export const runAlphabetSoup: StrategyRunner = (params) => {
  const letter = params.letter as string;
  const minLen = params.minLength as number;
  const maxLen = params.maxLength as number;
  const tickers = getTickers().filter(t =>
    t.startsWith(letter) && t.length >= minLen && t.length <= maxLen
  );

  return runStrategy((year) => {
    // Check which of our filtered tickers have data for this year
    const allData = getStockData();
    return tickers.filter(t => allData.some(d => d.ticker === t && d.year === year));
  });
};
