import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Loading from './components/Loading';
import Wrapped from './components/Wrapped';
import { fetchAllUserData } from './api/leetcode';
import { saveUserSearch } from './api/db';

function App() {
  const [stage, setStage] = useState('landing'); // landing, loading, wrapped
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (inputUsername) => {
    setError('');
    setUsername(inputUsername);
    setStage('loading');

    try {
      const data = await fetchAllUserData(inputUsername);

      if (!data.profile || data.profile.errors) {
        throw new Error('User not found');
      }

      setUserData(data);
      saveUserSearch(inputUsername);
      setStage('wrapped');
    } catch (err) {
      setError(err.message || 'Failed to fetch user data');
      setStage('landing');
    }
  };

  const handleRestart = () => {
    setStage('landing');
    setUserData(null);
    setUsername('');
    setError('');
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <Landing
            key="landing"
            onSubmit={handleSubmit}
            error={error}
          />
        )}
        {stage === 'loading' && (
          <Loading key="loading" username={username} />
        )}
        {stage === 'wrapped' && userData && (
          <Wrapped
            key="wrapped"
            data={userData}
            username={username}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
