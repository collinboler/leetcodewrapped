import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Landing({ onSubmit, error }) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setSnowflakes(flakes);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSubmitting(true);
    await onSubmit(username.trim());
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="landing-content">
        <motion.div
          className="logo-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="/leetcodewrapped.png"
            alt="LeetCode"
            className="logo"
            style={{ animation: 'none', width: '160px', height: '160px' }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ background: 'none', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' }}
        >
          <span style={{ color: '#fea216' }}>leet</span>
          <span style={{ color: '#b3b3b3' }}>code</span>
          <br />
          <span style={{
            background: 'linear-gradient(to top, #f32426, #ffffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontStyle: 'italic',
            paddingRight: '0.2em'
          }}>wrapped</span>
        </motion.h1>

        <motion.div
          className="year"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          2025
        </motion.div>

        <motion.form
          className="input-container"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
          }}>
            <input
              type="text"
              className="username-input"
              placeholder="leetcode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              style={{
                paddingRight: '60px',
                borderRadius: '50px',
                height: '56px',
                paddingLeft: '24px',
                background: 'rgba(45, 45, 45, 0.8)',
                border: '2px solid rgba(255, 161, 22, 0.4)',
              }}
            />

            {/* Circular arrow button */}
            <button
              type="submit"
              disabled={isSubmitting || !username.trim()}
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: username.trim() ? 'var(--gradient-orange)' : 'rgba(255, 161, 22, 0.3)',
                border: 'none',
                cursor: isSubmitting || !username.trim() ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: username.trim() ? 1 : 0.5,
              }}
            >
              {isSubmitting ? (
                <motion.div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </motion.form>
      </div>

      {/* Snowflakes */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            style={{
              position: 'absolute',
              left: `${flake.x}%`,
              top: '-20px',
              width: flake.size,
              height: flake.size,
              borderRadius: '50%',
              background: 'white',
              opacity: flake.opacity,
              filter: 'blur(0.5px)',
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(flake.id) * 50],
            }}
            transition={{
              duration: flake.duration,
              repeat: Infinity,
              delay: flake.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Landing;
