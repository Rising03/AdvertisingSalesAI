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
        { name: 'TV', value: 0, percent: 0, color: '#7C3AED' },
        { name: 'Radio', value: 0, percent: 0, color: '#0EA5E9' },
        { name: 'Newspaper', value: 0, percent: 0, color: '#F472B6' }
      ];
    }

    return [
      { 
        name: 'TV', 
        value: tv, 
        percent: ((tv / total) * 100).toFixed(1), 
        color: '#7C3AED' 
      },
      { 
        name: 'Radio', 
        value: radio, 
        percent: ((radio / total) * 100).toFixed(1), 
        color: '#0EA5E9' 
      },
      { 
        name: 'Newspaper', 
        value: newspaper, 
        percent: ((newspaper / total) * 100).toFixed(1), 
        color: '#F472B6' 
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

  // Generate insight based on budget allocation
  const getInsight = () => {
    if (total === 0) return "Set your advertising budget to see insights.";
    
    const tvPercent = parseFloat(chartData[0].percent);
    const radioPercent = parseFloat(chartData[1].percent);
    
    if (tvPercent > 60) {
      return "TV dominates your strategy. Consider diversifying for broader reach across channels.";
    } else if (radioPercent > 40) {
      return "Strong radio allocation! Great for local market penetration and brand awareness.";
    } else if (tvPercent < 30 && radioPercent < 30) {
      return "Balanced multi-channel approach. Optimal for reaching diverse audience segments.";
    } else {
      return "Your budget distribution supports a well-rounded advertising campaign.";
    }
  };

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
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="40"
            />
            
            {/* Data segments */}
            {segments.map((segment) => (
              <circle
                key={segment.name}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="40"
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
            <div className="donut-label">Total</div>
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
        <div className="insight-box">
          <p>
            <strong>💡 Insight:</strong> {getInsight()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
