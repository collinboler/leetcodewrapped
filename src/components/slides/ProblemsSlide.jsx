import { motion } from 'framer-motion';
import { useMemo } from 'react';

const YEAR = 2025;

function ProblemsSlide({ data }) {
  // Use yearlyStats if available (authenticated), otherwise fall back to basic processing
  const { mostRetried, mostSubmissions, uniqueProblems, totalAttempts, hasFullData } = useMemo(() => {
    // Check if we have full yearly stats from authenticated fetch
    if (data.yearlyStats) {
      return {
        mostRetried: data.yearlyStats.mostRetried,
        mostSubmissions: data.yearlyStats.topProblemsByAttempts,
        uniqueProblems: data.yearlyStats.uniqueProblemsSolved,
        totalAttempts: data.yearlyStats.totalSubmissions,
        hasFullData: true,
      };
    }

    // Fallback: process from submissions (limited data)
    const submissions = data.submissions?.submission || [];
    
    if (!submissions.length) {
      return {
        mostRetried: null,
        mostSubmissions: null,
        uniqueProblems: 0,
        totalAttempts: 0,
        hasFullData: false,
      };
    }

    // Filter to current year
    const submissions2025 = submissions.filter(sub => {
      const date = new Date(parseInt(sub.timestamp) * 1000);
      return date.getUTCFullYear() === YEAR;
    });

    // Group submissions by problem
    const problemStats = {};
    let uniqueSet = new Set();

    submissions2025.forEach(sub => {
      uniqueSet.add(sub.titleSlug);

      if (!problemStats[sub.titleSlug]) {
        problemStats[sub.titleSlug] = {
          title: sub.title,
          titleSlug: sub.titleSlug,
          totalSubmissions: 0,
          attemptsBeforeAccept: 0,
          accepted: false,
        };
      }

      const problem = problemStats[sub.titleSlug];
      problem.totalSubmissions++;
      
      if (sub.statusDisplay === 'Accepted') {
        if (!problem.accepted) {
          problem.attemptsBeforeAccept = problem.totalSubmissions - 1;
        }
        problem.accepted = true;
      }
    });

    const problemList = Object.values(problemStats);

    // Most retried
    const retriedProblems = problemList
      .filter(p => p.accepted && p.attemptsBeforeAccept > 0)
      .sort((a, b) => b.attemptsBeforeAccept - a.attemptsBeforeAccept);

    // Most submissions
    const mostSubmissionsProblems = [...problemList]
      .sort((a, b) => b.totalSubmissions - a.totalSubmissions);

    return {
      mostRetried: retriedProblems[0] ? {
        title: retriedProblems[0].title,
        titleSlug: retriedProblems[0].titleSlug,
        retriesBeforeAccept: retriedProblems[0].attemptsBeforeAccept,
      } : null,
      mostSubmissions: mostSubmissionsProblems.slice(0, 5),
      uniqueProblems: uniqueSet.size,
      totalAttempts: submissions2025.length,
      hasFullData: false,
    };
  }, [data.yearlyStats, data.submissions]);

  // Format problem name for display (truncate if too long)
  const formatProblemName = (name) => {
    if (!name) return '';
    if (name.length > 30) return name.substring(0, 27) + '...';
    return name;
  };

  return (
    <motion.div 
      className="slide"
      style={{
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
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
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your {YEAR} problem insights
          {!hasFullData && (
            <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.25rem', opacity: 0.6 }}>
              (limited data - add session cookie for full stats)
            </span>
          )}
        </motion.div>

        {(mostSubmissions && mostSubmissions.length > 0) || uniqueProblems > 0 ? (
          <>
            {/* Stats Row */}
            <motion.div
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
                  {uniqueProblems}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Problems Solved
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.3)' }}>
                  in {YEAR}
                </div>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
                  {totalAttempts}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Total Submissions
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.3)' }}>
                  in {YEAR}
                </div>
              </div>
            </motion.div>

            {/* Most Retried Problem */}
            {mostRetried && mostRetried.retriesBeforeAccept > 0 && (
              <motion.div
                style={{
                  background: 'rgba(147, 51, 234, 0.15)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1rem',
                  width: '100%',
                  maxWidth: '400px',
                  textAlign: 'center',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.5rem' }}>
                  Your most retried problem
                </div>
                <div style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                  fontWeight: 600,
                  color: '#a78bfa',
                  marginBottom: '0.5rem',
                }}>
                  {formatProblemName(mostRetried.title)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <span style={{ color: '#ec4899', fontWeight: 700 }}>{mostRetried.retriesBeforeAccept}</span> attempts before you cracked it
                </div>
              </motion.div>
            )}

            {/* Most Submissions List */}
            {mostSubmissions && mostSubmissions.length > 0 && (
              <motion.div
                style={{
                  width: '100%',
                  maxWidth: '400px',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                }}>
                  Problems with most submissions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {mostSubmissions.slice(0, 5).map((problem, index) => (
                    <motion.div
                      key={problem.titleSlug}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${index === 0 ? '#ec4899' : 'rgba(255,255,255,0.2)'}`,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.08 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: index === 0 ? '#ec4899' : 'rgba(255,255,255,0.4)',
                          width: '18px',
                        }}>
                          #{index + 1}
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '220px',
                        }}>
                          {problem.title}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: index === 0 ? '#ec4899' : '#a78bfa',
                      }}>
                        {problem.totalSubmissions}
                      </span>
                    </motion.div>
                  ))}
                </div>
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
              textAlign: 'center',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No {YEAR} submission data</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Keep solving to see your problem insights!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ProblemsSlide;
