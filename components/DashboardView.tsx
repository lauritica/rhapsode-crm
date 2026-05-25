'use client';

import { useState } from 'react';
import { Client, avatarFor, STATUS_META, SELLER_STAGES, BUYER_STAGES } from '@/lib/types';
import { Drawer } from './Drawer';

interface DashboardViewProps {
  sellers: Client[];
  buyers: Client[];
}

export function DashboardView({ sellers, buyers }: DashboardViewProps) {
  const [selected, setSelected] = useState<Client | null>(null);

  const all = [...sellers, ...buyers].sort((a, b) => b.last_contact - a.last_contact);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const urgentCount = all.filter(c => c.last_contact >= 7).length;

  return (
    <>
      <main className="main">
        <div className="topbar">
          <div className="title-block">
            <div className="crumb">
              <span>Workspace</span>
              <i className="crumb-dot" />
              <span>Dashboard</span>
            </div>
            <h1>Today</h1>
          </div>
          <div className="topbar-spacer" />
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{today}</div>
        </div>

        <div style={{ padding: '20px 28px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-mute)', marginBottom: 16 }}>
            {urgentCount} clients need attention · {all.length} total active
          </div>
          {all.map(c => {
            const av = avatarFor(c.name);
            const lcCls = c.last_contact >= 14 ? 'stale' : c.last_contact >= 7 ? 'warn' : '';
            const lcLabel = c.last_contact === 0 ? 'today' : c.last_contact === 1 ? '1d ago' : `${c.last_contact}d ago`;
            const sm = STATUS_META[c.status];
            return (
              <div key={c.id} className="today-card" onClick={() => setSelected(c)}>
                <div className="today-card-left">
                  <div className="avatar-sm" style={{ background: `oklch(0.55 0.14 ${av.h})`, color: `oklch(0.98 0.03 ${av.h})` }}>
                    {av.init}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="name">{c.name}</div>
                    <div className="name-sub">{c.type === 'seller' ? 'Seller' : 'Buyer'} · {c.address}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 4, fontStyle: 'italic' }}>{c.next_action}</div>
                  </div>
                </div>
                <div className="today-card-right">
                  <div className={`last-contact ${lcCls}`}>{lcLabel}</div>
                  <div className={`drawer-status ${c.status}`} style={{ marginTop: 8, fontSize: 10, padding: '3px 8px' }}>
                    <span className="pulse" />
                    {sm.icon} {sm.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Drawer
        client={selected}
        stages={selected?.type === 'seller' ? SELLER_STAGES : BUYER_STAGES}
        isSeller={selected?.type === 'seller'}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
