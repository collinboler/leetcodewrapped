import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import ShareButton from '../ShareButton';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { updateUserEmail } from '../../api/db';

const YEAR = 2025;
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const languageIcons = {
  'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'python3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'cpp': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'c': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  'rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
};

function FinalSlide({ data, username, avatar }) {
  const easy = data.solved?.easySolved || 0;
  const medium = data.solved?.mediumSolved || 0;
  const hard = data.solved?.hardSolved || 0;
  const total = easy + medium + hard;

  const dominantDifficulty = useMemo(() => {
    if (hard >= medium && hard >= easy) return { name: 'Hard', color: '#FF375F' };
    if (medium >= easy) return { name: 'Medium', color: '#FFC01E' };
    return { name: 'Easy', color: '#00B8A3' };
  }, [easy, medium, hard]);

  const stats = useMemo(() => {
    const calendarData = data.calendar?.submissionCalendar || '{}';
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      return {};
    }

    const monthCounts = {};
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = {};
    let totalSubmissions = 0;
    let activeDays = 0;
    let longestStreak = 0;
    const sortedDates = [];

    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getUTCFullYear() === YEAR && count > 0) {
        activeDays++;
        totalSubmissions += count;
        const month = date.getUTCMonth();
        monthCounts[month] = (monthCounts[month] || 0) + count;
        weekdayCounts[date.getUTCDay()] += count;
        const dayKey = `${MONTH_NAMES[month]} ${date.getUTCDate()}`;
        dayCounts[dayKey] = (dayCounts[dayKey] || 0) + count;
        sortedDates.push(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`);
      }
    });

    sortedDates.sort();
    let tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1] + 'T00:00:00Z');
      const curr = new Date(sortedDates[i] + 'T00:00:00Z');
      if ((curr - prev) / (1000 * 60 * 60 * 24) === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    let bestMonth = null, maxMonthCount = 0;
    Object.entries(monthCounts).forEach(([m, c]) => {
      if (c > maxMonthCount) { maxMonthCount = c; bestMonth = MONTH_NAMES[parseInt(m)]; }
    });

    let bestWeekdayIdx = 0, maxWeekday = 0;
    weekdayCounts.forEach((c, i) => {
      if (c > maxWeekday) { maxWeekday = c; bestWeekdayIdx = i; }
    });

    let bestDay = null, maxDayCount = 0;
    Object.entries(dayCounts).forEach(([d, c]) => {
      if (c > maxDayCount) { maxDayCount = c; bestDay = d; }
    });

    const langs = data.languageStats?.languageProblemCount || [];
    const mergedLangs = {};
    langs.forEach(l => {
      let name = l.languageName;
      if (name.toLowerCase() === 'python3' || name.toLowerCase() === 'python') name = 'Python';
      mergedLangs[name] = (mergedLangs[name] || 0) + l.problemsSolved;
    });
    const topLang = Object.entries(mergedLangs).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const skillStats = data.skillStats;
    let topTopic = null;
    let maxTag = 0;
    if (skillStats) {
      const allTags = {};
      ['fundamental', 'intermediate', 'advanced'].forEach(level => {
        if (skillStats[level]) {
          skillStats[level].forEach(tag => {
            allTags[tag.tagName] = (allTags[tag.tagName] || 0) + tag.problemsSolved;
          });
        }
      });

      Object.entries(allTags).forEach(([n, c]) => {
        if (c > maxTag) { maxTag = c; topTopic = n; }
      });
    }

    return {
      totalSubmissions,
      activeDays,
      longestStreak,
      bestMonth,
      bestMonthCount: maxMonthCount,
      bestWeekday: FULL_DAY_NAMES[bestWeekdayIdx],
      bestWeekdayCount: maxWeekday,
      bestDay,
      bestDayCount: maxDayCount,
      topLanguage: topLang,
      topLanguageCount: mergedLangs[topLang] || 0,
      topTopic,
      topTopicCount: maxTag,
      dominantDifficulty: dominantDifficulty.name,
      dominantDifficultyCount: dominantDifficulty.name === 'Easy' ? easy : dominantDifficulty.name === 'Medium' ? medium : hard,
      badgesCount: data.badges?.length || 0,
      badges: data.badges || [],
    };
  }, [data]);

  const langIcon = stats.topLanguage ? languageIcons[stats.topLanguage.toLowerCase()] : null;

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const summaryHtml = `
        <div style="font-family: sans-serif; color: #333;">
          <p>hey <strong>${username}</strong>,</p>
          <p>it's collin here, developer of leetcodewrapped. thanks for trying it out!</p>
          <p>here's your 2025 leetcode journey wrapped:</p>
          <ul style="list-style-type: disc; padding-left: 20px;">
            <li>favorite day to leetcode: <strong>${stats.bestWeekday.toLowerCase()}</strong> (${stats.bestWeekdayCount} submissions)</li>
            <li>longest streak: <strong>${stats.longestStreak}</strong></li>
            <li>most productive month: <strong>${stats.bestMonth?.toLowerCase()}</strong> (${stats.bestMonthCount} submissions)</li>
            <li>most productive day: <strong>${stats.bestDay?.toLowerCase()}</strong> (${stats.bestDayCount} submissions)</li>
            <li>favorite coding language: <strong>${stats.topLanguage?.toLowerCase() || 'n/a'}</strong> (${stats.topLanguageCount} problems solved)</li>
            <li>your top skill: <strong>${stats.topTopic?.toLowerCase() || 'n/a'}</strong> (${stats.topTopicCount} problems solved)</li>
            <li>your top difficulty: <strong>${stats.dominantDifficulty.toLowerCase()}</strong> (${stats.dominantDifficultyCount} problems solved)</li>
            <li><strong>${stats.badgesCount}</strong> badge${stats.badgesCount !== 1 ? 's' : ''} earned ${stats.badges.length > 0 ? `(${stats.badges[0].displayName}...)` : ''}</li>
          </ul>
          <p>feel free to share <a href="https://leetcodewrapped.com" style="color: #0066cc; text-decoration: none; font-weight: bold;">leetcodewrapped.com</a> with friends, and happy leetcoding!</p>
          <p>yours truly,<br>
          <a href="https://collinboler.com" style="color: #0066cc; text-decoration: none; font-weight: bold;">collinboler</a></p>
        </div>
      `;

      await updateUserEmail(username, email);

      await addDoc(collection(db, 'mail'), {
        to: email,
        message: {
          subject: 'Your LeetCode Wrapped 2025',
          html: summaryHtml,
        },
        username: username,
        timestamp: new Date(),
      });

      setIsSent(true);
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  const gridItems = [
    { label: 'Problems', value: total, color: '#FFA116' },
    { label: 'Difficulty', value: `Mostly ${dominantDifficulty.name}`, color: dominantDifficulty.color },
    { label: 'Day Streak', value: stats.longestStreak, color: '#fa709a' },
    { label: 'Active Days', value: stats.activeDays, color: '#4facfe' },
    { label: 'Submissions', value: stats.totalSubmissions, color: '#a78bfa' },
    { label: 'Best Month', value: stats.bestMonth, color: '#40C4A9' },
    { label: 'Top Weekday', value: stats.bestWeekday?.slice(0,3), color: '#f59e0b' },
    { label: 'Peak Day', value: stats.bestDay, color: '#FFD700' },
  ];
  */

  return (
    <motion.div
      className="slide final-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      style={{
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '180px',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
      }}>
        <motion.h1
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '1rem', textAlign: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Want a special wrapped summary <span style={{ color: '#FFA116' }}>{username}</span>?
        </motion.h1>

        {/* 
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.6rem',
            width: '100%',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {gridItems.map((item, i) => (
            <motion.div
              key={item.label}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '0.75rem',
                textAlign: 'center',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <div style={{ 
                fontSize: item.label === 'Difficulty' ? 'clamp(0.85rem, 2.5vw, 1.1rem)' : 'clamp(1rem, 3vw, 1.4rem)', 
                fontWeight: 700, 
                color: item.color 
              }}>
                {item.value || 'N/A'}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ display: 'flex', gap: '0.6rem', marginTop: '0.6rem', width: '100%' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
          }}>
            {langIcon && <img src={langIcon} alt="" style={{ width: '28px', height: '28px' }} />}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ED8B00' }}>{stats.topLanguage || 'N/A'}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Top Language</div>
            </div>
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '0.75rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>{stats.topTopic || 'N/A'}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Top Skill</div>
          </div>
        </motion.div>
        */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {!isSent ? (
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
              }}>
                <input
                  type="email"
                  placeholder="zuck@meta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    paddingRight: '60px',
                    borderRadius: '50px',
                    height: '56px',
                    paddingLeft: '24px',
                    background: 'rgba(45, 45, 45, 0.8)',
                    border: '2px solid rgba(255, 161, 22, 0.4)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: email.trim() ? 'var(--gradient-orange)' : 'rgba(255, 161, 22, 0.3)',
                    border: 'none',
                    cursor: isSubmitting || !email.trim() ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: email.trim() ? 1 : 0.5,
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
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p style={{ color: '#ff4d4f', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>
              )}
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(45, 45, 45, 0.8)',
                border: '2px solid rgba(76, 175, 80, 0.5)',
                borderRadius: '50px',
                color: '#4caf50',
                fontWeight: 600,
                fontSize: '1rem',
                margin: '0 auto',
              }}
            >
              sent :)
            </motion.div>
          )}
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
            made by{' '}
            <a href="https://collinboler.com" target="_blank" rel="noopener noreferrer" style={{
              background: 'linear-gradient(to top, #da3400, #ff8c66, #ffb899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              collinboler
            </a>
          </div>
        </motion.div>

        {/* Share button inline */}
        <motion.div
          style={{ marginTop: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <ShareButton username={username} avatar={avatar} inline={true} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default FinalSlide;
