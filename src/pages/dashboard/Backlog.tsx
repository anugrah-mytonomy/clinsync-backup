type RiskLevel = 'high' | 'medium' | 'low';

interface BacklogTile {
  level: RiskLevel;
  label: string;
  count: number;
}

const tileStyles: Record<RiskLevel, { background: string; border: string; color: string }> = {
  high: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' },
  medium: { background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706' },
  low: { background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A' },
};

const backlogTiles: BacklogTile[] = [
  { level: 'high', label: 'High Risk', count: 1 },
  { level: 'medium', label: 'Medium Risk', count: 4 },
  { level: 'low', label: 'Low Risk', count: 4 },
];

const captions = [
  { label: 'Documents carrying a HIGH finding', count: 1 },
  { label: 'Documents awaiting replacement', count: 1 },
];

const Backlog = () => {
  return (
    <div className="flex h-[295px] flex-col rounded-lg border border-border bg-background px-6 py-5">
      <div className="flex justify-between">
      <h2 className="text-base font-bold text-slate-900">Backlog</h2>
      <p className="text-xs text-muted flex items-center text-center">Current open findings · Sep 1, 2026 scan</p>
      </div>


      <div className="mt-md grid grid-cols-3 gap-sm">
        {backlogTiles.map((tile) => {
          const style = tileStyles[tile.level];
          return (
            <div
              key={tile.level}
              className="flex h-[97px] flex-col justify-center rounded-lg pl-3"
              style={{ background: style.background, border: style.border }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: style.color }}
              >
                {tile.label}
              </p>
              <p className="mt-1 text-2xl font-bold" style={{ color: style.color }}>
                {tile.count}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-md flex flex-col justify-end gap-3  pt-sm">
        <div className="border-t border-border"/>
        {captions.map((caption) => (
          <div key={caption.label} className="flex items-center justify-between text-xs text-muted">
            <span>{caption.label}</span>
            <span className="font-medium text-slate-900">{caption.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Backlog;
