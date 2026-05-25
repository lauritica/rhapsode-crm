'use client';

import { Client, Stage, avatarFor, STATUS_META } from '@/lib/types';
import { Icons } from './Icons';

interface DrawerProps {
  client: Client | null;
  stages: Stage[];
  isSeller?: boolean;
  onClose: () => void;
  onPatch?: (patch: Partial<Client>) => void;
}

export function Drawer({ client, stages, isSeller = true, onClose }: DrawerProps) {
  if (!client) {
    return (
      <>
        <div className="drawer-backdrop" />
        <div className="drawer" />
      </>
    );
  }

  const av = avatarFor(client.name);
  const stage = stages[client.current_stage];
  const sm = STATUS_META[client.status];

  const timeline = [
    { d: 'Today', e: <><b>Next step</b>: {client.next_action}</> },
    { d: 'Yesterday', e: <>Moved to <b>{stage?.label}</b> stage</> },
    { d: '3 days ago', e: <>Call · {client.agent} · <b>22 min</b></> },
    { d: '1 week ago', e: <>Email · sent market update</> },
    { d: '2 weeks ago', e: <>Added to pipeline · {client.source}</> },
  ];

  return (
    <>
      <div
        className={`drawer-backdrop${client ? ' open' : ''}`}
        onClick={onClose}
      />
      <div className={`drawer${client ? ' open' : ''}`}>
        <div className="drawer-head">
          <div
            className="avatar"
            style={{
              background: `oklch(0.55 0.14 ${av.h})`,
              color: `oklch(0.98 0.03 ${av.h})`,
            }}
          >
            {av.init}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="drawer-title">{client.name}</div>
            <div className="drawer-sub">{client.address}</div>
          </div>
          <button className="close" onClick={onClose}>
            {Icons.x}
          </button>
        </div>

        <div className="drawer-body">
          <div className={`drawer-status ${client.status}`}>
            <span className="pulse" />
            {sm.icon} {sm.label} · {stage?.label}
          </div>

          <div className="next-action">
            <div className="icon">{Icons.bolt}</div>
            <div>
              <div className="label">Next action</div>
              <div className="text">{client.next_action}</div>
            </div>
            <div className="due">GO →</div>
          </div>

          <div className="section-title">Details</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="k">
                {isSeller ? 'List price' : 'Budget'}
              </div>
              <div className="v mono">{client.price}</div>
            </div>
            <div className="detail-item">
              <div className="k">Days in stage</div>
              <div className="v mono">{client.entered_stage}d</div>
            </div>
            <div className="detail-item">
              <div className="k">Agent</div>
              <div className="v">{client.agent}</div>
            </div>
            <div className="detail-item">
              <div className="k">Source</div>
              <div className="v">{client.source}</div>
            </div>
          </div>

          <div className="section-title">Activity timeline</div>
          <div className="timeline-list">
            {timeline.map((t, i) => (
              <div className="timeline-item" key={i}>
                <div className="ti-date">{t.d}</div>
                <div className="ti-event">{t.e}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="drawer-actions">
          <button className="btn">
            {Icons.phone}
            <span>Call</span>
          </button>
          <button className="btn">
            {Icons.mail}
            <span>Email</span>
          </button>
          <button className="btn">
            {Icons.note}
            <span>Note</span>
          </button>
          <button className="btn btn-primary">
            {Icons.check}
            <span>Advance</span>
          </button>
        </div>
      </div>
    </>
  );
}
