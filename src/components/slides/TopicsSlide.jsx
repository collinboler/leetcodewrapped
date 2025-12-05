import { motion } from 'framer-motion';
import { useMemo } from 'react';

const YEAR = 2025;

function TopicsSlide({ data }) {
  // Extract all-time topic data from skill stats
  const allTimeTopics = useMemo(() => {
    let topics = [];
    const skillStats = data.skillStats;
    
    if (skillStats) {
      const allTags = {};
      
      ['fundamental', 'intermediate', 'advanced'].forEach(level => {
        if (skillStats[level] && Array.isArray(skillStats[level])) {
          skillStats[level].forEach(tag => {
            if (allTags[tag.tagName]) {
              allTags[tag.tagName] += tag.problemsSolved;
            } else {
              allTags[tag.tagName] = tag.problemsSolved;
            }
          });
        }
      });
      
      topics = Object.entries(allTags)
        .filter(([_, count]) => count > 0)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    }
    
    return topics;
  }, [data.skillStats]);

  // Get 2025 topics from yearlyStats (if available)
  const yearTopics = data.yearlyStats?.topics2025 || [];
  const hasYearlyData = yearTopics.length > 0;

  // Get top 6 for each
  const topAllTime = allTimeTopics.slice(0, 6);
  const topYear = yearTopics.slice(0, 6);

  // Topic colors
  const topicColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#DDA0DD',
    '#F7DC6F',
  ];

  // Get the top topic for display
  const topTopic = hasYearlyData && topYear.length > 0 ? topYear[0] : topAllTime[0];

  return (
    <motion.div 
      className="slide"
      style={{
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(255, 107, 107, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, rgba(78, 205, 196, 0.12) 0%, transparent 50%),
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
            fontSize: '1.3rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your top skills
        </motion.div>

        {topTopic ? (
          <>
            <motion.div
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
                textAlign: 'center',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {topTopic.name}
            </motion.div>

            <motion.div
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                textAlign: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              is your strongest skill ({topTopic.count.toLocaleString()} problems{hasYearlyData ? ` in ${YEAR}` : ''})
            </motion.div>

            {hasYearlyData ? (
              // Side-by-side view
              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                width: '100%', 
                maxWidth: '700px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                {/* 2025 Topics */}
                <motion.div
                  style={{ flex: '1', minWidth: '280px', maxWidth: '320px' }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '0.75rem',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>
                    {YEAR}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {topYear.map((topic, index) => (
                      <motion.div
                        key={`year-${topic.name}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.06 }}
                      >
                        <div style={{
                          width: '18px',
                          textAlign: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: topicColors[index],
                        }}>
                          #{index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            height: '24px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                          }}>
                            <motion.div
                              style={{
                                height: '100%',
                                background: `linear-gradient(90deg, ${topicColors[index]}, ${topicColors[index]}88)`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 0.5rem',
                                minWidth: 'fit-content',
                              }}
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${Math.max((topic.count / topYear[0].count) * 100, 35)}%` 
                              }}
                              transition={{ duration: 0.6, delay: 1 + index * 0.06 }}
                            >
                              <span style={{ 
                                fontWeight: 600, 
                                fontSize: '0.65rem',
                                whiteSpace: 'nowrap',
                                color: '#fff',
                              }}>
                                {topic.name}
                              </span>
                              <span style={{ 
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                color: '#fff',
                              }}>
                                {topic.count}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* All-time Topics */}
                <motion.div
                  style={{ flex: '1', minWidth: '280px', maxWidth: '320px' }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '0.75rem',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>
                    All-time
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {topAllTime.map((topic, index) => (
                      <motion.div
                        key={`alltime-${topic.name}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.06 }}
                      >
                        <div style={{
                          width: '18px',
                          textAlign: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: `${topicColors[index]}88`,
                        }}>
                          #{index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            height: '24px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                          }}>
                            <motion.div
                              style={{
                                height: '100%',
                                background: `linear-gradient(90deg, ${topicColors[index]}66, ${topicColors[index]}44)`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 0.5rem',
                                minWidth: 'fit-content',
                              }}
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${Math.max((topic.count / topAllTime[0].count) * 100, 35)}%` 
                              }}
                              transition={{ duration: 0.6, delay: 1.1 + index * 0.06 }}
                            >
                              <span style={{ 
                                fontWeight: 600, 
                                fontSize: '0.65rem',
                                whiteSpace: 'nowrap',
                                color: 'rgba(255,255,255,0.8)',
                              }}>
                                {topic.name}
                              </span>
                              <span style={{ 
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                color: 'rgba(255,255,255,0.8)',
                              }}>
                                {topic.count}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              // All-time only
              <motion.div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  width: '100%',
                  maxWidth: '500px',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {topAllTime.map((topic, index) => (
                  <motion.div
                    key={topic.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.08 }}
                  >
                    <div style={{
                      width: '22px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: topicColors[index],
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        height: '28px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                      }}>
                        <motion.div
                          style={{
                            height: '100%',
                            background: `linear-gradient(90deg, ${topicColors[index]}, ${topicColors[index]}88)`,
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 0.65rem',
                            minWidth: 'fit-content',
                          }}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${Math.max((topic.count / topAllTime[0].count) * 100, 30)}%` 
                          }}
                          transition={{ duration: 0.8, delay: 1 + index * 0.08 }}
                        >
                          <span style={{ 
                            fontWeight: 600, 
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            color: '#fff',
                          }}>
                            {topic.name}
                          </span>
                          <span style={{ 
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: '#fff',
                          }}>
                            {topic.count.toLocaleString()}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  style={{ 
                    textAlign: 'center', 
                    marginTop: '0.5rem', 
                    fontSize: '0.8rem', 
                    color: 'rgba(255,255,255,0.5)' 
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  (all-time)
                </motion.div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            style={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              marginTop: '2rem',
              textAlign: 'center',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>No Skills Data</div>
            <div>Skills data not available</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Start solving to build your skills!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default TopicsSlide;
