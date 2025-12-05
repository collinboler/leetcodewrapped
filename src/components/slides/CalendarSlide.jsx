import { motion } from 'framer-motion';
import { useMemo } from 'react';

const YEAR = 2025;

function CalendarSlide({ data }) {
  const calendarData = data.calendar?.submissionCalendar || '{}';

  // Parse submission calendar and create visualization data
  const { monthsData, stats } = useMemo(() => {
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      submissionMap = {};
    }

    // Calculate stats for the year
    let totalSubmissions = 0;
    let maxSubmissions = 0;
    let activeDaysCount = 0;
    const daysWithSubmissions = new Set();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthSubmissions = {};
    monthNames.forEach(m => monthSubmissions[m] = 0);

    // Days in each month for 2025 (not a leap year)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Check if it's a leap year
    const isLeapYear = (YEAR % 4 === 0 && YEAR % 100 !== 0) || (YEAR % 400 === 0);
    if (isLeapYear) daysInMonth[1] = 29;

    // Create a map for quick day lookup
    const daySubmissionMap = {};
    
    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getFullYear() === YEAR) {
        const dayKey = date.toISOString().split('T')[0];
        daySubmissionMap[dayKey] = (daySubmissionMap[dayKey] || 0) + count;
        
        totalSubmissions += count;
        maxSubmissions = Math.max(maxSubmissions, count);
        
        if (!daysWithSubmissions.has(dayKey) && count > 0) {
          daysWithSubmissions.add(dayKey);
          activeDaysCount++;
        }
        
        const monthIdx = date.getMonth();
        monthSubmissions[monthNames[monthIdx]] += count;
      }
    });

    // Find most active month
    let mostActiveMonth = '';
    let maxMonthSubs = 0;
    Object.entries(monthSubmissions).forEach(([month, count]) => {
      if (count > maxMonthSubs) {
        maxMonthSubs = count;
        mostActiveMonth = month;
      }
    });

    // Create month-by-month data with correct number of days
    const months = monthNames.map((name, idx) => {
      const numDays = daysInMonth[idx];
      const days = [];
      
      // Get first day of month to know where to start
      const firstDay = new Date(YEAR, idx, 1);
      const startDayOfWeek = firstDay.getDay();
      
      // Add empty cells for days before the month starts
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ empty: true });
      }
      
      // Add actual days
      for (let d = 1; d <= numDays; d++) {
        const date = new Date(YEAR, idx, d);
        const dayKey = date.toISOString().split('T')[0];
        const subs = daySubmissionMap[dayKey] || 0;
        
        let level = 0;
        if (subs > 0) level = 1;
        if (subs >= 3) level = 2;
        if (subs >= 5) level = 3;
        if (subs >= 10) level = 4;
        
        days.push({
          day: d,
          submissions: subs,
          level,
          date: dayKey,
        });
      }
      
      return {
        name,
        days,
        total: monthSubmissions[name],
      };
    });

    return {
      monthsData: months,
      stats: {
        totalSubmissions,
        maxSubmissions,
        mostActiveMonth: mostActiveMonth || 'N/A',
        activeDays: activeDaysCount,
        monthTotal: maxMonthSubs,
      }
    };
  }, [calendarData]);

  // Full month names for display
  const fullMonthNames = {
    'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
    'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
    'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
  };

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
            marginBottom: '1rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your {YEAR} in Code
        </motion.div>

        {stats.activeDays > 0 ? (
          <>
            <motion.div
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {fullMonthNames[stats.mostActiveMonth]}
            </motion.div>

            <motion.div
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              was your most active month ({stats.monthTotal} submissions)
            </motion.div>
          </>
        ) : (
          <motion.div
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '1.5rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No activity recorded in {YEAR}
          </motion.div>
        )}

        {/* Monthly Calendar Grid */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '600px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {monthsData.map((month, monthIdx) => (
            <motion.div
              key={month.name}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '0.4rem',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + monthIdx * 0.03 }}
            >
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color: month.total > 0 ? 'var(--lc-green)' : 'rgba(255, 255, 255, 0.4)',
                marginBottom: '0.25rem',
                textAlign: 'center',
              }}>
                {month.name}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1px',
              }}>
                {month.days.map((cell, dayIdx) => (
                  <div
                    key={dayIdx}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '2px',
                      background: cell.empty 
                        ? 'transparent' 
                        : cell.level === 0 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : cell.level === 1 
                            ? 'rgba(64, 196, 169, 0.3)'
                            : cell.level === 2
                              ? 'rgba(64, 196, 169, 0.5)'
                              : cell.level === 3
                                ? 'rgba(64, 196, 169, 0.7)'
                                : 'rgba(64, 196, 169, 1)',
                    }}
                    title={cell.date ? `${cell.date}: ${cell.submissions} submissions` : ''}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '1.5rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              fontWeight: 700, 
              color: 'var(--lc-green)' 
            }}>
              {stats.activeDays}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>Active Days</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              fontWeight: 700, 
              color: 'var(--lc-green)' 
            }}>
              {stats.totalSubmissions}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>Total Submissions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
              fontWeight: 700, 
              color: 'var(--lc-green)' 
            }}>
              {stats.maxSubmissions}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>Max in a Day</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CalendarSlide;
