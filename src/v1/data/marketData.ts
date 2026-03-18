// Simulated historical S&P 500 market data for backtesting
// Uses seeded pseudo-random generation for reproducible results

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface StockYear {
  ticker: string;
  year: number;
  returnPct: number; // e.g. 0.12 = 12%
  price: number;
  marketCap: number; // in billions
}

// Generate a realistic set of ~100 tickers representing S&P-like stocks
const TICKERS = [
  'AAPL','MSFT','AMZN','GOOGL','META','NVDA','TSLA','BRK.B','JNJ','V',
  'WMT','JPM','PG','UNH','HD','MA','DIS','BAC','XOM','PFE',
  'KO','PEP','CSCO','ABBV','TMO','AVGO','COST','MRK','ABT','CVX',
  'ACN','LLY','MCD','DHR','ADBE','TXN','NEE','MDT','HON','QCOM',
  'AMGN','PM','UNP','RTX','LOW','MS','INTC','BMY','SBUX','GS',
  'BLK','CAT','DE','AXP','ISRG','GILD','NOW','AMD','INTU','BKNG',
  'MDLZ','TGT','CB','SYK','PLD','ADI','MMC','CI','CL','FIS',
  'SO','ZTS','DUK','BDX','CME','ITW','APD','NSC','SHW','ICE',
  'MO','REGN','TFC','CCI','GD','ATVI','WM','D','SLB','EOG',
  'GM','F','AAL','UAL','DAL','CCL','NCLH','RCL','MGM','LVS',
];

const START_YEAR = 2000;
const END_YEAR = 2024;

// Market regime simulation: some years bull, some bear, some flat
const MARKET_REGIMES: Record<number, { mean: number; vol: number }> = {};
const regimeRng = seededRandom(42);
for (let y = START_YEAR - 1; y <= END_YEAR; y++) {
  const cycle = Math.sin((y - 2000) * 0.5) * 0.06;
  // Add regime-like behavior
  const regime = regimeRng();
  let mean: number, vol: number;
  if (regime < 0.15) { // bear
    mean = -0.15 + cycle;
    vol = 0.30;
  } else if (regime < 0.35) { // flat
    mean = 0.02 + cycle;
    vol = 0.18;
  } else { // bull
    mean = 0.12 + cycle;
    vol = 0.20;
  }
  MARKET_REGIMES[y] = { mean, vol };
}

// Override with roughly accurate major events
MARKET_REGIMES[2000] = { mean: -0.10, vol: 0.30 };
MARKET_REGIMES[2001] = { mean: -0.13, vol: 0.28 };
MARKET_REGIMES[2002] = { mean: -0.23, vol: 0.32 };
MARKET_REGIMES[2003] = { mean: 0.26, vol: 0.22 };
MARKET_REGIMES[2007] = { mean: 0.04, vol: 0.22 };
MARKET_REGIMES[2008] = { mean: -0.38, vol: 0.45 };
MARKET_REGIMES[2009] = { mean: 0.23, vol: 0.30 };
MARKET_REGIMES[2010] = { mean: 0.13, vol: 0.22 };
MARKET_REGIMES[2013] = { mean: 0.30, vol: 0.15 };
MARKET_REGIMES[2017] = { mean: 0.19, vol: 0.12 };
MARKET_REGIMES[2018] = { mean: -0.06, vol: 0.22 };
MARKET_REGIMES[2019] = { mean: 0.29, vol: 0.16 };
MARKET_REGIMES[2020] = { mean: 0.16, vol: 0.40 };
MARKET_REGIMES[2021] = { mean: 0.27, vol: 0.20 };
MARKET_REGIMES[2022] = { mean: -0.19, vol: 0.28 };
MARKET_REGIMES[2023] = { mean: 0.24, vol: 0.18 };
MARKET_REGIMES[2024] = { mean: 0.23, vol: 0.16 };

// Generate stock data
let stockDataCache: StockYear[] | null = null;

export function getStockData(): StockYear[] {
  if (stockDataCache) return stockDataCache;

  const data: StockYear[] = [];

  for (let i = 0; i < TICKERS.length; i++) {
    const ticker = TICKERS[i];
    const rng = seededRandom(i * 1000 + 7);

    // Each stock has a "personality": beta, size, sector bias
    const beta = 0.5 + rng() * 1.5; // 0.5 to 2.0
    const idioVol = 0.10 + rng() * 0.25;
    let price = 20 + rng() * 180;
    const baseMktCap = 10 + rng() * 490; // $10B to $500B

    for (let year = START_YEAR - 1; year <= END_YEAR; year++) {
      const regime = MARKET_REGIMES[year] || { mean: 0.08, vol: 0.20 };
      const marketReturn = regime.mean;

      // Stock return = beta * market + idiosyncratic
      const idio = (rng() + rng() + rng() - 1.5) * idioVol * 2;
      const stockReturn = beta * marketReturn + idio;

      // Clamp to realistic range
      const clampedReturn = Math.max(-0.85, Math.min(3.0, stockReturn));

      data.push({
        ticker,
        year,
        returnPct: clampedReturn,
        price: price,
        marketCap: baseMktCap * (1 + clampedReturn) * (0.8 + rng() * 0.4),
      });

      price = Math.max(1, price * (1 + clampedReturn));
    }
  }

  stockDataCache = data;
  return data;
}

export function getMarketReturn(year: number): number {
  return MARKET_REGIMES[year]?.mean ?? 0.08;
}

export function getYears(): number[] {
  const years: number[] = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) years.push(y);
  return years;
}

export function getTickers(): string[] {
  return [...TICKERS];
}

// Get quarterly returns by splitting annual returns (simplified)
export function getQuarterlyReturns(ticker: string, year: number): number[] {
  const data = getStockData();
  const entry = data.find(d => d.ticker === ticker && d.year === year);
  if (!entry) return [0, 0, 0, 0];

  const rng = seededRandom(ticker.charCodeAt(0) * 100 + year);
  const annual = entry.returnPct;

  // Split annual return into 4 quarters with some variance
  const weights = [rng(), rng(), rng(), rng()];
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => annual * (w / sum) * (0.7 + rng() * 0.6));
}

// S&P 500 index return (equal weight of all stocks, simplified)
export function getSP500Return(year: number): number {
  return getMarketReturn(year);
}
