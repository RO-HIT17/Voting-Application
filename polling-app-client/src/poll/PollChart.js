import React from 'react';

const PollChart = ({ options = [] }) => {
  const normalized = (options || []).map((o, i) => ({
    id: o.id != null ? o.id : i,
    text: o.text || o.choice || o.name || o.option || `Option ${i + 1}`,
    voteCount: Number(o.voteCount || o.votes || o.count || 0)
  }));

  const max = Math.max(...normalized.map(o => o.voteCount), 1);
  const barHeight = 22;
  const gap = 10;
  const leftLabelWidth = 200;
  const totalWidth = 700;
  const chartWidth = totalWidth - leftLabelWidth - 20;
  const height = normalized.length * (barHeight + gap);

  return (
    <svg viewBox={`0 0 ${totalWidth} ${Math.max(height, 40)}`} width="100%" height={height} preserveAspectRatio="xMinYMid meet">
      {normalized.map((opt, i) => {
        const y = i * (barHeight + gap);
        const barW = (opt.voteCount / max) * chartWidth;
        return (
          <g key={opt.id}>
            <text x={4} y={y + barHeight / 2 + 5} fontSize="12" fill="#333">{opt.text} ({opt.voteCount})</text>
            <rect x={leftLabelWidth} y={y} width={Math.max(barW, 0)} height={barHeight} fill="#1890ff" rx="4" />
            <rect x={leftLabelWidth + Math.max(barW, 0)} y={y} width={Math.max(chartWidth - barW, 0)} height={barHeight} fill="#f0f0f0" rx="4" />
          </g>
        );
      })}
    </svg>
  );
};

export default PollChart;
