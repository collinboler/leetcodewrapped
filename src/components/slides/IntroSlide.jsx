import { motion } from 'framer-motion';

function IntroSlide({ username, data }) {
  const avatar = data.profile?.avatar;
  
  return (
    <motion.div 
      className="slide intro-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        {avatar && (
          <motion.img
            src={avatar}
            alt={username}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              marginBottom: '2rem',
              border: '4px solid rgba(255, 161, 22, 0.5)',
              boxShadow: '0 0 40px rgba(255, 161, 22, 0.3)',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1, delay: 0.2 }}
          />
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Welcome back,
        </motion.h1>

        <motion.div 
          className="username-display"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {username}
        </motion.div>

        <motion.p 
          className="tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Let's see what you accomplished in 2025
        </motion.p>

        <motion.div
          style={{
            marginTop: '3rem',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Press → or swipe to continue
        </motion.div>
      </div>
    </motion.div>
  );
}

export default IntroSlide;

