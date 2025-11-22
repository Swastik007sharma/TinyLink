import { useState, useEffect } from 'react';
import './App.css';
import UrlShortener from './components/UrlShortener';
import LinksList from './components/LinksList';
import StatsView from './components/StatsView';

const API_URL = import.meta.env.API_URL;

function App() {
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all links
  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/api/links`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new short link
  const createLink = async (url, customCode) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/api/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customCode: customCode || undefined }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create link');
      }

      const data = await response.json();
      await fetchLinks(); // Refresh the list
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a link
  const deleteLink = async (shortCode) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/api/links/${shortCode}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete link');
      }

      await fetchLinks(); // Refresh the list
      if (selectedLink?.shortCode === shortCode) {
        setSelectedLink(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats for a specific link
  const fetchStats = async (shortCode) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/api/links/${shortCode}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setSelectedLink(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load links on mount
  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔗 TinyLink</h1>
        <p>Shorten your URLs and track clicks</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <main className="app-main">
        <section className="section">
          <UrlShortener
            onCreateLink={createLink}
            loading={loading}
            apiUrl={API_URL}
          />
        </section>

        <section className="section">
          <LinksList
            links={links}
            onDelete={deleteLink}
            onViewStats={fetchStats}
            loading={loading}
            apiUrl={API_URL}
          />
        </section>

        {selectedLink && (
          <section className="section">
            <StatsView
              link={selectedLink}
              onClose={() => setSelectedLink(null)}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
