import React, { useState, useEffect, useRef } from 'react';

import { themes, THEMES_COUNT, type Theme } from '@utils/index';
import { throttle } from '@utils/helpers';

import DiagramLines from '../DiagramLines';
import Title from '../Title';
import Navigation from '../Navigation';
import FactsSlider from '../FactsSlider';

import './timeline.scss';

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const titleRef = useRef<HTMLDivElement>(null);
  const [lineY, setLineY] = useState(0);

  useEffect(() => {
    if (!selectedTheme && THEMES_COUNT > 0) {
      setSelectedTheme(themes[0]);
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    const updateLineY = () => {
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect();
        setLineY(rect.top + window.scrollY);
      }
    };

    const handleResize = throttle(() => {
      updateDimensions();
      updateLineY();
    }, 400);

    updateDimensions();
    updateLineY();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handlePrevTheme = () => {
    const currentIndex = themes.findIndex((t: Theme) => t.id === selectedTheme?.id);
    const prevIndex = (currentIndex - 1 + THEMES_COUNT) % THEMES_COUNT;
    setSelectedTheme(themes[prevIndex]);
  };

  const handleNextTheme = () => {
    const currentIndex = themes.findIndex((t: Theme) => t.id === selectedTheme?.id);
    const nextIndex = (currentIndex + 1) % THEMES_COUNT;
    setSelectedTheme(themes[nextIndex]);
  };

  return (
    <div className="timeline-container" ref={containerRef}>
      <div className="main-content">
        <Title ref={titleRef} />
        {selectedTheme && (
          <div className="timeline-period">
            <span className="timeline-period-label timeline-period-start-date">
              {selectedTheme.period.start}
            </span>
            <span className="timeline-period-label timeline-period-end-date">
              {selectedTheme.period.end}
            </span>
          </div>
        )}
        <Navigation
          selectedTheme={selectedTheme}
          onPrev={handlePrevTheme}
          onNext={handleNextTheme}
        />
        {dimensions.width > 0 && dimensions.height > 0 && (
          <DiagramLines
            width={dimensions.width}
            height={dimensions.height}
            selectedTheme={selectedTheme}
            onThemeSelect={handleThemeSelect}
            lineY={lineY}
          />
        )}
      </div>

      <div className="facts-container">
        {selectedTheme && <FactsSlider facts={selectedTheme.facts} />}
      </div>
    </div>
  );
};

export default Timeline;
