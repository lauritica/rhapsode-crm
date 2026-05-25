'use client';

import { Icons } from './Icons';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-name">
          R<i>h</i>apsode
        </div>
      </div>

      <div className="nav-section">Workspace</div>
      <button className="nav-item">{Icons.home}<span>Dashboard</span></button>
      <button className="nav-item active">{Icons.pipeline}<span>Pipeline</span></button>
      <button className="nav-item">{Icons.users}<span>Clients</span></button>
      <button className="nav-item">
        {Icons.inbox}
        <span>Inbox</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent-strong)' }}>7</span>
      </button>
      <button className="nav-item">{Icons.calendar}<span>Calendar</span></button>

      <div className="nav-section">Insights</div>
      <button className="nav-item">{Icons.chart}<span>Reports</span></button>
      <button className="nav-item">{Icons.bolt}<span>Automations</span></button>

      <div className="nav-spacer" />

      <div className="nav-user">
        <div className="avatar">LR</div>
        <div>
          <div className="nav-user-name">Laura Rao</div>
          <div className="nav-user-meta">Lead Broker</div>
        </div>
      </div>
    </aside>
  );
}
