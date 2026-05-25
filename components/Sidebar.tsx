'use client';

import { Icons } from './Icons';

interface SidebarProps {
  activeView: string;
  onNav: (view: string) => void;
}

export function Sidebar({ activeView, onNav }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-name">
          R<i>h</i>apsode
        </div>
      </div>

      <div className="nav-section">Workspace</div>
      <button className={`nav-item${activeView === 'dashboard' ? ' active' : ''}`} onClick={() => onNav('dashboard')}>{Icons.home}<span>Dashboard</span></button>
      <button className={`nav-item${activeView === 'pipeline' ? ' active' : ''}`} onClick={() => onNav('pipeline')}>{Icons.pipeline}<span>Pipeline</span></button>
      <button className={`nav-item${activeView === 'clients' ? ' active' : ''}`} onClick={() => onNav('clients')}>{Icons.users}<span>Clients</span></button>
      <button className={`nav-item${activeView === 'inbox' ? ' active' : ''}`} onClick={() => onNav('inbox')}>
        {Icons.inbox}
        <span>Inbox</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent-strong)' }}>7</span>
      </button>
      <button className={`nav-item${activeView === 'calendar' ? ' active' : ''}`} onClick={() => onNav('calendar')}>{Icons.calendar}<span>Calendar</span></button>

      <div className="nav-section">Contracts</div>
      <button className={`nav-item${activeView === 'scrivener' ? ' active' : ''}`} onClick={() => onNav('scrivener')}>{Icons.scroll}<span>RE Scrivener</span></button>

      <div className="nav-section">Insights</div>
      <button className={`nav-item${activeView === 'reports' ? ' active' : ''}`} onClick={() => onNav('reports')}>{Icons.chart}<span>Reports</span></button>
      <button className={`nav-item${activeView === 'automations' ? ' active' : ''}`} onClick={() => onNav('automations')}>{Icons.bolt}<span>Automations</span></button>

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
