import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

const YEAR = 2025;

function StreakSlide({ data }) {
  const [displayDays, setDisplayDays] = useState(0);
  
  // Calculate 2025-specific active days, longest streak, and current streak
  const { activeDays2025, longestStreak2025, currentStreak } = useMemo(() => {
    const calendarData = data.calendar?.submissionCalendar || '{}';
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      return { activeDays2025: 0, longestStreak2025: 0, currentStreak: 0 };
    }
    
    // Get all dates with submissions (using UTC to match LeetCode)
    const datesWithSubmissions = new Set();
    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getUTCFullYear() === YEAR && count > 0) {
        // Create UTC date string
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        datesWithSubmissions.add(`${year}-${month}-${day}`);
      }
    });
    
    // Convert to sorted array
    const sortedDates = Array.from(datesWithSubmissions).sort();
    
    if (sortedDates.length === 0) {
      return { activeDays2025: 0, longestStreak2025: 0, currentStreak: 0 };
    }
    
    // Calculate longest streak
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
    longest = Math.max(longest, current);
    
    // Calculate current streak
    // LeetCode resets at 8pm EST (which is 00:00 UTC next day, or 01:00 UTC during DST)
    // For simplicity, we use UTC midnight as the reset time
    const now = new Date();
    const todayUTC = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
    
    // Yesterday UTC
    const yesterday = new Date(now);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayUTC = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterday.getUTCDate()).padStart(2, '0')}`;
    
    // Check if today or yesterday has submissions (streak is still active)
    const hasToday = datesWithSubmissions.has(todayUTC);
    const hasYesterday = datesWithSubmissions.has(yesterdayUTC);
    
    let currentStreakCount = 0;
    
    if (hasToday || hasYesterday) {
      // Start from the most recent date with submission
      const startDate = hasToday ? todayUTC : yesterdayUTC;
      currentStreakCount = 1;
      
      // Count backwards
      let checkDate = new Date(startDate + 'T00:00:00Z');
      checkDate.setUTCDate(checkDate.getUTCDate() - 1);
      
      while (true) {
        const checkDateStr = `${checkDate.getUTCFullYear()}-${String(checkDate.getUTCMonth() + 1).padStart(2, '0')}-${String(checkDate.getUTCDate()).padStart(2, '0')}`;
        
        if (datesWithSubmissions.has(checkDateStr)) {
          currentStreakCount++;
          checkDate.setUTCDate(checkDate.getUTCDate() - 1);
        } else {
          break;
        }
      }
    }
    
    return {
      activeDays2025: sortedDates.length,
      longestStreak2025: longest,
      currentStreak: currentStreakCount,
    };
  }, [data.calendar]);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = activeDays2025 / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= activeDays2025) {
        setDisplayDays(activeDays2025);
        clearInterval(timer);
      } else {
        setDisplayDays(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [activeDays2025]);

  // Determine streak message
  const getStreakMessage = () => {
    if (activeDays2025 >= 300) return `Legendary! Almost every day of ${YEAR}!`;
    if (activeDays2025 >= 200) return "Incredible dedication — 200+ days!";
    if (activeDays2025 >= 100) return "Triple digits! A true grinder.";
    if (activeDays2025 >= 50) return "50+ days of coding excellence.";
    if (activeDays2025 >= 1) return "Every day counts. Keep it up!";
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
      <div className="slide-content" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <motion.div
          style={{ 
            fontSize: '1.3rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your {YEAR} activity
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
          active day{activeDays2025 !== 1 ? 's' : ''} in {YEAR}
        </motion.div>

        <motion.div
          style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: '1rem',
            fontSize: '1.1rem',
            textAlign: 'center',
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
              {longestStreak2025}
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '0.25rem',
            }}>
              Longest Streak in {YEAR}
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
              background: currentStreak > 0 
                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                : 'linear-gradient(135deg, #666 0%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {currentStreak}
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
