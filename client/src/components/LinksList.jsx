import './LinksList.css';

function LinksList({ links, onDelete, onViewStats, loading, apiUrl }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getShortUrl = (shortCode) => {
    return `${apiUrl}/${shortCode}`;
  };

  if (loading && links.length === 0) {
    return <div className="loading">Loading links...</div>;
  }

  return (
    <div className="links-list">
      <h2>Your Links ({links.length})</h2>

      {links.length === 0 ? (
        <div className="empty-state">
          <p>📝 No links yet. Create your first short link above!</p>
        </div>
      ) : (
        <div className="links-table">
          <table>
            <thead>
              <tr>
                <th>Short Code</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.shortCode}>
                  <td>
                    <a
                      href={getShortUrl(link.shortCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-code-link"
                    >
                      {link.shortCode}
                    </a>
                  </td>
                  <td className="original-url">
                    <span title={link.originalUrl}>
                      {link.originalUrl.length > 50
                        ? link.originalUrl.substring(0, 50) + '...'
                        : link.originalUrl}
                    </span>
                  </td>
                  <td>
                    <span className="clicks-badge">{link.clicks}</span>
                  </td>
                  <td className="date-cell">
                    {formatDate(link.createdAt)}
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => onViewStats(link.shortCode)}
                      className="btn-stats"
                      title="View stats"
                    >
                      📊 Stats
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete link "${link.shortCode}"?`)) {
                          onDelete(link.shortCode);
                        }
                      }}
                      className="btn-delete"
                      title="Delete link"
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LinksList;
