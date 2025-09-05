import type { PaddingsResult } from './types';

const calculatePaddings = (width: number): PaddingsResult => {
  const leftPadding = width * 0.2;
  const rightPadding = width * 0.1;

  return { leftPadding, rightPadding };
};

export default calculatePaddings;
