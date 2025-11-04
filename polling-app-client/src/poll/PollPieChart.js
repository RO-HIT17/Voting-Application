import React from 'react';

const defaultColors = [
  '#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2', '#f5222d'
];

function polarToCartesian(cx, cy, r, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  var start = polarToCartesian(cx, cy, r, endAngle);
  var end = polarToCartesian(cx, cy, r, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  var d = [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z'
  ].join(' ');
  return d;
}

const PollPieChart = ({ options = [], size = 300 }) => {
  const normalized = (options || []).map((o, i) => ({
    id: o.id != null ? o.id : i,
    text: o.text || o.choice || o.name || o.option || `Option ${i + 1}`,
    voteCount: Number(o.voteCount || o.votes || o.count || 0)
  }));

  const total = normalized.reduce((s, o) => s + o.voteCount, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = Math.min(cx, cy) - 2;

  let cumulative = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', padding: 12, borderRadius: 8, background: 'linear-gradient(135deg, rgba(24,144,255,0.06) 0%, rgba(82,196,26,0.04) 50%, rgba(250,173,20,0.03) 100%)' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f5f7fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e9eef7" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={size} height={size} fill="url(#bgGrad)" rx="8" />
        {normalized.length === 0 && (
          <text x={cx} y={cy} textAnchor="middle" fill="#999">No data</text>
        )}
        {normalized.map((opt, i) => {
          const value = opt.voteCount;
          const startAngle = (cumulative / Math.max(total, 1)) * 360;
          cumulative += value;
          const endAngle = (cumulative / Math.max(total, 1)) * 360;
          const d = describeArc(cx, cy, r, startAngle, endAngle);
          const color = defaultColors[i % defaultColors.length];
          return (
            <path key={opt.id} d={d} fill={color} stroke="#fff" strokeWidth="1" />
          );
        })}
        {/* center label */}
        <text x={cx} y={cy} textAnchor="middle" dy="6" fontSize="14" fill="#333">{total} votes</text>
      </svg>

      <div style={{ minWidth: 160 }}>
        {normalized.map((opt, i) => (
          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ width: 12, height: 12, background: defaultColors[i % defaultColors.length], display: 'inline-block', marginRight: 8, borderRadius: 2 }} />
            <div style={{ fontSize: 13 }}>
              <div style={{ color: '#333' }}>{opt.text}</div>
              <div style={{ color: '#888', fontSize: 12 }}>{opt.voteCount} votes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollPieChart;
