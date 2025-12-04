import { motion } from 'framer-motion';
import { useMemo } from 'react';

function FinalSlide({ data, username, onRestart }) {
  const totalSolved = data.solved?.solvedProblem || 0;
  const easy = data.solved?.easySolved || 0;
  const medium = data.solved?.mediumSolved || 0;
  const hard = data.solved?.hardSolved || 0;
  const ranking = data.profile?.ranking || 'N/A';
  const badges = data.badges?.badges?.length || 0;
  const contestRating = Math.round(data.contest?.contestParticipation?.contestRating || 0);

  // Calculate 2024-specific active days
  const activeDays2024 = useMemo(() => {
    const calendarData = data.calendar?.submissionCalendar || '{}';
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      return 0;
    }
    
    const daysWithSubmissions = new Set();
    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getFullYear() === 2025 && count > 0) {
        daysWithSubmissions.add(date.toISOString().split('T')[0]);
      }
    });
    return daysWithSubmissions.size;
  }, [data.calendar]);

  const stats = [
    { label: 'Problems Solved', value: totalSolved },
    { label: 'Easy', value: easy },
    { label: 'Medium', value: medium },
    { label: 'Hard', value: hard },
    { label: 'Global Rank', value: `#${ranking.toLocaleString()}` },
    { label: 'Badges', value: badges },
    { label: '2025 Active Days', value: activeDays2024 },
    { label: 'Contest Rating', value: contestRating || 'N/A' },
  ];

  const handleShare = async () => {
    const shareText = `My LeetCode Wrapped 2025

${totalSolved} problems solved
Easy: ${easy} | Medium: ${medium} | Hard: ${hard}
Global Rank: #${ranking.toLocaleString()}
${activeDays2024} active days in 2025
${badges} badges earned

#LeetCodeWrapped #LeetCode #Coding`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LeetCode Wrapped 2025',
          text: shareText,
        });
      } catch (err) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Stats copied to clipboard!');
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Stats copied to clipboard!');
    });
  };

  return (
    <motion.div 
      className="slide final-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          That's a wrap, <span style={{ 
            background: 'linear-gradient(135deg, #FFA116 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{username}</span>!
        </motion.h1>

        <motion.p
          style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '2rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your complete 2025 LeetCode summary
        </motion.p>

        <motion.div 
          className="final-stats-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="final-stat"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.08 }}
            >
              <div className="final-stat-number">{stat.value}</div>
              <div className="final-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="share-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <button className="share-btn" onClick={handleShare}>
            Share Your Wrapped
          </button>
          <button className="restart-btn" onClick={onRestart}>
            Try Another Username
          </button>
        </motion.div>

        <motion.div
          style={{
            marginTop: '3rem',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.85rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
        >
          Made for the LeetCode community
        </motion.div>
      </div>
    </motion.div>
  );
}

export default FinalSlide;
