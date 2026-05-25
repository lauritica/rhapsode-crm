'use client';

import { Client } from '@/lib/types';

interface KPIsProps {
  sellers: Client[];
  buyers: Client[];
}

export function KPIs({ sellers, buyers }: KPIsProps) {
  const all = [...sellers, ...buyers];
  const active = all.filter((c) => c.status === 'active').length;
  const warming = all.filter((c) => c.status === 'warming').length;
  const cold = all.filter((c) => c.status === 'cold').length;
  const totalM = 18.4;

  return (
    <div className="kpis">
      <div className="kpi">
        <div className="kpi-label">
          <span className="dot" style={{ background: 'var(--active)' }} />
          Active deals
        </div>
        <div className="kpi-value">
          {active}
          <span style={{ color: 'var(--ink-mute)', fontSize: 18, marginLeft: 6 }}>
            / {all.length}
          </span>
        </div>
        <div className="kpi-delta up">▲ 3 vs last week</div>
        <div className="kpi-sparkbar">
          <i style={{ width: (active / all.length) * 100 + '%' }} />
        </div>
      </div>

      <div className="kpi">
        <div className="kpi-label">
          <span className="dot" style={{ background: 'var(--warming)' }} />
          Warming · Cold
        </div>
        <div className="kpi-value">
          {warming}
          <span style={{ color: 'var(--ink-mute)', fontSize: 18, margin: '0 6px' }}>·</span>
          {cold}
        </div>
        <div className="kpi-delta">{cold} need follow-up today</div>
        <div className="kpi-sparkbar">
          <i style={{ width: '55%', background: 'linear-gradient(90deg, var(--warming), var(--cold))' }} />
        </div>
      </div>

      <div className="kpi">
        <div className="kpi-label">
          <span className="dot" style={{ background: 'var(--accent-strong)' }} />
          Pipeline value
        </div>
        <div className="kpi-value mono">${totalM}M</div>
        <div className="kpi-delta up">▲ $2.1M this month</div>
        <div className="kpi-sparkbar">
          <i style={{ width: '72%' }} />
        </div>
      </div>

      <div className="kpi">
        <div className="kpi-label">
          <span className="dot" style={{ background: 'oklch(0.82 0.14 220)' }} />
          Closing · next 30d
        </div>
        <div className="kpi-value">
          4
          <span style={{ color: 'var(--ink-mute)', fontSize: 18, marginLeft: 6 }}>deals</span>
        </div>
        <div className="kpi-delta">$4.8M projected</div>
        <div className="kpi-sparkbar">
          <i style={{ width: '40%', background: 'linear-gradient(90deg, oklch(0.82 0.14 220), var(--accent))' }} />
        </div>
      </div>
    </div>
  );
}
