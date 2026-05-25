'use client';

import { Client, Stage, avatarFor } from '@/lib/types';
import { PipelineCell } from './PipelineCell';

interface RowProps {
  client: Client;
  stages: Stage[];
  showLabels: boolean;
  continuousBar: boolean;
  onRowClick: (client: Client) => void;
  onCellClick: (e: React.MouseEvent<HTMLDivElement>, client: Client, stageIdx: number) => void;
}

export function PipelineRow({ client, stages, showLabels, continuousBar, onRowClick, onCellClick }: RowProps) {
  const av = avatarFor(client.name);
  const lcCls = client.last_contact >= 14 ? 'stale' : client.last_contact >= 7 ? 'warn' : '';
  const lcLabel =
    client.last_contact === 0
      ? 'today'
      : client.last_contact === 1
        ? '1d ago'
        : `${client.last_contact}d ago`;

  return (
    <div className="row" onClick={() => onRowClick(client)}>
      <div className="name-cell">
        <div
          className="avatar-sm"
          style={{
            background: `oklch(0.55 0.14 ${av.h})`,
            color: `oklch(0.98 0.03 ${av.h})`,
          }}
        >
          {av.init}
        </div>
        <div className="name-stack">
          <div className="name">{client.name}</div>
          <div className="name-sub">
            {client.price} · {client.agent}
          </div>
        </div>
      </div>

      <div className="meta-cell">
        <div className="address" title={client.address}>
          {client.address}
        </div>
        <div className={`last-contact ${lcCls}`}>{lcLabel}</div>
      </div>

      <div
        className="stages-row"
        style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}
      >
        {stages.map((s, idx) => (
          <PipelineCell
            key={s.key}
            client={client}
            stageIdx={idx}
            showLabels={showLabels}
            continuousBar={continuousBar}
            onClick={onCellClick}
          />
        ))}
      </div>
    </div>
  );
}
