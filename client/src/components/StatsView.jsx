function StatsView({ link, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">📊 Link Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Short Code</div>
            <div className="text-lg font-mono font-semibold text-blue-900">{link.shortCode}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Original URL</div>
            <div className="break-all">
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {link.originalUrl}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">Total Clicks</div>
              <div className="text-3xl font-bold text-green-700">{link.clicks}</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">Created</div>
              <div className="text-sm text-gray-800">{formatDate(link.createdAt)}</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">Last Clicked</div>
              <div className="text-sm text-gray-800">
                {link.lastClickedAt ? formatDate(link.lastClickedAt) : 'Never'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsView;
