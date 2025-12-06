import { motion } from 'framer-motion';
import { useMemo } from 'react';
import ShareButton from '../ShareButton';

const YEAR = 2025;

function CalendarSlide({ data, username, avatar }) {
  const calendarData = data.calendar?.submissionCalendar || '{}';

  // Parse submission calendar and create visualization data
  const { allMonths, stats, mostActiveMonthData, mostActiveMonthIdx } = useMemo(() => {
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

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isLeapYear = (YEAR % 4 === 0 && YEAR % 100 !== 0) || (YEAR % 400 === 0);
    if (isLeapYear) daysInMonth[1] = 29;

    const daySubmissionMap = {};

    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getUTCFullYear() === YEAR) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const dayKey = `${year}-${month}-${day}`;

        daySubmissionMap[dayKey] = (daySubmissionMap[dayKey] || 0) + count;
        totalSubmissions += count;
        maxSubmissions = Math.max(maxSubmissions, count);

        if (!daysWithSubmissions.has(dayKey) && count > 0) {
          daysWithSubmissions.add(dayKey);
          activeDaysCount++;
        }

        const monthIdx = date.getUTCMonth();
        monthSubmissions[monthNames[monthIdx]] += count;
      }
    });

    let mostActiveMonth = '';
    let activeMonthIdx = 0;
    let maxMonthSubs = 0;
    Object.entries(monthSubmissions).forEach(([month, count]) => {
      if (count > maxMonthSubs) {
        maxMonthSubs = count;
        mostActiveMonth = month;
        activeMonthIdx = monthNames.indexOf(month);
      }
    });

    const months = monthNames.map((name, idx) => {
      const numDays = daysInMonth[idx];
      const days = [];
      const firstDay = new Date(Date.UTC(YEAR, idx, 1));
      const startDayOfWeek = firstDay.getUTCDay();

      for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ empty: true });
      }

      for (let d = 1; d <= numDays; d++) {
        const month = String(idx + 1).padStart(2, '0');
        const day = String(d).padStart(2, '0');
        const dayKey = `${YEAR}-${month}-${day}`;
        const subs = daySubmissionMap[dayKey] || 0;

        let level = 0;
        if (subs > 0) level = 1;
        if (subs >= 3) level = 2;
        if (subs >= 5) level = 3;
        if (subs >= 10) level = 4;

        days.push({ day: d, submissions: subs, level, date: dayKey });
      }

      return { name, days, total: monthSubmissions[name], idx };
    });

    return {
      allMonths: months,
      mostActiveMonthData: months[activeMonthIdx],
      mostActiveMonthIdx: activeMonthIdx,
      stats: { totalSubmissions, maxSubmissions, mostActiveMonth: mostActiveMonth || 'N/A', activeDays: activeDaysCount, monthTotal: maxMonthSubs }
    };
  }, [calendarData]);

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
      <div className="slide-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          Most productive month in {YEAR}
        </motion.div>

        {stats.activeDays > 0 && mostActiveMonthData ? (
          <>
            <motion.div
              style={{
                background: 'transparent',
                borderRadius: '16px',
                padding: 'clamp(0.5rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.5rem)',
                marginBottom: '0.75rem',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 'clamp(208px, 56vw, 304px)',
                margin: '0 auto 0.75rem auto',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <div style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #40C4A9 0%, #a8edea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {fullMonthNames[mostActiveMonthData.name]}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                  {stats.monthTotal} submissions
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 'clamp(2px, 0.4vw, 3px)',
                width: '100%',
                maxWidth: 'clamp(200px, 60vw, 300px)',
              }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} style={{
                    fontSize: '0.6rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    marginBottom: '3px',
                    fontWeight: 500,
                  }}>
                    {day}
                  </div>
                ))}
                {mostActiveMonthData.days.map((cell, dayIdx) => (
                  <motion.div
                    key={dayIdx}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '2px',
                      background: cell.empty ? 'transparent' :
                        cell.level === 0 ? 'rgba(255, 255, 255, 0.08)' :
                          cell.level === 1 ? 'rgba(64, 196, 169, 0.3)' :
                            cell.level === 2 ? 'rgba(64, 196, 169, 0.5)' :
                              cell.level === 3 ? 'rgba(64, 196, 169, 0.7)' : 'rgba(64, 196, 169, 1)',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + dayIdx * 0.01 }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 'clamp(0.2rem, 0.8vw, 0.35rem)',
                width: '100%',
                maxWidth: '384px',
                justifyItems: 'center',
                margin: '0 auto',
                padding: '0 0.25rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {allMonths.map((month, monthIdx) => (
                <motion.div
                  key={month.name}
                  style={{
                    background: monthIdx === mostActiveMonthIdx ? 'rgba(64, 196, 169, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '5px',
                    padding: '0.2rem',
                    border: monthIdx === mostActiveMonthIdx ? '1px solid rgba(64, 196, 169, 0.4)' : 'none',
                    width: '100%',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + monthIdx * 0.03 }}
                >
                  <div style={{
                    fontSize: '0.45rem',
                    fontWeight: 600,
                    color: monthIdx === mostActiveMonthIdx ? 'var(--lc-green)' : month.total > 0 ? 'var(--lc-green)' : 'rgba(255, 255, 255, 0.3)',
                    marginBottom: '0.1rem',
                    textAlign: 'center',
                  }}>
                    {monthIdx === mostActiveMonthIdx ? '' : month.name}
                  </div>
                  {monthIdx === mostActiveMonthIdx ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '7/5',
                      color: 'rgba(64, 196, 169, 0.6)',
                      fontSize: '0.4rem',
                      fontWeight: 500,
                    }}>

                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
                      {month.days.map((cell, dayIdx) => (
                        <div
                          key={dayIdx}
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: '1px',
                            background: cell.empty ? 'transparent' :
                              cell.level === 0 ? 'rgba(255, 255, 255, 0.06)' :
                                cell.level === 1 ? 'rgba(64, 196, 169, 0.3)' :
                                  cell.level === 2 ? 'rgba(64, 196, 169, 0.5)' :
                                    cell.level === 3 ? 'rgba(64, 196, 169, 0.7)' : 'rgba(64, 196, 169, 1)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
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
      </div>
      <ShareButton username={username} avatar={avatar} />
    </motion.div>
  );
}

export default CalendarSlide;
