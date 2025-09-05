import calculateDots from './dots';
import { calculateGeometry, calculatePaddings, calculateRotation } from './geometry';
import themes, { THEMES_COUNT } from './data';

import type { Theme } from './data/types';
import type { Dot } from './dots/types';

export {
  calculateDots,
  calculateGeometry,
  calculatePaddings,
  calculateRotation,
  themes,
  THEMES_COUNT,
};
export type { Theme, Dot };
