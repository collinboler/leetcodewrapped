import { motion } from 'framer-motion';
import { useMemo } from 'react';

const YEAR = 2025;

function WeekdaySlide({ data }) {
  const calendarData = data.calendar?.submissionCalendar || '{}';

  const { mostActiveDay, dayStats, totalSubs } = useMemo(() => {
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      submissionMap = {};
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daySubmissions = [0, 0, 0, 0, 0, 0, 0];
    let total = 0;

    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      // Use UTC to match LeetCode's timezone
      if (date.getUTCFullYear() === YEAR) {
        const dayOfWeek = date.getUTCDay();
        daySubmissions[dayOfWeek] += count;
        total += count;
      }
    });

    // Find most active day
    let maxIdx = 0;
    let maxSubs = 0;
    daySubmissions.forEach((count, idx) => {
      if (count > maxSubs) {
        maxSubs = count;
        maxIdx = idx;
      }
    });

    // Create stats for all days
    const stats = dayNames.map((name, idx) => ({
      name,
      shortName: name.slice(0, 3),
      submissions: daySubmissions[idx],
      isMax: idx === maxIdx,
    }));

    return {
      mostActiveDay: dayNames[maxIdx],
      dayStats: stats,
      totalSubs: total,
    };
  }, [calendarData]);

  // Day colors (weekend vs weekday)
  const getDayColor = (dayName, isMax) => {
    if (isMax) return '#40C4A9';
    if (dayName === 'Saturday' || dayName === 'Sunday') return '#FF6B6B';
    return '#4facfe';
  };

  const maxSubs = Math.max(...dayStats.map(d => d.submissions));

  return (
    <motion.div 
      className="slide"
      style={{
        background: `
          radial-gradient(ellipse at 20% 80%, rgba(64, 196, 169, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(79, 172, 254, 0.12) 0%, transparent 50%),
          #0A0A0A
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        <motion.div
          style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your favorite day to code in {YEAR}
        </motion.div>

        {totalSubs > 0 ? (
          <>
            <motion.div
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #40C4A9 0%, #a8edea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              {mostActiveDay}
            </motion.div>

            <motion.div
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '2rem',
                fontSize: '1rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {dayStats.find(d => d.isMax)?.submissions} submissions on {mostActiveDay}s
            </motion.div>

            {/* Weekly bar chart */}
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 'clamp(0.4rem, 2vw, 1rem)',
                height: '150px',
                width: '100%',
                maxWidth: '450px',
                padding: '0 1rem',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {dayStats.map((day, index) => (
                <motion.div
                  key={day.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  <motion.div
                    style={{
                      width: '100%',
                      maxWidth: '40px',
                      background: day.isMax 
                        ? 'linear-gradient(180deg, #40C4A9, #2d8f7a)' 
                        : `linear-gradient(180deg, ${getDayColor(day.name, false)}88, ${getDayColor(day.name, false)}44)`,
                      borderRadius: '4px 4px 0 0',
                      boxShadow: day.isMax ? '0 0 20px rgba(64, 196, 169, 0.4)' : 'none',
                    }}
                    initial={{ height: 0 }}
                    animate={{ 
                      height: maxSubs > 0 ? `${Math.max((day.submissions / maxSubs) * 120, 4)}px` : 4 
                    }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.05 }}
                  />
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: day.isMax ? 700 : 500,
                    color: day.isMax ? '#40C4A9' : 'rgba(255, 255, 255, 0.5)',
                  }}>
                    {day.shortName}
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    color: day.isMax ? '#40C4A9' : 'rgba(255, 255, 255, 0.4)',
                    marginTop: '0.2rem',
                  }}>
                    {day.submissions}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            style={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No data for {YEAR}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Start coding to see your weekly patterns!</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default WeekdaySlide;

