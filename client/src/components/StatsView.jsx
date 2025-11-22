import './StatsView.css';

function StatsView({ link, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="stats-view">
      <div className="stats-header">
        <h2>📊 Link Statistics</h2>
        <button onClick={onClose} className="btn-close">✕</button>
      </div>

      <div className="stats-content">
        <div className="stat-card">
          <div className="stat-label">Short Code</div>
          <div className="stat-value code">{link.shortCode}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Original URL</div>
          <div className="stat-value url">
            <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
              {link.originalUrl}
            </a>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Clicks</div>
            <div className="stat-value large">{link.clicks}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Created</div>
            <div className="stat-value">{formatDate(link.createdAt)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Last Clicked</div>
            <div className="stat-value">
              {link.lastClickedAt ? formatDate(link.lastClickedAt) : 'Never'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsView;
