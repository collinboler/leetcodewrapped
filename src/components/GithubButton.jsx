import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function formatStars(num, round = true) {
  if (!round) return num.toLocaleString();
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export function GithubButton({ 
  initialStars = 0,
  separator = true,
  label = "Star",
  roundStars = true,
  repoUrl = "https://github.com",
  variant = "default"
}) {
  const [stars, setStars] = useState(initialStars);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch real star count from GitHub API
  useEffect(() => {
    const fetchStars = async () => {
      try {
        // Extract owner/repo from URL
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
          const [, owner, repo] = match;
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (response.ok) {
            const data = await response.json();
            setStars(data.stargazers_count);
          }
        }
      } catch (error) {
        // Keep initial stars on error
      }
    };
    fetchStars();
  }, [repoUrl]);

  const isOutline = variant === 'outline';

  return (
    <motion.a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="github-button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        borderRadius: '8px',
        overflow: 'hidden',
        background: isOutline ? 'rgba(255, 255, 255, 0.05)' : '#238636',
        border: isOutline ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        boxShadow: isHovered ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Main button section */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          color: '#fff',
        }}
      >
        {/* GitHub Icon */}
        <svg 
          height="16" 
          width="16" 
          viewBox="0 0 16 16" 
          fill="currentColor"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        
        {/* Star Icon */}
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="currentColor"
        >
          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
        </svg>

        {label && <span>{label}</span>}
      </span>

      {/* Star count section */}
      {separator && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#fff',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {formatStars(stars, roundStars)}
        </span>
      )}
    </motion.a>
  );
}

export default GithubButton;

