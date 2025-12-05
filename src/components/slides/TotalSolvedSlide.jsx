import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const YEAR = 2025;

function TotalSolvedSlide({ data }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  
  // Use 2025 data if available (authenticated), otherwise all-time
  const hasYearlyData = data.yearlyStats?.uniqueProblemsSolved > 0;
  const totalSolved = hasYearlyData 
    ? data.yearlyStats.uniqueProblemsSolved 
    : (data.solved?.solvedProblem || 0);
  
  const totalQuestions = data.solved?.totalQuestions || 3500;
  
  // Calculate percentage, cap at 100% for display
  const rawPercentile = (totalSolved / totalQuestions) * 100;
  const percentile = Math.min(rawPercentile, 100).toFixed(1);
  const solvedAll = totalSolved >= totalQuestions;

  // Animate the number counting up
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = totalSolved / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalSolved) {
        setDisplayNumber(totalSolved);
        clearInterval(timer);
      } else {
        setDisplayNumber(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalSolved]);

  return (
    <motion.div 
      className="slide stats-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ 
            fontSize: '1.5rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          {hasYearlyData ? `In ${YEAR}, you solved` : 'You solved'}
        </motion.div>

        <motion.div 
          className="stat-number"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
        >
          {displayNumber.toLocaleString()}
        </motion.div>

        <motion.div 
          className="stat-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: 'center' }}
        >
          {hasYearlyData ? 'unique problems' : 'problems on LeetCode'}
          <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.5rem', opacity: 0.6 }}>
            ({hasYearlyData ? `${YEAR} only` : 'all-time'})
          </span>
        </motion.div>

        {hasYearlyData ? (
          <motion.div 
            className="stat-sublabel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ textAlign: 'center' }}
          >
            with {data.yearlyStats.totalSubmissions.toLocaleString()} total submissions
          </motion.div>
        ) : (
          <motion.div 
            className="stat-sublabel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ textAlign: 'center' }}
          >
            {solvedAll ? (
              <>You've solved ALL available problems!</>
            ) : (
              <>That's {percentile}% of all available problems</>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: '3rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Global Ranking
            </div>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700,
              color: 'var(--lc-orange)',
              marginTop: '0.5rem',
            }}>
              #{data.profile?.ranking?.toLocaleString() || 'N/A'}
            </div>
          </div>

          {hasYearlyData && (
            <div style={{
              padding: '1.5rem 2rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                All-Time Total
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 700,
                color: '#10b981',
                marginTop: '0.5rem',
              }}>
                {data.solved?.solvedProblem?.toLocaleString() || 0}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TotalSolvedSlide;
