import { getStockData, getSP500Return, getYears } from '../data/marketData';
import type { StrategyResult } from './types';

// Compute strategy result from a stock selection function
export function runStrategy(
  selectStocks: (year: number) => string[],
  startYear?: number,
  endYear?: number,
): StrategyResult {
  const allData = getStockData();
  const years = getYears().filter(y =>
    (!startYear || y >= startYear) && (!endYear || y <= endYear)
  );

  const strategyReturns: number[] = [];
  const benchmarkReturns: number[] = [];
  const holdingsPerYear: { year: number; tickers: string[]; count: number }[] = [];

  for (const year of years) {
    const selectedTickers = selectStocks(year);
    const sp500Return = getSP500Return(year);

    if (selectedTickers.length === 0) {
      // If no stocks selected, assume cash (0% return)
      strategyReturns.push(0);
    } else {
      // Equal-weight portfolio return
      const returns = selectedTickers.map(ticker => {
        const entry = allData.find(d => d.ticker === ticker && d.year === year);
        return entry?.returnPct ?? 0;
      });
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      strategyReturns.push(avgReturn);
    }

    benchmarkReturns.push(sp500Return);
    holdingsPerYear.push({ year, tickers: selectedTickers, count: selectedTickers.length });
  }

  // Cumulative returns (growth of $10,000)
  const strategyCumulative: number[] = [10000];
  const benchmarkCumulative: number[] = [10000];

  for (let i = 0; i < strategyReturns.length; i++) {
    strategyCumulative.push(strategyCumulative[i] * (1 + strategyReturns[i]));
    benchmarkCumulative.push(benchmarkCumulative[i] * (1 + benchmarkReturns[i]));
  }

  // Statistics
  const totalReturn = (strategyCumulative[strategyCumulative.length - 1] / 10000) - 1;
  const n = strategyReturns.length;
  const annualizedReturn = Math.pow(1 + totalReturn, 1 / n) - 1;

  // Max drawdown
  let peak = strategyCumulative[0];
  let maxDrawdown = 0;
  for (const val of strategyCumulative) {
    if (val > peak) peak = val;
    const dd = (peak - val) / peak;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  // Sharpe ratio (simplified: assuming 2% risk-free rate)
  const excessReturns = strategyReturns.map(r => r - 0.02);
  const meanExcess = excessReturns.reduce((a, b) => a + b, 0) / n;
  const variance = excessReturns.reduce((a, b) => a + (b - meanExcess) ** 2, 0) / n;
  const sharpeRatio = variance > 0 ? meanExcess / Math.sqrt(variance) : 0;

  // Best/worst years
  let bestYear = { year: years[0], return: strategyReturns[0] };
  let worstYear = { year: years[0], return: strategyReturns[0] };
  for (let i = 0; i < n; i++) {
    if (strategyReturns[i] > bestYear.return) bestYear = { year: years[i], return: strategyReturns[i] };
    if (strategyReturns[i] < worstYear.return) worstYear = { year: years[i], return: strategyReturns[i] };
  }

  // Win rate (beat benchmark)
  const wins = strategyReturns.filter((r, i) => r > benchmarkReturns[i]).length;
  const winRate = wins / n;

  return {
    years,
    strategyReturns,
    benchmarkReturns,
    strategyCumulative,
    benchmarkCumulative,
    holdingsPerYear,
    totalReturn,
    annualizedReturn,
    maxDrawdown,
    sharpeRatio,
    bestYear,
    worstYear,
    winRate,
  };
}
