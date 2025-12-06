import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ShareButton from '../ShareButton';

function TotalSolvedSlide({ data, username, avatar }) {
  const [displayNumber, setDisplayNumber] = useState(0);

  const totalSolved = data.solved?.solvedProblem || 0;
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
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          You've conquered
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
          problems on LeetCode
        </motion.div>

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
              color: 'white',
              marginTop: '0.5rem',
            }}>
              #{data.profile?.ranking?.toLocaleString() || 'N/A'}
            </div>
          </div>
        </motion.div>
      </div>
      <ShareButton username={username} avatar={avatar} />
    </motion.div>
  );
}

export default TotalSolvedSlide;
