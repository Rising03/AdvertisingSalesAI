import React, { useMemo } from 'react';

// Icons
const PieChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);

const BudgetChart = ({ budget }) => {
  const { tv, radio, newspaper } = budget;
  const total = tv + radio + newspaper;

  const chartData = useMemo(() => {
    if (total === 0) {
      return [
        { name: 'TV', value: 0, percent: 0, color: '#6366F1' },
        { name: 'Radio', value: 0, percent: 0, color: '#10B981' },
        { name: 'Newspaper', value: 0, percent: 0, color: '#F59E0B' }
      ];
    }

    return [
      { 
        name: 'TV', 
        value: tv, 
        percent: ((tv / total) * 100).toFixed(1), 
        color: '#6366F1' 
      },
      { 
        name: 'Radio', 
        value: radio, 
        percent: ((radio / total) * 100).toFixed(1), 
        color: '#10B981' 
      },
      { 
        name: 'Newspaper', 
        value: newspaper, 
        percent: ((newspaper / total) * 100).toFixed(1), 
        color: '#F59E0B' 
      }
    ];
  }, [tv, radio, newspaper, total]);

  // Calculate stroke-dasharray for donut chart
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  const segments = useMemo(() => {
    let offset = 0;
    return chartData.map((item) => {
      const dashLength = (item.percent / 100) * circumference;
      const segment = {
        ...item,
        dashArray: `${dashLength} ${circumference - dashLength}`,
        offset: -offset
      };
      offset += dashLength;
      return segment;
    });
  }, [chartData, circumference]);

  return (
    <div className="card chart-card">
      <div className="card-header">
        <div className="card-icon">
          <PieChartIcon />
        </div>
        <div>
          <h2 className="card-title">Budget Allocation</h2>
          <p className="card-subtitle">Visual breakdown of your ad spend</p>
        </div>
      </div>

      <div className="chart-container">
        {/* Donut Chart */}
        <div className="donut-chart">
          <svg viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="35"
            />
            
            {/* Data segments */}
            {segments.map((segment, index) => (
              <circle
                key={segment.name}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="35"
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.offset}
                style={{
                  transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease'
                }}
              />
            ))}
          </svg>
          
          {/* Center text */}
          <div className="donut-center">
            <div className="donut-total">
              {total > 0 ? `$${total.toLocaleString()}` : '$0'}
            </div>
            <div className="donut-label">Total Budget</div>
          </div>
        </div>

        {/* Legend */}
        <div className="chart-legend">
          {chartData.map((item) => (
            <div key={item.name} className={`legend-item ${item.name.toLowerCase()}`}>
              <div className="legend-info">
                <div className="legend-color" style={{ background: item.color }}></div>
                <span className="legend-name">{item.name}</span>
              </div>
              <div>
                <span className="legend-value">${item.value.toLocaleString()}</span>
                <span className="legend-percent">({item.percent}%)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        {total > 0 && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'var(--background)', 
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--primary)'
          }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Insight:</strong>{' '}
              {chartData[0].percent > 50 
                ? 'TV advertising dominates your budget. Consider diversifying for broader reach.'
                : chartData[1].percent > 40
                ? 'Radio has strong allocation. Great for local market penetration.'
                : 'Your budget is well-distributed across channels for balanced exposure.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetChart;
