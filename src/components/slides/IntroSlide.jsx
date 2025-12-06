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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '1rem',
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #FFA116 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{username}'s</span>
          <br />
          <span style={{ color: 'white' }}>2025 LeetCode Journey</span>
        </motion.h1>

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

        </motion.div>
      </div>
    </motion.div>
  );
}

export default IntroSlide;

