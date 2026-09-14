import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/utils/cn';

type RiskLevel = 'high' | 'medium' | 'low';

interface TrendPoint {
  date: string;
  high: number;
  medium: number;
  low: number;
}

const riskColors: Record<RiskLevel, string> = {
  high: 'rgb(var(--color-danger))',
  medium: '#f59e0b',
  low: 'rgb(var(--color-success))',
};

const riskDotClasses: Record<RiskLevel, string> = {
  high: 'bg-danger',
  medium: 'bg-amber-500',
  low: 'bg-success',
};

const riskTextClasses: Record<RiskLevel, string> = {
  high: 'fill-danger',
  medium: 'fill-amber-600',
  low: 'fill-success',
};

const legend: { level: RiskLevel; label: string }[] = [
  { level: 'high', label: 'High' },
  { level: 'medium', label: 'Medium' },
  { level: 'low', label: 'Low' },
];

const trendData: TrendPoint[] = [
  { date: 'Aug 20, 2026', high: 0, medium: 0, low: 2 },
  { date: 'Aug 28, 2026', high: 0, medium: 3, low: 5 },
  { date: 'Sep 1, 2026', high: 1, medium: 4, low: 4 },
];

const getHighestSeverity = (point: TrendPoint): RiskLevel => {
  if (point.high > 0) return 'high';
  if (point.medium > 0) return 'medium';
  return 'low';
};

const XAxisTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => {
  const point = trendData.find((entry) => entry.date === payload?.value);
  if (!point) {
    return null;
  }

  const total = point.high + point.medium + point.low;
  const highest = getHighestSeverity(point);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={16} textAnchor="middle" className="fill-slate-900 text-[12px] font-semibold">
        {point.date}
      </text>
      <text x={0} y={32} textAnchor="middle" className="fill-muted text-[11px]">
        {total} findings
      </text>
      <text
        x={0}
        y={47}
        textAnchor="middle"
        className={cn('text-[11px] font-semibold', riskTextClasses[highest])}
      >
        Highest {highest.toUpperCase()}
      </text>
    </g>
  );
};

interface TooltipPayloadItem {
  dataKey: RiskLevel;
  value: number;
}

const RiskTrendTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-slate-900">{label}</p>
      {legend.map(({ level, label: levelLabel }) => {
        const item = payload.find((entry) => entry.dataKey === level);
        return (
          <p key={level} className="flex items-center gap-xs text-muted">
            <span className={cn('h-2 w-2 rounded-full', riskDotClasses[level])} />
            {levelLabel}: {item?.value ?? 0}
          </p>
        );
      })}
    </div>
  );
};

const RiskTrend = () => {
  const latest = trendData[trendData.length - 1];
  const earliest = trendData[0];
  const latestTotal = latest.high + latest.medium + latest.low;

  return (
    <div className="flex h-[295px] flex-col rounded-lg border border-border bg-background px-6 py-5">
      <div className="flex items-center justify-between gap-sm">
        <h2 className="text-base font-bold text-slate-900">Risk Trend</h2>
        <ul className="flex items-center gap-md">
          {legend.map(({ level, label }) => (
            <li key={level} className="flex items-center gap-xs text-xs text-muted">
              <span className={cn('h-2.5 w-2.5 rounded-full', riskDotClasses[level])} />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-md flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData} barGap={4} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval={0}
              height={56}
              tick={<XAxisTick />}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              interval={0}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <Tooltip cursor={false} content={<RiskTrendTooltip />} />
            <Bar dataKey="high" fill={riskColors.high} radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="medium" fill={riskColors.medium} radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="low" fill={riskColors.low} radius={[3, 3, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-sm text-xs text-[#353839] font-normal">
        Oldest to newest. The {latest.date.split(',')[0]} run covered {latestTotal} findings and
        {earliest.high === 0 && latest.high > 0
          ? " surfaced the library's first HIGH finding."
          : ' remained within expected range.'}
      </p>
    </div>
  );
};

export default RiskTrend;
