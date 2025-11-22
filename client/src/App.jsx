import { useState, useEffect } from 'react';
import UrlShortener from './components/UrlShortener';
import LinksList from './components/LinksList';
import StatsView from './components/StatsView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔗 TinyLink</h1>
          <p className="text-gray-600">Shorten your URLs and track clicks</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex justify-between items-center">
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800 font-bold text-xl"
            >
              ✕
            </button>
          </div>
        )}

        <main className="space-y-8">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <UrlShortener
              onCreateLink={createLink}
              loading={loading}
              apiUrl={API_URL}
            />
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6">
            <LinksList
              links={links}
              onDelete={deleteLink}
              onViewStats={fetchStats}
              loading={loading}
              apiUrl={API_URL}
            />
          </section>

          {selectedLink && (
            <section>
              <StatsView
                link={selectedLink}
                onClose={() => setSelectedLink(null)}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
