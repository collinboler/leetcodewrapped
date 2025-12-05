import { motion } from 'framer-motion';
import ShareButton from '../ShareButton';

function DifficultySlide({ data, username, avatar }) {
  const easy = data.solved?.easySolved || 0;
  const medium = data.solved?.mediumSolved || 0;
  const hard = data.solved?.hardSolved || 0;
  const total = easy + medium + hard || 1;

  const difficulties = [
    { 
      label: 'Easy', 
      count: easy, 
      percent: (easy / total) * 100,
      className: 'easy',
      color: '#00B8A3',
    },
    { 
      label: 'Medium', 
      count: medium, 
      percent: (medium / total) * 100,
      className: 'medium',
      color: '#FFC01E',
    },
    { 
      label: 'Hard', 
      count: hard, 
      percent: (hard / total) * 100,
      className: 'hard',
      color: '#FF375F',
    },
  ];

  // Find dominant difficulty
  const maxDifficulty = difficulties.reduce((a, b) => a.count > b.count ? a : b);

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
            marginBottom: '2rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You're a <span style={{ color: maxDifficulty.color, fontWeight: 700 }}>
            {maxDifficulty.label}
          </span> problem crusher!
        </motion.p>

        <div className="difficulty-bars" style={{ width: '100%', maxWidth: '400px', padding: '0 1rem' }}>
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
                  animate={{ width: `${Math.max(diff.percent, 10)}%` }}
                  transition={{ duration: 1, delay: 0.6 + index * 0.2, ease: "easeOut" }}
                >
                  {diff.count}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ShareButton username={username} avatar={avatar} />
    </motion.div>
  );
}

export default DifficultySlide;
