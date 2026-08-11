'use client';

/**
 * Lightweight SVG chart components (no external chart library).
 * - DonutChart: proportional segments with legend
 * - TrendChart: area/line chart over time
 * - BarChart: horizontal bars
 */

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  segments,
  size = 180,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const fraction = total > 0 ? s.value / total : 0;
      const arc = {
        ...s,
        dash: fraction * circumference,
        offset,
      };
      offset += fraction * circumference;
      return arc;
    });

  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" role="img" aria-label="Chart">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#eef1f6"
          strokeWidth={thickness}
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        {(centerValue || centerLabel) && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="fill-gray-900">
            {centerValue && (
              <tspan x={cx} dy="-0.35em" fontWeight={800} fontSize={size / 7}>
                {centerValue}
              </tspan>
            )}
            {centerLabel && (
              <tspan x={cx} dy={centerValue ? '1.35em' : '0.35em'} fontSize={size / 13} fill="#6b7280" fontWeight={600}>
                {centerLabel}
              </tspan>
            )}
          </text>
        )}
      </svg>
      {segments.length > 0 && (
        <div className="space-y-1.5 min-w-[140px]">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-gray-600 font-semibold truncate">{s.label}</span>
              <span className="ml-auto font-black text-gray-900">
                {total > 0 ? Math.round((s.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface TrendPoint {
  label: string;
  value: number;
  value2?: number;
}

export function TrendChart({
  data,
  height = 200,
  color = '#0d9488',
  color2 = '#7c3aed',
  labelPrefix = 'ETB ',
}: {
  data: TrendPoint[];
  height?: number;
  color?: string;
  color2?: string;
  labelPrefix?: string;
}) {
  const width = 100;
  const padX = 6;
  const padTop = 14;
  const padBottom = 22;
  const plotH = height - padTop - padBottom;
  const plotW = width - padX * 2;

  const values = data.flatMap((d) => [d.value, d.value2 ?? d.value]);
  const max = Math.max(...values, 1) * 1.15;
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const x = (i: number) => padX + (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => padTop + plotH - ((v - min) / range) * plotH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(d.value).toFixed(2)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(2)},${(padTop + plotH).toFixed(2)} L${x(0).toFixed(2)},${(padTop + plotH).toFixed(2)} Z`;
  const line2 = data.some((d) => d.value2 !== undefined)
    ? data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(d.value2 ?? 0).toFixed(2)}`).join(' ')
    : '';

  const gridLines = 4;
  const ticks = Array.from({ length: gridLines + 1 }).map((_, i) => {
    const v = min + (range / gridLines) * i;
    return { v, yy: y(v) };
  });

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }} role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <line key={i} x1={padX} y1={t.yy} x2={width - padX} y2={t.yy} stroke="#eef1f6" strokeWidth={0.6} strokeDasharray="2 3" />
        ))}
        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        {line2 && <path d={line2} fill="none" stroke={color2} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.value)} r={2.2} fill={color} stroke="#fff" strokeWidth={0.8} />
            {data.some((p) => p.value2 !== undefined) && d.value2 !== undefined && (
              <circle cx={x(i)} cy={y(d.value2)} r={2.2} fill={color2} stroke="#fff" strokeWidth={0.8} />
            )}
          </g>
        ))}
        {data.map((d, i) => (
          <text key={`t${i}`} x={x(i)} y={height - 6} textAnchor="middle" fontSize={4.6} className="fill-gray-400" fontWeight={600}>
            {d.label}
          </text>
        ))}
      </svg>
      <div className="flex items-center gap-4 text-[11px] text-gray-500 font-semibold mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full" style={{ backgroundColor: color }} />
          {labelPrefix}Balance
        </span>
        {line2 && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full" style={{ backgroundColor: color2 }} />
            {labelPrefix}Contributions
          </span>
        )}
      </div>
    </div>
  );
}

export function HorizontalBars({
  data,
  max,
  prefix = '',
}: {
  data: { label: string; value: number; color?: string }[];
  max?: number;
  prefix?: string;
}) {
  const top = max ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-gray-700 truncate">{d.label}</span>
            <span className="font-black text-gray-900">
              {prefix}
              {d.value.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(2, (d.value / top) * 100)}%`,
                background: d.color || 'linear-gradient(90deg,#0d9488,#0f766e)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
