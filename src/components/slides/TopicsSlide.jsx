import { motion } from 'framer-motion';
import { useMemo } from 'react';

const YEAR = 2025;

function TopicsSlide({ data }) {
  // Extract topic data from skill stats or submissions (filtered to current year)
  const topicData = useMemo(() => {
    let topics = [];
    
    const submissions = data.submissions?.submission || [];
    
    // Filter submissions to only include this year
    const yearStart = new Date(YEAR, 0, 1).getTime() / 1000;
    const yearEnd = new Date(YEAR, 11, 31, 23, 59, 59).getTime() / 1000;
    
    const thisYearSubmissions = submissions.filter(sub => {
      const timestamp = parseInt(sub.timestamp);
      return timestamp >= yearStart && timestamp <= yearEnd;
    });
    
    // Extract topics from submission titles
    if (thisYearSubmissions.length > 0) {
      const tagCount = {};
      thisYearSubmissions.forEach(sub => {
        if (sub.title) {
          const patterns = {
            'Array': /array|matrix|grid|subarray|nums|element/i,
            'String': /string|substring|anagram|palindrome|character|letter/i,
            'Tree': /tree|bst|binary tree|node|root|leaf/i,
            'Graph': /graph|dfs|bfs|path|node|edge/i,
            'Dynamic Programming': /dp|dynamic|fibonacci|climbing|house robber/i,
            'Hash Table': /hash|map|set|duplicate|contain/i,
            'Two Pointers': /pointer|two sum|three sum|container|water/i,
            'Sliding Window': /window|sliding|maximum|minimum.*subarray/i,
            'Sorting': /sort|merge|quick|order|arrange/i,
            'Linked List': /linked|list|node|next|reverse/i,
            'Stack': /stack|bracket|parenthes|valid/i,
            'Queue': /queue|bfs|level order/i,
            'Math': /math|number|digit|prime|factorial/i,
            'Binary Search': /binary search|search|sorted|find/i,
            'Backtracking': /backtrack|permutation|combination|subset/i,
            'Recursion': /recurs|fibonacci|factorial/i,
            'Greedy': /greedy|maximum|minimum|optimal/i,
            'Heap': /heap|priority|kth largest|kth smallest/i,
          };
          
          Object.entries(patterns).forEach(([topic, regex]) => {
            if (regex.test(sub.title)) {
              tagCount[topic] = (tagCount[topic] || 0) + 1;
            }
          });
        }
      });
      
      topics = Object.entries(tagCount).map(([name, count]) => ({
        name,
        count,
      }));
    }
    
    // If no submissions found for this year, try skill stats (all-time fallback)
    if (topics.length === 0 && data.skillStats?.matchedUser?.tagProblemCounts) {
      const tagCounts = data.skillStats.matchedUser.tagProblemCounts;
      
      const allTags = {};
      ['fundamental', 'intermediate', 'advanced'].forEach(level => {
        if (tagCounts[level]) {
          tagCounts[level].forEach(tag => {
            if (allTags[tag.tagName]) {
              allTags[tag.tagName] += tag.problemsSolved;
            } else {
              allTags[tag.tagName] = tag.problemsSolved;
            }
          });
        }
      });
      
      topics = Object.entries(allTags).map(([name, count]) => ({
        name,
        count,
      }));
    }
    
    return topics.sort((a, b) => b.count - a.count);
  }, [data]);

  // Get top 6 topics (1 featured + 5 others)
  const topTopics = topicData.slice(0, 6);
  const topTopic = topTopics[0];
  const otherTopics = topTopics.slice(1, 6);

  // Topic colors
  const topicColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#DDA0DD',
    '#F7DC6F',
  ];

  return (
    <motion.div 
      className="slide"
      style={{
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(255, 107, 107, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, rgba(78, 205, 196, 0.12) 0%, transparent 50%),
          #0A0A0A
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        <motion.div
          style={{ 
            fontSize: '1.3rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1.5rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your top topics in {YEAR}
        </motion.div>

        {topTopic ? (
          <>
            <motion.div
              style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {topTopic.name}
            </motion.div>

            <motion.div
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              is your most practiced topic ({topTopic.count} submissions)
            </motion.div>

            {/* Show all 6 topics with bars */}
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                width: '100%',
                maxWidth: '500px',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {topTopics.map((topic, index) => (
                <motion.div
                  key={topic.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.08 }}
                >
                  <div style={{
                    width: '22px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: topicColors[index],
                  }}>
                    #{index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      height: '28px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${topicColors[index]}, ${topicColors[index]}88)`,
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 0.65rem',
                          minWidth: 'fit-content',
                        }}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.max((topic.count / topTopic.count) * 100, 30)}%` 
                        }}
                        transition={{ duration: 0.8, delay: 1 + index * 0.08 }}
                      >
                        <span style={{ 
                          fontWeight: 600, 
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          color: '#fff',
                        }}>
                          {topic.name}
                        </span>
                        <span style={{ 
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: '#fff',
                        }}>
                          {topic.count}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            style={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              marginTop: '2rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>No {YEAR} Data</div>
            <div>No submissions found for {YEAR}</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Start solving to see your topic breakdown!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default TopicsSlide;
