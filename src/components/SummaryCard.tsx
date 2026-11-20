import type { ReactNode } from 'react';

interface SummaryCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: 'default' | 'positive' | 'danger';
  hint?: string;
}

export default function SummaryCard({
  label,
  value,
  icon,
  tone = 'default',
  hint,
}: SummaryCardProps) {
  return (
    <div className="card summary-card">
      <div className={`summary-icon tone-${tone}`}>{icon}</div>
      <div>
        <p className="summary-label">{label}</p>
        <p className={`summary-value tone-text-${tone}`}>{value}</p>
        {hint && <p className="summary-hint">{hint}</p>}
      </div>
    </div>
  );
}