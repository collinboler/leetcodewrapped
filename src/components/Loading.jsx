import { motion } from 'framer-motion';

function Loading({ username }) {
  const loadingMessages = [
    "Crunching your code stats...",
    "Analyzing your solving patterns...",
    "Counting your victories...",
    "Calculating your streak...",
    "Loading your achievements...",
  ];

  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div className="loading-spinner" />
      </motion.div>
      
      <motion.div
        className="loading-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
        </motion.span>
      </motion.div>

      <motion.div
        style={{ 
          marginTop: '1rem', 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.5)' 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        @{username}
      </motion.div>
    </motion.div>
  );
}

export default Loading;

