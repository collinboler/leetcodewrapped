import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSlide from './slides/IntroSlide';
import TotalSolvedSlide from './slides/TotalSolvedSlide';
import DifficultySlide from './slides/DifficultySlide';
import TopicsSlide from './slides/TopicsSlide';
import LanguageSlide from './slides/LanguageSlide';
import StreakSlide from './slides/StreakSlide';
import ContestSlide from './slides/ContestSlide';
import CalendarSlide from './slides/CalendarSlide';
import BadgesSlide from './slides/BadgesSlide';
import FinalSlide from './slides/FinalSlide';

function Wrapped({ data, username, onRestart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { component: IntroSlide, props: { username, data } },
    { component: TotalSolvedSlide, props: { data } },
    { component: DifficultySlide, props: { data } },
    { component: TopicsSlide, props: { data } },
    { component: LanguageSlide, props: { data } },
    { component: StreakSlide, props: { data } },
    { component: CalendarSlide, props: { data } },
    { component: ContestSlide, props: { data } },
    { component: BadgesSlide, props: { data } },
    { component: FinalSlide, props: { data, username, onRestart } },
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

