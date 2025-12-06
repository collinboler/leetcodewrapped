import { motion } from 'framer-motion';
import ShareButton from '../ShareButton';

function DifficultySlide({ data, username, avatar }) {
  const easy = data.solved?.easySolved || 0;
  const medium = data.solved?.mediumSolved || 0;
  const hard = data.solved?.hardSolved || 0;
  const total = easy + medium + hard || 1;

  const maxCount = Math.max(easy, medium, hard, 1);

  const difficulties = [
    {
      label: 'Easy',
      count: easy,
      percent: (easy / maxCount) * 100,
      className: 'easy',
      color: '#00B8A3',
    },
    {
      label: 'Medium',
      count: medium,
      percent: (medium / maxCount) * 100,
      className: 'medium',
      color: '#FFC01E',
    },
    {
      label: 'Hard',
      count: hard,
      percent: (hard / maxCount) * 100,
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
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
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
          You're {maxDifficulty.label === 'Easy' ? 'an' : 'a'} <span style={{ color: maxDifficulty.color, fontWeight: 700 }}>
            {maxDifficulty.label}
          </span> problem crusher!
        </motion.p>

        <div className="difficulty-bars" style={{ width: '90%', maxWidth: '500px', padding: '0 1rem', margin: '0 auto' }}>
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
