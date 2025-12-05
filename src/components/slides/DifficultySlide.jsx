import { motion } from 'framer-motion';

const YEAR = 2025;

function DifficultySlide({ data }) {
  // All-time data
  const allTimeEasy = data.solved?.easySolved || 0;
  const allTimeMedium = data.solved?.mediumSolved || 0;
  const allTimeHard = data.solved?.hardSolved || 0;
  const allTimeTotal = allTimeEasy + allTimeMedium + allTimeHard || 1;

  // 2025 data (if available)
  const hasYearlyData = data.yearlyStats?.difficulty2025;
  const yearEasy = data.yearlyStats?.difficulty2025?.easy || 0;
  const yearMedium = data.yearlyStats?.difficulty2025?.medium || 0;
  const yearHard = data.yearlyStats?.difficulty2025?.hard || 0;
  const yearTotal = yearEasy + yearMedium + yearHard || 1;

  const difficulties = [
    { 
      label: 'Easy', 
      allTime: allTimeEasy, 
      year: yearEasy,
      allTimePercent: (allTimeEasy / allTimeTotal) * 100,
      yearPercent: (yearEasy / yearTotal) * 100,
      className: 'easy',
      color: '#00B8A3',
    },
    { 
      label: 'Medium', 
      allTime: allTimeMedium, 
      year: yearMedium,
      allTimePercent: (allTimeMedium / allTimeTotal) * 100,
      yearPercent: (yearMedium / yearTotal) * 100,
      className: 'medium',
      color: '#FFC01E',
    },
    { 
      label: 'Hard', 
      allTime: allTimeHard, 
      year: yearHard,
      allTimePercent: (allTimeHard / allTimeTotal) * 100,
      yearPercent: (yearHard / yearTotal) * 100,
      className: 'hard',
      color: '#FF375F',
    },
  ];

  // Find dominant difficulty for 2025 (or all-time if no yearly data)
  const maxDifficulty = hasYearlyData
    ? difficulties.reduce((a, b) => a.year > b.year ? a : b)
    : difficulties.reduce((a, b) => a.allTime > b.allTime ? a : b);

  const maxAllTime = Math.max(allTimeEasy, allTimeMedium, allTimeHard);
  const maxYear = Math.max(yearEasy, yearMedium, yearHard);

  return (
    <motion.div 
      className="slide difficulty-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <motion.h2
          style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 600,
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your difficulty breakdown
        </motion.h2>

        <motion.p
          style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '1.5rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You're a <span style={{ color: maxDifficulty.color, fontWeight: 700 }}>
            {maxDifficulty.label}
          </span> problem crusher!
        </motion.p>

        {hasYearlyData ? (
          // Side-by-side comparison
          <div style={{ width: '100%', maxWidth: '600px' }}>
            {/* Legend */}
            <motion.div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginBottom: '1.5rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.8)' }} />
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{YEAR}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>All-time</span>
              </div>
            </motion.div>

            {/* Bars */}
            {difficulties.map((diff, index) => (
              <motion.div 
                key={diff.label}
                style={{ marginBottom: '1.5rem' }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.15 }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '0.5rem',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ 
                    color: diff.color, 
                    fontWeight: 600,
                    fontSize: '1rem',
                    width: '80px',
                  }}>
                    {diff.label}
                  </span>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    fontSize: '0.85rem',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {YEAR}: <strong>{diff.year}</strong>
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                      All: <strong>{diff.allTime}</strong>
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '4px',
                  height: '32px',
                }}>
                  {/* 2025 bar */}
                  <div style={{ 
                    flex: 1, 
                    background: 'rgba(255,255,255,0.08)', 
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${diff.color}, ${diff.color}dd)`,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '0.5rem',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((diff.year / Math.max(maxYear, 1)) * 100, 5)}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
                    />
                  </div>
                  {/* All-time bar */}
                  <div style={{ 
                    flex: 1, 
                    background: 'rgba(255,255,255,0.08)', 
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${diff.color}66, ${diff.color}44)`,
                        borderRadius: '4px',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((diff.allTime / Math.max(maxAllTime, 1)) * 100, 5)}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + index * 0.15 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Totals */}
            <motion.div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                  {yearTotal}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  in {YEAR}
                </div>
              </div>
              <div style={{ 
                width: '1px', 
                background: 'rgba(255,255,255,0.2)',
              }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                  {allTimeTotal}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  all-time
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          // All-time only (no auth)
          <div className="difficulty-bars" style={{ width: '100%', maxWidth: '500px' }}>
            {difficulties.map((diff, index) => (
              <motion.div 
                key={diff.label}
                className="difficulty-item"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.2 }}
              >
                <span className={`difficulty-label ${diff.className}`}>
                  {diff.label}
                </span>
                <div className="difficulty-bar-container">
                  <motion.div 
                    className={`difficulty-bar ${diff.className}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(diff.allTimePercent, 10)}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.2, ease: "easeOut" }}
                  >
                    {diff.allTime}
                  </motion.div>
                </div>
              </motion.div>
            ))}
            <motion.div
              style={{ 
                textAlign: 'center', 
                marginTop: '1rem', 
                fontSize: '0.85rem', 
                color: 'rgba(255,255,255,0.5)' 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              (all-time data)
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DifficultySlide;
