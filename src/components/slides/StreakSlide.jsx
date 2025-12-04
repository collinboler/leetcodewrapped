import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

function StreakSlide({ data }) {
  const [displayDays, setDisplayDays] = useState(0);
  
  // Calculate 2024-specific active days and longest streak
  const { activeDays2024, longestStreak2024 } = useMemo(() => {
    const calendarData = data.calendar?.submissionCalendar || '{}';
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      return { activeDays2024: 0, longestStreak2024: 0 };
    }
    
    // Get all 2024 dates with submissions
    const dates2024 = [];
    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getFullYear() === 2025 && count > 0) {
        dates2024.push(date);
      }
    });
    
    // Sort dates
    dates2024.sort((a, b) => a - b);
    
    // Calculate longest streak in 2024
    let longest = 0;
    let current = 1;
    
    for (let i = 1; i < dates2024.length; i++) {
      const prevDate = dates2024[i - 1];
      const currDate = dates2024[i];
      const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        current++;
      } else {
        longest = Math.max(longest, current);
        current = 1;
      }
    }
    longest = Math.max(longest, current);
    
    return {
      activeDays2024: dates2024.length,
      longestStreak2024: dates2024.length > 0 ? longest : 0,
    };
  }, [data.calendar]);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = activeDays2024 / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= activeDays2024) {
        setDisplayDays(activeDays2024);
        clearInterval(timer);
      } else {
        setDisplayDays(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [activeDays2024]);

  // Determine streak message
  const getStreakMessage = () => {
    if (activeDays2024 >= 300) return "Legendary! Almost every day of 2025!";
    if (activeDays2024 >= 200) return "Incredible dedication — 200+ days!";
    if (activeDays2024 >= 100) return "Triple digits! A true grinder.";
    if (activeDays2024 >= 50) return "50+ days of coding excellence.";
    if (activeDays2024 >= 1) return "Every day counts. Keep it up!";
    return "Start your journey today!";
  };

  return (
    <motion.div 
      className="slide streak-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        <motion.div
          style={{ 
            fontSize: '1.3rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '2rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your 2025 activity
        </motion.div>

        <motion.div 
          className="streak-number"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
        >
          {displayDays}
        </motion.div>

        <motion.div 
          className="stat-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          active day{activeDays2024 !== 1 ? 's' : ''} in 2025
        </motion.div>

        <motion.div
          style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: '1rem',
            fontSize: '1.1rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {getStreakMessage()}
        </motion.div>

        <motion.div
          style={{
            marginTop: '3rem',
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div style={{
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {longestStreak2024}
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '0.25rem',
            }}>
              Longest Streak in 2025
            </div>
          </div>

          <div style={{
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {data.profile?.streak || 0}
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '0.25rem',
            }}>
              Current Streak
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default StreakSlide;
