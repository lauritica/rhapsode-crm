'use client';

import { useEffect, useRef } from 'react';
import { Client, Stage, ClientStatus } from '@/lib/types';
import { Icons } from './Icons';

export interface PopoverState {
  client: Client;
  stageIdx: number;
  x: number;
  y: number;
}

interface CellPopoverProps {
  pop: PopoverState | null;
  stages: Stage[];
  onClose: () => void;
  onSet: (status: ClientStatus) => void;
  onAdvance: (stageIdx: number) => void;
}

export function CellPopover({ pop, stages, onClose, onSet, onAdvance }: CellPopoverProps) {
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pop) return;
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && popRef.current.contains(e.target as Node)) return;
      onClose();
    };
    const timer = setTimeout(() => document.addEventListener('click', onDoc), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', onDoc);
    };
  }, [pop, onClose]);

  if (!pop) return null;

  const stage = stages[pop.stageIdx];
  const pad = 8;
  const x = typeof window !== 'undefined'
    ? Math.min(pop.x, window.innerWidth - 260 - pad)
    : pop.x;
  const style = { left: x, top: pop.y + pad };

  return (
    <div className="popover-wrap" style={style} ref={popRef}>
      <div className="popover-title">
        Log for <b>{pop.client.name}</b>
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginBottom: 10 }}>
        Stage: <span style={{ color: 'var(--ink-dim)' }}>{stage?.label}</span>
      </div>
      <div className="status-options">
        <button className="status-opt active-o" onClick={() => onSet('active')}>
          <span className="swatch" style={{ background: 'var(--active-bg)' }} />
          <span className="k">On Fire 🔥</span>
          <span className="hint">1</span>
        </button>
        <button className="status-opt warming-o" onClick={() => onSet('warming')}>
          <span className="swatch" style={{ background: 'var(--warming-bg)' }} />
          <span className="k">Warming 🌤</span>
          <span className="hint">2</span>
        </button>
        <button className="status-opt cold-o" onClick={() => onSet('cold')}>
          <span className="swatch" style={{ background: 'var(--cold-bg)' }} />
          <span className="k">Cold 🧊</span>
          <span className="hint">3</span>
        </button>
      </div>
      <div className="popover-sep" />
      <button className="popover-act" onClick={() => onAdvance(pop.stageIdx)}>
        {Icons.check}
        <span>Move to this stage</span>
      </button>
      <button className="popover-act">
        {Icons.phone}
        <span>Log call</span>
      </button>
      <button className="popover-act">
        {Icons.note}
        <span>Add note</span>
      </button>
    </div>
  );
}
