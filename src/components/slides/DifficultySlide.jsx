import { motion } from 'framer-motion';

function DifficultySlide({ data }) {
  const easy = data.solved?.easySolved || 0;
  const medium = data.solved?.mediumSolved || 0;
  const hard = data.solved?.hardSolved || 0;
  const total = easy + medium + hard || 1;

  const difficulties = [
    { label: 'Easy', count: easy, percentage: (easy / total) * 100, className: 'easy' },
    { label: 'Medium', count: medium, percentage: (medium / total) * 100, className: 'medium' },
    { label: 'Hard', count: hard, percentage: (hard / total) * 100, className: 'hard' },
  ];

  // Find the dominant difficulty
  const maxDifficulty = difficulties.reduce((a, b) => a.count > b.count ? a : b);

  return (
    <motion.div 
      className="slide difficulty-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        <motion.h2
          style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your difficulty breakdown
          <span style={{ fontSize: '0.9rem', display: 'block', marginTop: '0.5rem', opacity: 0.6, fontWeight: 400 }}>(all-time)</span>
        </motion.h2>

        <motion.p
          style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '1rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You're a <span style={{ color: `var(--lc-${maxDifficulty.className})`, fontWeight: 700 }}>
            {maxDifficulty.label}
          </span> problem crusher!
        </motion.p>

        <div className="difficulty-bars">
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
                  animate={{ width: `${Math.max(diff.percentage, 10)}%` }}
                  transition={{ duration: 1, delay: 0.6 + index * 0.2, ease: "easeOut" }}
                >
                  {diff.count}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{
            marginTop: '3rem',
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {hard > 50 && (
            <div style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 55, 95, 0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 55, 95, 0.3)',
              color: 'var(--lc-hard)',
              fontWeight: 600,
            }}>
              Hard Problem Master
            </div>
          )}
          {medium > 100 && (
            <div style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 192, 30, 0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 192, 30, 0.3)',
              color: 'var(--lc-medium)',
              fontWeight: 600,
            }}>
              Medium Grinder
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DifficultySlide;

