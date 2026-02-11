import React from 'react';

// Icons
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const PredictionHistory = ({ history, onClear }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <section className="history-section fade-in">
      <div className="history-header">
        <div className="history-title">
          <HistoryIcon />
          <span>Prediction History</span>
        </div>
        <button className="clear-history-btn" onClick={onClear}>
          <TrashIcon />
          <span>Clear All</span>
        </button>
      </div>

      <div className="history-grid">
        {history.map((item, index) => (
          <div 
            key={item.id} 
            className="history-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="history-item-header">
              <div className="history-prediction">
                ${item.prediction.toFixed(2)}k
              </div>
              <span className="history-date">
                {formatDate(item.date)}
              </span>
            </div>
            
            <div className="history-budgets">
              <span className="budget-tag tv">
                TV: ${item.budgets.tv}
              </span>
              <span className="budget-tag radio">
                Radio: ${item.budgets.radio}
              </span>
              <span className="budget-tag newspaper">
                News: ${item.budgets.newspaper}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PredictionHistory;
