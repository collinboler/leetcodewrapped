import { motion } from 'framer-motion';
import ShareButton from '../ShareButton';

function BadgesSlide({ data, username, avatar }) {
  const badges = data.badges?.badges || [];
  const badgeCount = badges.length;

  return (
    <motion.div
      className="slide badges-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        <motion.div
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Achievements
        </motion.div>

        <motion.div
          style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(5rem, 12vw, 8rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FFA116 0%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {badgeCount}
        </motion.div>

        <motion.div
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '2.5rem',
            fontSize: '1.2rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          badge{badgeCount !== 1 ? 's' : ''} earned
        </motion.div>

        {badges.length > 0 ? (
          <motion.div
            className="badges-grid"
            style={{ maxWidth: '600px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {badges.slice(0, 12).map((badge, index) => (
              <motion.div
                key={badge.id || index}
                className="badge-item"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.08 }}
              >
                <div className="badge-icon">
                  {badge.icon ? (
                    <img
                      src={badge.icon}
                      alt={badge.displayName || badge.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15L8.5 17L9.5 13L6.5 10.5L10.5 10L12 6.5L13.5 10L17.5 10.5L14.5 13L15.5 17L12 15Z" fill="#FFA116"/></svg>';
                      }}
                    />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15L8.5 17L9.5 13L6.5 10.5L10.5 10L12 6.5L13.5 10L17.5 10.5L14.5 13L15.5 17L12 15Z" fill="#FFA116" />
                    </svg>
                  )}
                </div>
                <div className="badge-name">
                  {badge.displayName || badge.name || 'Badge'}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>No badges yet</div>
            <div>Keep solving to earn badges!</div>
          </motion.div>
        )}

        {badges.length > 12 && (
          <motion.div
            style={{
              marginTop: '1.5rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.9rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            +{badges.length - 12} more badges
          </motion.div>
        )}
      </div>
      <ShareButton username={username} avatar={avatar} />
    </motion.div>
  );
}

export default BadgesSlide;
