import { useState } from 'react';
import './UrlShortener.css';

function UrlShortener({ onCreateLink, loading }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);

    // Validate URL
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    try {
      const data = await onCreateLink(url, customCode);
      setResult(data);
      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
      console.log(err)
    }
  };

  return (
    <div className="url-shortener">
      <h2>Shorten a URL</h2>

      <form onSubmit={handleSubmit} className="shortener-form">
        <div className="form-group">
          <label htmlFor="url">Enter your long URL</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customCode">Custom short code (optional)</label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-custom-code"
            disabled={loading}
            maxLength="10"
          />
          <small>Leave empty for auto-generated code</small>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <h3>✅ Success!</h3>
          <div className="result-content">
            <div className="result-row">
              <label>Original URL:</label>
              <span className="url-text">{result.originalUrl}</span>
            </div>
            <div className="result-row">
              <label>Short URL:</label>
              <div className="short-url-container">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-url"
                >
                  {result.shortUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="btn-copy"
                  title="Copy to clipboard"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UrlShortener;
