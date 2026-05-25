'use client';

import { Client, Stage } from '@/lib/types';
import { PipelineRow } from './PipelineRow';

interface PipelineProps {
  stages: Stage[];
  clients: Client[];
  showLabels: boolean;
  continuousBar: boolean;
  isSeller?: boolean;
  onRowClick: (client: Client) => void;
  onCellClick: (e: React.MouseEvent<HTMLDivElement>, client: Client, stageIdx: number) => void;
}

export function Pipeline({
  stages,
  clients,
  showLabels,
  continuousBar,
  isSeller = true,
  onRowClick,
  onCellClick,
}: PipelineProps) {
  return (
    <div className="pipeline-wrap">
      <div className="pipeline-header">
        <div className="cell-h">Client</div>
        <div className="cell-h" style={{ justifyContent: 'space-between' }}>
          <span>
            {isSeller ? 'Property · Last Contact' : 'Criteria · Last Contact'}
          </span>
        </div>
        <div
          className="stages"
          style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}
        >
          {stages.map((s, i) => (
            <div className="stage-h" key={s.key}>
              <div className="idx">{String(i + 1).padStart(2, '0')}</div>
              <div>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {clients.map((c) => (
          <PipelineRow
            key={c.id}
            client={c}
            stages={stages}
            showLabels={showLabels}
            continuousBar={continuousBar}
            onRowClick={onRowClick}
            onCellClick={onCellClick}
          />
        ))}
      </div>

      <div className="pipeline-footer">
        <div className="legend">
          <span className="legend-item">
            <span className="legend-swatch active" />
            <span className="legend-label">On Fire 🔥</span>
          </span>
          <span className="legend-item">
            <span className="legend-swatch warming" />
            <span className="legend-label">Warming 🌤</span>
          </span>
          <span className="legend-item">
            <span className="legend-swatch cold" />
            <span className="legend-label">Cold 🧊</span>
          </span>
          <span className="legend-item">
            <span className="legend-swatch empty" />
            <span className="legend-label">Not yet</span>
          </span>
        </div>
        <div className="mono" style={{ fontSize: 11 }}>
          Showing {clients.length} · Click row for details · Click cell to update
        </div>
      </div>
    </div>
  );
}
