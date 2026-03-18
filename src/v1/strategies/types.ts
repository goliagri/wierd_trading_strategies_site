export interface StrategyConfig {
  id: string;
  name: string;
  description: string;
  parameters: ParameterDef[];
}

export interface ParameterDef {
  key: string;
  label: string;
  type: 'range' | 'select';
  min?: number;
  max?: number;
  step?: number;
  default: number | string;
  options?: { label: string; value: string | number }[];
  unit?: string;
  tooltip?: string;
}

export interface StrategyResult {
  years: number[];
  strategyReturns: number[];       // annual % returns
  benchmarkReturns: number[];      // S&P 500 annual % returns
  strategyCumulative: number[];    // cumulative growth of $10k
  benchmarkCumulative: number[];   // cumulative growth of $10k
  holdingsPerYear: { year: number; tickers: string[]; count: number }[];
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  bestYear: { year: number; return: number };
  worstYear: { year: number; return: number };
  winRate: number; // % of years beating benchmark
}

export type StrategyRunner = (params: Record<string, number | string>) => StrategyResult;
