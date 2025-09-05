import type { GeometryResult } from './types';

const calculateGeometry = (width: number, height: number): GeometryResult => {
  const centerX = width / 2;
  const centerY = height / 2.5;
  const minSize = Math.min(width, height);
  const circleRadius = Math.min(minSize * 0.25, 400);

  return { centerX, centerY, minSize, circleRadius };
};

export default calculateGeometry;
