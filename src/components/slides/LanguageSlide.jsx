import { motion } from 'framer-motion';

function LanguageSlide({ data }) {
  // The API returns language stats as {languageProblemCount: [...]}
  let languageStats = [];
  
  if (data.languageStats?.languageProblemCount) {
    languageStats = data.languageStats.languageProblemCount;
  } else if (Array.isArray(data.languageStats)) {
    languageStats = data.languageStats;
  }
  
  // Sort by problem count - show ALL languages with at least 1 problem solved
  const sortedLanguages = [...languageStats]
    .filter(l => l.problemsSolved > 0)
    .sort((a, b) => b.problemsSolved - a.problemsSolved);

  const topLanguage = sortedLanguages[0];
  const otherLanguages = sortedLanguages.slice(1);

  // Devicon mapping for official language icons
  const languageIcons = {
    'Python': 'python',
    'Python3': 'python',
    'python': 'python',
    'python3': 'python',
    'JavaScript': 'javascript',
    'javascript': 'javascript',
    'TypeScript': 'typescript',
    'typescript': 'typescript',
    'Java': 'java',
    'java': 'java',
    'C++': 'cplusplus',
    'cpp': 'cplusplus',
    'C': 'c',
    'c': 'c',
    'Go': 'go',
    'golang': 'go',
    'Rust': 'rust',
    'rust': 'rust',
    'Ruby': 'ruby',
    'ruby': 'ruby',
    'Swift': 'swift',
    'swift': 'swift',
    'Kotlin': 'kotlin',
    'kotlin': 'kotlin',
    'Scala': 'scala',
    'scala': 'scala',
    'PHP': 'php',
    'php': 'php',
    'C#': 'csharp',
    'csharp': 'csharp',
    'MySQL': 'mysql',
    'mysql': 'mysql',
    'PostgreSQL': 'postgresql',
    'postgresql': 'postgresql',
    'R': 'r',
    'r': 'r',
    'Dart': 'dart',
    'dart': 'dart',
  };

  // Language color mapping
  const languageColors = {
    'Python': '#3776AB',
    'Python3': '#3776AB',
    'python': '#3776AB',
    'python3': '#3776AB',
    'JavaScript': '#F7DF1E',
    'javascript': '#F7DF1E',
    'TypeScript': '#3178C6',
    'typescript': '#3178C6',
    'Java': '#ED8B00',
    'java': '#ED8B00',
    'C++': '#00599C',
    'cpp': '#00599C',
    'C': '#A8B9CC',
    'c': '#A8B9CC',
    'Go': '#00ADD8',
    'golang': '#00ADD8',
    'Rust': '#CE422B',
    'rust': '#CE422B',
    'Ruby': '#CC342D',
    'ruby': '#CC342D',
    'Swift': '#FA7343',
    'swift': '#FA7343',
    'Kotlin': '#7F52FF',
    'kotlin': '#7F52FF',
    'C#': '#239120',
    'csharp': '#239120',
    'MySQL': '#4479A1',
    'mysql': '#4479A1',
  };

  // Format language name for display
  const formatLangName = (name) => {
    const nameMap = {
      'python3': 'Python',
      'python': 'Python',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'golang': 'Go',
      'rust': 'Rust',
      'ruby': 'Ruby',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'scala': 'Scala',
      'php': 'PHP',
      'csharp': 'C#',
      'mysql': 'MySQL',
    };
    return nameMap[name?.toLowerCase()] || name;
  };

  const getIconUrl = (langName) => {
    const iconName = languageIcons[langName] || languageIcons[langName?.toLowerCase()];
    if (iconName) {
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconName}/${iconName}-original.svg`;
    }
    return null;
  };

  return (
    <motion.div 
      className="slide language-slide"
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
          Your weapon of choice
          <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.25rem', opacity: 0.6 }}>(all-time)</span>
        </motion.div>

        {topLanguage ? (
          <>
            <motion.div
              style={{ 
                width: '80px', 
                height: '80px', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
            >
              {getIconUrl(topLanguage.languageName) ? (
                <img 
                  src={getIconUrl(topLanguage.languageName)} 
                  alt={topLanguage.languageName}
                  style={{ width: '80px', height: '80px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{ 
                  fontSize: '3rem',
                  color: languageColors[topLanguage.languageName] || '#fff',
                }}>
                  {'</>'}
                </div>
              )}
            </motion.div>

            <motion.div 
              className="top-language"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {formatLangName(topLanguage.languageName)}
            </motion.div>

            <motion.div
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '2rem',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {topLanguage.problemsSolved} problems solved
            </motion.div>

            {/* Show ALL other languages */}
            {otherLanguages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  width: '100%',
                  maxWidth: '400px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                }}
              >
                {otherLanguages.map((lang, index) => (
                  <motion.div 
                    key={lang.languageName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${languageColors[lang.languageName] || '#666'}`,
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                    }}>
                      {getIconUrl(lang.languageName) && (
                        <img 
                          src={getIconUrl(lang.languageName)} 
                          alt=""
                          style={{ width: '18px', height: '18px' }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>
                        {formatLangName(lang.languageName)}
                      </span>
                    </div>
                    <span style={{ 
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: languageColors[lang.languageName] || '#4facfe',
                    }}>
                      {lang.problemsSolved}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
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
            <div style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'monospace' }}>{'</>'}</div>
            <div>No language data available</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Start solving to see your language stats!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default LanguageSlide;
