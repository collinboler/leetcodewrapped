import { motion } from 'framer-motion';
import { useMemo } from 'react';

function CalendarSlide({ data }) {
  const calendarData = data.calendar?.submissionCalendar || '{}';

  // Parse submission calendar and create visualization data
  const { calendarCells, stats } = useMemo(() => {
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      submissionMap = {};
    }

    // Use 2025 for the wrapped year
    const year = 2025;
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    // Calculate stats for 2024 only
    let totalSubmissions = 0;
    let maxSubmissions = 0;
    let activeDays2024 = 0;
    const monthSubmissions = {
      'January': 0, 'February': 0, 'March': 0, 'April': 0,
      'May': 0, 'June': 0, 'July': 0, 'August': 0,
      'September': 0, 'October': 0, 'November': 0, 'December': 0
    };
    const daysWithSubmissions = new Set();

    // Process all submissions and filter for 2024
    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getFullYear() === year) {
        totalSubmissions += count;
        maxSubmissions = Math.max(maxSubmissions, count);
        
        const dayKey = date.toISOString().split('T')[0];
        if (!daysWithSubmissions.has(dayKey) && count > 0) {
          daysWithSubmissions.add(dayKey);
          activeDays2024++;
        }
        
        const monthName = date.toLocaleString('en-US', { month: 'long' });
        monthSubmissions[monthName] = (monthSubmissions[monthName] || 0) + count;
      }
    });

    // Find most active month (only consider months with submissions)
    let mostActiveMonth = '';
    let maxMonthSubmissions = 0;
    Object.entries(monthSubmissions).forEach(([month, count]) => {
      if (count > maxMonthSubmissions) {
        maxMonthSubmissions = count;
        mostActiveMonth = month;
      }
    });

    // Create calendar cells for the year
    const cells = [];
    let currentDate = new Date(startOfYear);
    
    // Add empty cells for days before the year starts
    const startDay = currentDate.getDay();
    for (let i = 0; i < startDay; i++) {
      cells.push({ empty: true });
    }

    while (currentDate <= endOfYear) {
      const dayStr = currentDate.toISOString().split('T')[0];
      
      // Find submissions for this day
      let daySubmissions = 0;
      Object.entries(submissionMap).forEach(([ts, count]) => {
        const tsDate = new Date(parseInt(ts) * 1000);
        if (tsDate.toISOString().split('T')[0] === dayStr) {
          daySubmissions += count;
        }
      });

      let level = 0;
      if (daySubmissions > 0) level = 1;
      if (daySubmissions >= 3) level = 2;
      if (daySubmissions >= 5) level = 3;
      if (daySubmissions >= 10) level = 4;

      cells.push({
        date: new Date(currentDate),
        submissions: daySubmissions,
        level,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      calendarCells: cells,
      stats: {
        totalSubmissions,
        maxSubmissions,
        mostActiveMonth: mostActiveMonth || 'N/A',
        activeDays: activeDays2024,
        monthSubmissions,
      }
    };
  }, [calendarData]);

  return (
    <motion.div 
      className="slide calendar-slide"
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
            marginBottom: '1.5rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your 2025 in Code
        </motion.div>

        {stats.activeDays > 0 ? (
          <>
            <motion.div
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {stats.mostActiveMonth}
            </motion.div>

            <motion.div
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '2rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              was your most active month ({stats.monthSubmissions[stats.mostActiveMonth]} submissions)
            </motion.div>
          </>
        ) : (
          <motion.div
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '2rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No activity recorded in 2025
          </motion.div>
        )}

        {/* Calendar Grid */}
        <motion.div 
          className="calendar-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {calendarCells.map((cell, index) => (
            <motion.div
              key={index}
              className={`calendar-cell ${cell.empty ? '' : `level-${cell.level}`}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.0005 }}
              title={cell.date ? `${cell.date.toDateString()}: ${cell.submissions} submissions` : ''}
            />
          ))}
        </motion.div>

        <motion.div 
          className="calendar-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="calendar-stat">
            <div className="calendar-stat-number">{stats.activeDays}</div>
            <div className="calendar-stat-label">Active Days</div>
          </div>
          <div className="calendar-stat">
            <div className="calendar-stat-number">{stats.totalSubmissions}</div>
            <div className="calendar-stat-label">Total Submissions</div>
          </div>
          <div className="calendar-stat">
            <div className="calendar-stat-number">{stats.maxSubmissions}</div>
            <div className="calendar-stat-label">Max in a Day</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CalendarSlide;
