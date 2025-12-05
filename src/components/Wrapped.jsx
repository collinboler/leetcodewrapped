import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSlide from './slides/IntroSlide';
import TotalSolvedSlide from './slides/TotalSolvedSlide';
import DifficultySlide from './slides/DifficultySlide';
import TopicsSlide from './slides/TopicsSlide';
import LanguageSlide from './slides/LanguageSlide';
import StreakSlide from './slides/StreakSlide';
import CalendarSlide from './slides/CalendarSlide';
import WeekdaySlide from './slides/WeekdaySlide';
import BestDaySlide from './slides/BestDaySlide';
import BadgesSlide from './slides/BadgesSlide';
import FinalSlide from './slides/FinalSlide';

function Wrapped({ data, username, onRestart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const avatar = data.profile?.avatar;
  
  const slides = [
    { component: IntroSlide, props: { username, data } },
    // Activity slides first
    { component: WeekdaySlide, props: { data, username, avatar } },      // Favorite weekday
    { component: StreakSlide, props: { data, username, avatar } },       // Active days in 2025
    { component: CalendarSlide, props: { data, username, avatar } },     // Best month
    { component: BestDaySlide, props: { data, username, avatar } },      // Most productive day
    // Then the rest
    { component: TotalSolvedSlide, props: { data, username, avatar } },
    { component: DifficultySlide, props: { data, username, avatar } },
    { component: TopicsSlide, props: { data, username, avatar } },
    { component: LanguageSlide, props: { data, username, avatar } },
    { component: BadgesSlide, props: { data, username, avatar } },
    { component: FinalSlide, props: { data, username, avatar } },
  ];

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch/swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <motion.div 
      className="wrapped-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header - show on all slides */}
      <motion.div 
        className="wrapped-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '1.25rem 1.5rem',
          gap: '1rem',
        }}
      >
        <img 
          src="/leetcodewrapped.png" 
          alt="leetcode wrapped" 
          style={{ width: '48px', height: '48px' }}
        />
        <span style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '1.4rem', fontWeight: 700 }}>
          <span style={{ color: '#fea216' }}>leet</span>
          <span style={{ color: '#b3b3b3' }}>code</span>
          {' '}
          <span style={{ color: '#f32426', fontStyle: 'italic' }}>wrapped</span>
        </span>
        <span style={{ 
          fontSize: '1.4rem', 
          fontWeight: 600, 
          color: 'rgba(255, 255, 255, 0.7)' 
        }}>
          2025
        </span>
      </motion.div>

      <AnimatePresence mode="wait">
        <CurrentSlideComponent 
          key={currentSlide}
          {...slides[currentSlide].props}
        />
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="nav-buttons">
        <button 
          className="nav-btn" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          ←
        </button>
        <button 
          className="nav-btn" 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          →
        </button>
      </div>

      {/* Slide indicators */}
      <div className="slide-indicator">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Wrapped;
