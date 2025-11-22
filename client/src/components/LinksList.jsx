function LinksList({ links, onDelete, onViewStats, loading, apiUrl }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getShortUrl = (shortCode) => {
    return `${apiUrl}/${shortCode}`;
  };

  if (loading && links.length === 0) {
    return <div className="text-center py-8 text-gray-500">Loading links...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Your Links ({links.length})
      </h2>

      {links.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">📝 No links yet. Create your first short link above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Short Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Original URL</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {links.map((link) => (
                <tr key={link.shortCode} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <a
                      href={getShortUrl(link.shortCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-mono"
                    >
                      {link.shortCode}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <span title={link.originalUrl} className="text-gray-700">
                      {link.originalUrl.length > 50
                        ? link.originalUrl.substring(0, 50) + '...'
                        : link.originalUrl}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {link.clicks}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {formatDate(link.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewStats(link.shortCode)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
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
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors"
                        title="Delete link"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
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
