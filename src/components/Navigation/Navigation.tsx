import React from 'react';

import arrowNav from '@assets/arrow-nav.svg';
import { THEMES_COUNT, type Theme } from '@utils/index';

import './navigation.scss';

interface NavigationProps {
  selectedTheme: Theme | null;
  onPrev: () => void;
  onNext: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ selectedTheme, onPrev, onNext }) => {
  return (
    <nav className="navigation" tabIndex={0}>
      <div className="counter">
        {selectedTheme ? String(selectedTheme.id).padStart(2, '0') : '01'}/
        <span className="total">{String(THEMES_COUNT).padStart(2, '0')}</span>
      </div>
      <div className="controls">
        <button className="nav-button" onClick={onPrev} aria-label="Previous theme">
          <img src={arrowNav} alt="Previous" className="arrow-icon" />
        </button>
        <button className="nav-button" onClick={onNext} aria-label="Next theme">
          <img
            src={arrowNav}
            alt="Next"
            className="arrow-icon"
            style={{
              transform: 'rotate(180deg)',
            }}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
