'use client';

import { Client, STATUS_META } from '@/lib/types';

interface CellProps {
  client: Client;
  stageIdx: number;
  showLabels: boolean;
  continuousBar: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>, client: Client, stageIdx: number) => void;
}

export function PipelineCell({ client, stageIdx, showLabels, continuousBar, onClick }: CellProps) {
  const curr = client.current_stage;
  const status = client.status;

  let cls = 'cell bar';
  let filled = false;

  if (continuousBar) {
    if (stageIdx < curr) {
      filled = true;
      cls += ' ' + status + ' past';
    } else if (stageIdx === curr) {
      filled = true;
      cls += ' ' + status + ' current';
    } else {
      cls += ' empty';
    }

    if (filled) {
      const prevFilled = stageIdx > 0 && stageIdx - 1 <= curr;
      const nextFilled = stageIdx < curr;
      if (!prevFilled) cls += ' start';
      if (!nextFilled) cls += ' end';
    }
  } else {
    if (stageIdx === curr) {
      filled = true;
      cls += ' ' + status + ' current start end';
    } else {
      cls += ' empty';
    }
  }

  const isCurrent = stageIdx === curr;
  const daysInStage = client.entered_stage || 0;
  const icon = STATUS_META[status].icon;

  return (
    <div
      className={cls}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, client, stageIdx);
      }}
    >
      <div className="cell-inner">
        {filled && showLabels && isCurrent && (
          <>
            <span className="cell-ico">{icon}</span>
            <span className="mono">{daysInStage}d</span>
          </>
        )}
        {filled && showLabels && !isCurrent && !continuousBar && (
          <span className="cell-ico">{icon}</span>
        )}
      </div>
    </div>
  );
}
