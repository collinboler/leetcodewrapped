import { motion } from 'framer-motion';

function ContestSlide({ data }) {
  const contestData = data.contest?.contestParticipation || null;
  const contestHistory = data.contestHistory?.contestHistory || [];
  
  // Calculate contest stats
  const contestsAttended = contestData?.contestAttend || contestHistory.length || 0;
  const rating = contestData?.contestRating || 0;
  const globalRanking = contestData?.contestGlobalRanking || 0;
  const topPercentage = contestData?.contestTopPercentage || 0;

  // Find best and worst performances
  const validContests = contestHistory.filter(c => c.ranking > 0);
  const bestRank = validContests.length > 0 
    ? Math.min(...validContests.map(c => c.ranking)) 
    : null;

  const getRatingColor = (rating) => {
    if (rating >= 2400) return '#FF6B6B'; // Guardian
    if (rating >= 2000) return '#FFA116'; // Knight
    if (rating >= 1600) return '#A855F7'; // Knight
    if (rating >= 1400) return '#3B82F6'; // Knight
    return '#00B8A3'; // Default
  };

  return (
    <motion.div 
      className="slide contest-slide"
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
          Contest Performance
        </motion.div>

        {contestsAttended > 0 ? (
          <>
            <motion.div
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(4rem, 10vw, 6rem)',
                fontWeight: 700,
                color: getRatingColor(Math.round(rating)),
                lineHeight: 1,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {Math.round(rating)}
            </motion.div>

            <motion.div
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '2.5rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Contest Rating
            </motion.div>

            <motion.div 
              className="contest-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="contest-stat">
                <div className="contest-stat-number">{contestsAttended}</div>
                <div className="contest-stat-label">Contests Joined</div>
              </div>

              {globalRanking > 0 && (
                <div className="contest-stat">
                  <div className="contest-stat-number">#{globalRanking.toLocaleString()}</div>
                  <div className="contest-stat-label">Global Ranking</div>
                </div>
              )}

              {topPercentage > 0 && (
                <div className="contest-stat">
                  <div className="contest-stat-number">Top {topPercentage.toFixed(1)}%</div>
                  <div className="contest-stat-label">Percentile</div>
                </div>
              )}

              {bestRank && (
                <div className="contest-stat">
                  <div className="contest-stat-number">#{bestRank.toLocaleString()}</div>
                  <div className="contest-stat-label">Best Finish</div>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <motion.div
            style={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '1rem',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>
              No contest data yet
            </div>
            <div>
              Join a weekly contest to see your stats here!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ContestSlide;
