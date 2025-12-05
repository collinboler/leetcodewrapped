import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import ShareButton from '../ShareButton';

const YEAR = 2025;

function StreakSlide({ data, username, avatar }) {
  const [displayStreak, setDisplayStreak] = useState(0);
  
  // Calculate longest streak in 2025
  const longestStreak2025 = useMemo(() => {
    const calendarData = data.calendar?.submissionCalendar || '{}';
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      return 0;
    }
    
    const datesWithSubmissions = new Set();
    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getUTCFullYear() === YEAR && count > 0) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        datesWithSubmissions.add(`${year}-${month}-${day}`);
      }
    });
    
    const sortedDates = Array.from(datesWithSubmissions).sort();
    
    if (sortedDates.length === 0) return 0;
    
    let longest = 1;
    let current = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1] + 'T00:00:00Z');
      const currDate = new Date(sortedDates[i] + 'T00:00:00Z');
      const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }
    return Math.max(longest, current);
  }, [data.calendar]);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = longestStreak2025 / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= longestStreak2025) {
        setDisplayStreak(longestStreak2025);
        clearInterval(timer);
      } else {
        setDisplayStreak(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [longestStreak2025]);

  return (
    <motion.div 
      className="slide streak-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <motion.div
          style={{ 
            fontSize: '1.3rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Longest streak
        </motion.div>

        <motion.div 
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
        >
          {displayStreak}
        </motion.div>

        <motion.div 
          style={{ 
            fontSize: '1.5rem', 
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '0.5rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          day{longestStreak2025 !== 1 ? 's' : ''}
        </motion.div>
      </div>
      <ShareButton username={username} avatar={avatar} />
    </motion.div>
  );
}

export default StreakSlide;
