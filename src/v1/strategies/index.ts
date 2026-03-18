import type { StrategyConfig, StrategyRunner } from './types';
import { fallenAngelsConfig, runFallenAngels } from './fallenAngels';
import { alphabetSoupConfig, runAlphabetSoup } from './alphabetSoup';
import { mondayMayhemConfig, runMondayMayhem } from './mondayMayhem';
import { pennyPincherConfig, runPennyPincher } from './pennyPincher';
import { dartboardConfig, runDartboard } from './dartboard';

export const strategies: Record<string, { config: StrategyConfig; run: StrategyRunner }> = {
  'fallen-angels': { config: fallenAngelsConfig, run: runFallenAngels },
  'alphabet-soup': { config: alphabetSoupConfig, run: runAlphabetSoup },
  'monday-mayhem': { config: mondayMayhemConfig, run: runMondayMayhem },
  'penny-pincher': { config: pennyPincherConfig, run: runPennyPincher },
  'dartboard': { config: dartboardConfig, run: runDartboard },
};

export type { StrategyConfig, StrategyRunner, StrategyResult } from './types';
