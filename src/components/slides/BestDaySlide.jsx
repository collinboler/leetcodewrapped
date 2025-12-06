import { motion } from 'framer-motion';
import { useMemo } from 'react';
import ShareButton from '../ShareButton';

const YEAR = 2025;

function BestDaySlide({ data, username, avatar }) {
  const calendarData = data.calendar?.submissionCalendar || '{}';

  const { bestDay, bestDaySubmissions, formattedDate, dayOfWeek, totalDays } = useMemo(() => {
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      submissionMap = {};
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Find the day with most submissions
    let maxTimestamp = null;
    let maxSubs = 0;
    let daysWithActivity = 0;

    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      // Use UTC to match LeetCode's timezone
      const date = new Date(parseInt(timestamp) * 1000);
      const year = date.getUTCFullYear();

      if (year === YEAR) {
        if (count > 0) daysWithActivity++;
        if (count > maxSubs) {
          maxSubs = count;
          maxTimestamp = parseInt(timestamp);
        }
      }
    });

    if (!maxTimestamp) {
      return {
        bestDay: null,
        bestDaySubmissions: 0,
        formattedDate: '',
        dayOfWeek: '',
        totalDays: 0,
      };
    }

    // Use UTC methods to get correct date
    const maxDate = new Date(maxTimestamp * 1000);
    const month = monthNames[maxDate.getUTCMonth()];
    const day = maxDate.getUTCDate();
    const weekday = dayNames[maxDate.getUTCDay()];

    // Add ordinal suffix
    const getOrdinal = (n) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return {
      bestDay: maxDate,
      bestDaySubmissions: maxSubs,
      formattedDate: `${month} ${getOrdinal(day)}`,
      dayOfWeek: weekday,
      totalDays: daysWithActivity,
    };
  }, [calendarData]);



  return (
    <motion.div
      className="slide"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 70%, rgba(255, 107, 107, 0.12) 0%, transparent 50%),
          #0A0A0A
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <motion.div
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your most productive day
        </motion.div>

        {bestDay ? (
          <>
            <motion.div
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
                marginTop: '1rem',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {formattedDate}
            </motion.div>

            <motion.div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '1.5rem',
                fontSize: '1rem',
                textAlign: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {dayOfWeek}
            </motion.div>

            <motion.div
              style={{
                padding: '1.5rem 2rem',
                marginBottom: '1rem',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: 'clamp(3rem, 8vw, 4.5rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                {bestDaySubmissions}
              </motion.div>
              <div style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '0.5rem',
              }}>
                submissions in one day
              </div>
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
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Start coding to find your best day!</div>
          </motion.div>
        )}
      </div>
      <ShareButton username={username} avatar={avatar} />
    </motion.div>
  );
}

export default BestDaySlide;
