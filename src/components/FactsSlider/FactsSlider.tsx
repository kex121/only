import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import { useWindowWidth } from '@utils/hooks';

import FactCard from '../FactCard';

import type { Swiper as SwiperType } from 'swiper';
import type { HistoricalFact } from '@utils/data/types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './facts-slider.scss';

interface FactsSliderProps {
  facts: HistoricalFact[];
}

const FactsSlider: React.FC<FactsSliderProps> = ({ facts }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [secondVisibleSlideIndex, setSecondVisibleSlideIndex] = useState<number | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const width = useWindowWidth();
  const isMobile = width <= 769;

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    updateSecondVisible(swiper);
  };

  const updateSecondVisible = (swiper: SwiperType) => {
    const visibleIndexes = Array.from(swiper.slides)
      .map((slide, idx) => (slide.classList.contains('swiper-slide-visible') ? idx : -1))
      .filter((idx) => idx !== -1);

    setSecondVisibleSlideIndex(visibleIndexes.length > 1 ? visibleIndexes[1] : null);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    setSecondVisibleSlideIndex((swiper.activeIndex + 1) % facts.length);
  };

  const goToPrev = () => {
    swiperInstance?.slidePrev();
  };

  const goToNext = () => {
    swiperInstance?.slideNext();
  };

  if (!facts || facts.length === 0) {
    return null;
  }

  return (
    <div className="facts-slider">
      <div className="facts-slider__container">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.5}
          spaceBetween={50}
          slidesPerGroup={1}
          watchSlidesProgress={true}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            769: {
              slidesPerView: 3,
              pagination: false,
              spaceBetween: 15,
            },
          }}
          className="facts-slider__swiper"
        >
          {facts.map((fact, index) => (
            <SwiperSlide
              key={index}
              className={`facts-slider__slide ${
                isMobile && index === secondVisibleSlideIndex ? 'facts-slider__slide-gray' : ''
              }`}
            >
              <FactCard fact={fact}></FactCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {!isMobile &&
        facts.length > 3 &&
        [
          {
            ref: prevButtonRef,
            className: 'facts-slider__nav--prev',
            onClick: goToPrev,
            rotate: true,
          },
          {
            ref: nextButtonRef,
            className: 'facts-slider__nav--next',
            onClick: goToNext,
            rotate: false,
          },
        ].map(({ ref, className, onClick, rotate }, i) =>
          (i === 0 && isBeginning) || (i === 1 && isEnd) ? null : (
            <button
              key={className}
              ref={ref}
              className={`facts-slider__nav ${className}`}
              onClick={onClick}
            >
              <ArrowIcon style={rotate ? { transform: 'rotate(180deg)' } : undefined} />
            </button>
          ),
        )}
    </div>
  );
};

const ArrowIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="8" height="14" viewBox="0 0 8 14" style={style} fill="none">
    <path
      d="M1 1L7 7L1 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FactsSlider;
