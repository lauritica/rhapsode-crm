'use client';

import { useState } from 'react';
import { Client, Stage, avatarFor, STATUS_META } from '@/lib/types';
import { Icons } from './Icons';

interface DrawerProps {
  client: Client | null;
  stages: Stage[];
  isSeller?: boolean;
  onClose: () => void;
  onAdvance?: (stageIdx: number) => void;
}

interface TimelineEntry {
  d: string;
  e: React.ReactNode;
}

export function Drawer({ client, stages, isSeller = true, onClose, onAdvance }: DrawerProps) {
  const [noteMode, setNoteMode] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [extraNotes, setExtraNotes] = useState<TimelineEntry[]>([]);

  const av = client ? avatarFor(client.name) : { h: 0, init: '' };
  const stage = client ? stages[client.current_stage] : null;
  const sm = client ? STATUS_META[client.status] : null;

  const baseTimeline: TimelineEntry[] = client ? [
    { d: 'Today', e: <><b>Next step</b>: {client.next_action}</> },
    { d: 'Yesterday', e: <>Moved to <b>{stage?.label}</b> stage</> },
    { d: '3 days ago', e: <>Call · {client.agent} · <b>22 min</b></> },
    { d: '1 week ago', e: <>Email · sent market update</> },
    { d: '2 weeks ago', e: <>Added to pipeline · {client.source}</> },
  ] : [];

  const timeline = [...extraNotes, ...baseTimeline];

  const saveNote = () => {
    if (!noteText.trim()) return;
    setExtraNotes(prev => [{ d: 'Just now', e: <><b>Note</b>: {noteText.trim()}</> }, ...prev]);
    setNoteText('');
    setNoteMode(false);
  };

  const daysInStage = client?.entered_stage ?? null;

  return (
    <>
      <div className={`drawer-backdrop${client ? ' open' : ''}`} onClick={onClose} />
      <div className={`drawer${client ? ' open' : ''}`}>
        {client && (
          <>
            <div className="drawer-head">
              <div className="avatar" style={{ background: `oklch(0.55 0.14 ${av.h})`, color: `oklch(0.98 0.03 ${av.h})` }}>
                {av.init}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="drawer-title">{client.name}</div>
                <div className="drawer-sub">{client.address}</div>
              </div>
              <button className="close" onClick={onClose}>{Icons.x}</button>
            </div>

            <div className="drawer-body">
              <div className={`drawer-status ${client.status}`}>
                <span className="pulse" />
                {sm!.icon} {sm!.label} · {stage?.label}
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
                  <div className="k">{isSeller ? 'List price' : 'Budget'}</div>
                  <div className="v mono">{client.price || '—'}</div>
                </div>
                <div className="detail-item">
                  <div className="k">Days in stage</div>
                  <div className="v mono">{daysInStage != null ? `${daysInStage}d` : '—'}</div>
                </div>
                <div className="detail-item">
                  <div className="k">Agent</div>
                  <div className="v">{client.agent || '—'}</div>
                </div>
                <div className="detail-item">
                  <div className="k">Source</div>
                  <div className="v">{client.source || '—'}</div>
                </div>
              </div>

              <div className="section-title">Activity timeline</div>

              {noteMode && (
                <div style={{ marginBottom: 12 }}>
                  <textarea
                    autoFocus
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); } if (e.key === 'Escape') { setNoteMode(false); setNoteText(''); } }}
                    placeholder="Type a note… Enter to save, Esc to cancel"
                    style={{
                      width: '100%', boxSizing: 'border-box', background: 'var(--bg-2)',
                      border: '1px solid var(--accent)', borderRadius: 'var(--radius)',
                      color: 'var(--ink)', fontSize: 13, padding: '10px 12px',
                      resize: 'none', height: 80, fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <button onClick={saveNote} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save note</button>
                    <button onClick={() => { setNoteMode(false); setNoteText(''); }} className="btn" style={{ justifyContent: 'center' }}>Cancel</button>
                  </div>
                </div>
              )}

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
              <a className="btn" href={`tel:${client.phone ?? ''}`} style={{ textDecoration: 'none' }} onClick={e => { if (!client.phone) e.preventDefault(); }}>{Icons.phone}<span>Call</span></a>
              <a className="btn" href={`mailto:${client.email ?? ''}`} style={{ textDecoration: 'none' }} onClick={e => { if (!client.email) e.preventDefault(); }}>{Icons.mail}<span>Email</span></a>
              <button className="btn" onClick={() => setNoteMode(m => !m)}>{Icons.note}<span>Note</span></button>
              <button
                className="btn btn-primary"
                disabled={!onAdvance || client.current_stage >= stages.length - 1}
                onClick={() => onAdvance && onAdvance(Math.min(client.current_stage + 1, stages.length - 1))}
              >{Icons.check}<span>Advance</span></button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
