import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Landing({ onSubmit, error }) {
  const [username, setUsername] = useState('');
  const [sessionCookie, setSessionCookie] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsSubmitting(true);
    await onSubmit(username.trim(), sessionCookie.trim() || null);
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
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1, delay: 0.2 }}
        >
          <img src="/leetcode.svg" alt="LeetCode" className="logo" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          LeetCode Wrapped
        </motion.h1>

        <motion.div 
          className="year"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          2025 Year in Review
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Discover your coding journey. See how many problems you crushed, 
          your favorite language, longest streak, and more.
        </motion.p>

        <motion.form 
          className="input-container"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <input
            type="text"
            className="username-input"
            placeholder="Enter your LeetCode username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              textDecoration: 'underline',
            }}
          >
            {showAdvanced ? 'Hide advanced options' : 'Want full submission history? (optional)'}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ width: '100%', overflow: 'hidden' }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '1rem',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
                    To get your full submission history:
                  </div>
                  <ol style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', paddingLeft: '1.2rem', marginBottom: '0.75rem' }}>
                    <li>Go to leetcode.com and log in</li>
                    <li>Open DevTools (F12) → Application → Cookies</li>
                    <li>Find LEETCODE_SESSION and copy its value</li>
                  </ol>
                  <input
                    type="password"
                    placeholder="Paste LEETCODE_SESSION cookie (optional)"
                    value={sessionCookie}
                    onChange={(e) => setSessionCookie(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fff',
                      fontSize: '0.85rem',
                    }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '0.5rem' }}>
                    This enables "most retried problem" and detailed submission stats
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || !username.trim()}
            style={{ marginTop: '1rem' }}
          >
            {isSubmitting ? 'Loading...' : 'Unwrap My 2025'}
          </button>

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

      {/* Floating particles background effect */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              borderRadius: '50%',
              background: `rgba(255, 161, 22, ${Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Landing;
