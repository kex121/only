import { THEMES_COUNT } from '@utils/data';

import type { Dot } from './types';

const calculateDots = (centerX: number, centerY: number, circleRadius: number): Dot[] => {
  const labelWidth = 120;
  const labelOffset = 40;

  return Array.from({ length: THEMES_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / THEMES_COUNT;
    const x = centerX + circleRadius * Math.cos(angle);
    const y = centerY + circleRadius * Math.sin(angle);

    let labelX, labelY;

    if (angle <= Math.PI / 6) {
      labelX = x + labelOffset;
      labelY = y;
    } else if (angle <= Math.PI / 2) {
      labelX = x + labelOffset;
      labelY = y + 10;
    } else if (angle <= (5 * Math.PI) / 6) {
      labelX = x + 30;
      labelY = y + 40;
    } else if (angle <= (7 * Math.PI) / 6) {
      labelX = x - labelWidth - labelOffset;
      labelY = y + 20;
    } else if (angle <= (3 * Math.PI) / 2) {
      labelX = x - labelWidth - labelOffset;
      labelY = y;
    } else {
      labelX = x + 30;
      labelY = y - 30;
    }

    return {
      x,
      y,
      id: i + 1,
      labelX,
      labelY,
    };
  });
};

export default calculateDots;
