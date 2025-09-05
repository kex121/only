import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import {
  calculateGeometry,
  calculatePaddings,
  calculateDots,
  themes,
  type Theme,
  type Dot,
  THEMES_COUNT,
  calculateRotation,
} from '@utils/index';
import './diagram-lines.scss';

import { SIZING, COLORS, ANIMATION_CONFIG, ANIMATION_EASING, LABEL_CONFIG } from './constants';

interface DiagramLinesProps {
  width: number;
  height: number;
  selectedTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
  lineY: number;
}

const DiagramLines: React.FC<DiagramLinesProps> = ({
  width,
  height,
  selectedTheme,
  onThemeSelect,
  lineY,
}) => {
  const { centerX, centerY, minSize, circleRadius } = calculateGeometry(width, height);
  const { leftPadding, rightPadding } = calculatePaddings(width);

  const dots = calculateDots(centerX, centerY, circleRadius);

  const calculatedSizes = useMemo(
    () => ({
      lineStrokeWidth: Math.min(
        Math.max(minSize * SIZING.LINE_STROKE_MIN_RATIO, SIZING.LINE_STROKE_MIN),
        SIZING.LINE_STROKE_MAX,
      ),
      gradientLineWidth: Math.min(
        Math.max(minSize * SIZING.GRADIENT_LINE_MIN_RATIO, SIZING.GRADIENT_LINE_MIN),
        SIZING.GRADIENT_LINE_MAX,
      ),
      dotRadius: Math.min(
        Math.max(minSize * SIZING.DOT_RADIUS_MIN_RATIO, SIZING.DOT_RADIUS_MIN),
        SIZING.DOT_RADIUS_MAX,
      ),
      selectedDotRadius: Math.min(
        Math.max(minSize * SIZING.SELECTED_DOT_RADIUS_MIN_RATIO, SIZING.SELECTED_DOT_RADIUS_MIN),
        SIZING.SELECTED_DOT_RADIUS_MAX,
      ),
    }),
    [minSize],
  );

  const [hoveredDotId, setHoveredDotId] = useState<number | null>(null);

  const [rotation, setRotation] = useState(0);

  const svgRef = useRef<SVGSVGElement>(null);
  const circlesRefs = useRef<(SVGCircleElement | null)[]>(new Array(THEMES_COUNT).fill(null));
  const textsRefs = useRef<(SVGTextElement | null)[]>(new Array(THEMES_COUNT).fill(null));
  const labelRef = useRef<HTMLDivElement>(null);

  const animateDot = (index: number, isSelected: boolean, isHovered: boolean) => {
    const circle = circlesRefs.current[index];
    const text = textsRefs.current[index];

    if (circle) {
      gsap.to(circle, {
        r:
          isSelected || isHovered
            ? isSelected
              ? calculatedSizes.selectedDotRadius
              : calculatedSizes.selectedDotRadius * SIZING.HOVERED_DOT_SCALE
            : calculatedSizes.dotRadius,
        fill: isSelected || isHovered ? COLORS.DOT_ACTIVE : COLORS.DOT_DEFAULT,
        stroke: isSelected || isHovered ? COLORS.DOT_STROKE : 'transparent',
        strokeWidth: isSelected || isHovered ? 1 : 0,
        duration: ANIMATION_CONFIG.DOT_DURATION,
        ease: ANIMATION_EASING.DOT,
      });
    }

    if (text) {
      gsap.to(text, {
        opacity: isSelected || isHovered ? 1 : 0,
        duration: ANIMATION_CONFIG.DOT_DURATION,
        ease: ANIMATION_EASING.DOT,
      });
    }
  };

  const updateAllDots = () => {
    dots.forEach((_, index) => {
      const dotId = index + 1;
      const isSelected = selectedTheme?.id === dotId;
      const isHovered = hoveredDotId === dotId;
      animateDot(index, isSelected, isHovered);
    });
  };

  useEffect(() => {
    if (!selectedTheme) return;
    setHoveredDotId(null);

    const selectedIndex = selectedTheme.id - 1;
    const newRotation = calculateRotation(selectedIndex, THEMES_COUNT);
    updateAllDots();

    const tl = gsap.timeline();
    tl.to(
      { value: rotation },
      {
        value: newRotation,
        duration: ANIMATION_CONFIG.ROTATION_DURATION,
        ease: ANIMATION_EASING.ROTATION,
        onUpdate: function () {
          setRotation(this.targets()[0].value);
        },
        onComplete: () => {
          if (labelRef.current) {
            gsap.fromTo(
              labelRef.current,
              { opacity: 0 },
              {
                opacity: 1,
                duration: ANIMATION_CONFIG.LABEL_DURATION,
              },
            );
          }
        },
      },
    );

    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0 });
    }

    return () => {
      gsap.killTweensOf([
        circlesRefs.current.filter(Boolean),
        textsRefs.current.filter(Boolean),
        labelRef.current,
      ]);
    };
  }, [selectedTheme]);

  useEffect(() => {
    updateAllDots();
  }, [hoveredDotId]);

  const themesMap = new Map(themes.map((theme) => [theme.id, theme]));

  const rotatePoint = (dot: Dot, angle: number): { x: number; y: number } => {
    const angleRad = (angle * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const dx = dot.x - centerX;
    const dy = dot.y - centerY;

    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos,
    };
  };

  const getLabelPosition = () => {
    if (!selectedTheme) return { x: 0, y: 0 };

    const selectedDotIndex = selectedTheme.id - 1;
    const dot = dots[selectedDotIndex];

    const rotatedPoint = rotatePoint(dot, rotation);

    const labelOffset = calculatedSizes.selectedDotRadius * LABEL_CONFIG.OFFSET_MULTIPLIER;

    return {
      x: rotatedPoint.x + labelOffset,
      y: rotatedPoint.y - labelOffset * LABEL_CONFIG.VERTICAL_OFFSET_MULTIPLIER,
    };
  };

  const labelPosition = getLabelPosition();

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="diagram-lines"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="blueToRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={COLORS.GRADIENT_START} />
          <stop offset="100%" stopColor={COLORS.GRADIENT_END} />
        </linearGradient>
      </defs>

      <line
        className="diagram-line"
        x1={leftPadding}
        y1={centerY}
        x2={width - rightPadding}
        y2={centerY}
        strokeWidth={calculatedSizes.lineStrokeWidth}
      />

      <line
        className="diagram-line"
        x1={centerX}
        y1={0}
        x2={centerX}
        y2={height}
        strokeWidth={calculatedSizes.lineStrokeWidth}
      />

      <line
        className="diagram-line"
        x1={leftPadding}
        y1={0}
        x2={leftPadding}
        y2={height}
        strokeWidth={calculatedSizes.lineStrokeWidth}
      />

      <rect
        className="gradient-line"
        x={leftPadding - calculatedSizes.gradientLineWidth / 2}
        y={lineY}
        width={calculatedSizes.gradientLineWidth}
        height={Math.min(lineY + 30, 110)}
      />

      <line
        className="diagram-line"
        x1={width - rightPadding}
        y1={0}
        x2={width - rightPadding}
        y2={height}
        strokeWidth={calculatedSizes.lineStrokeWidth}
      />

      <circle
        className="diagram-circle"
        cx={centerX}
        cy={centerY}
        r={circleRadius}
        strokeWidth={calculatedSizes.lineStrokeWidth}
      />

      {selectedTheme && (
        <>
          <text
            className="diagram-period-label start-date"
            x={centerX - circleRadius + LABEL_CONFIG.PERIOD_OFFSET_X}
            y={centerY + LABEL_CONFIG.PERIOD_OFFSET_Y}
            textAnchor="end"
          >
            {selectedTheme.period.start}
          </text>
          <text
            className="diagram-period-label end-date"
            x={centerX + circleRadius - LABEL_CONFIG.PERIOD_OFFSET_X}
            y={centerY + LABEL_CONFIG.PERIOD_OFFSET_Y}
            textAnchor="start"
          >
            {selectedTheme.period.end}
          </text>
        </>
      )}

      {dots.map((dot: Dot, index: number) => {
        const dotId = index + 1;
        const isSelected = selectedTheme?.id === dotId;
        const isHovered = hoveredDotId === dotId;

        const rotatedPoint = rotatePoint(dot, rotation);

        return (
          <g key={dotId}>
            <circle
              className="diagram-dot-hover-area"
              cx={rotatedPoint.x}
              cy={rotatedPoint.y}
              r={calculatedSizes.selectedDotRadius}
              fill="transparent"
              style={{ cursor: !isSelected ? 'pointer' : 'default' }}
              onClick={() => !isSelected && onThemeSelect(themesMap.get(dotId)!)}
              onMouseEnter={() => !isSelected && setHoveredDotId(dotId)}
              onMouseLeave={() => !isSelected && setHoveredDotId(null)}
            />
            <circle
              ref={(el) => (circlesRefs.current[index] = el)}
              className={isSelected ? 'diagram-dot-selected' : 'diagram-dot'}
              cx={rotatedPoint.x}
              cy={rotatedPoint.y}
              r={
                isSelected || isHovered
                  ? calculatedSizes.selectedDotRadius
                  : calculatedSizes.dotRadius
              }
              fill={isSelected || isHovered ? COLORS.DOT_ACTIVE : COLORS.DOT_DEFAULT}
              stroke={isSelected || isHovered ? COLORS.DOT_STROKE : 'transparent'}
              strokeWidth={isSelected || isHovered ? '1' : '0'}
              style={{
                transition: `r ${ANIMATION_CONFIG.DOT_DURATION}s ease-out, fill ${ANIMATION_CONFIG.DOT_DURATION}s ease-out, stroke ${ANIMATION_CONFIG.DOT_DURATION}s ease-out, stroke-width ${ANIMATION_CONFIG.DOT_DURATION}s ease-out`,
                pointerEvents: 'none',
              }}
            />

            <text
              ref={(el) => (textsRefs.current[index] = el)}
              x={rotatedPoint.x}
              y={rotatedPoint.y}
              className="diagram-dot-number"
            >
              {dotId}
            </text>
          </g>
        );
      })}

      <foreignObject
        x={labelPosition.x - LABEL_CONFIG.POSITION_ADJUSTMENT}
        y={labelPosition.y + LABEL_CONFIG.PERIOD_OFFSET_Y}
        width={LABEL_CONFIG.WIDTH}
        height={LABEL_CONFIG.HEIGHT}
      >
        <div ref={labelRef} className="theme-label-container">
          {selectedTheme && themes.find((theme: Theme) => theme.id === selectedTheme.id)?.name}
        </div>
      </foreignObject>
    </svg>
  );
};

export default memo(DiagramLines);
