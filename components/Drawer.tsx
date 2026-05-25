'use client';

import { useState, useEffect } from 'react';
import { Client, Stage, avatarFor, STATUS_META } from '@/lib/types';
import { Icons } from './Icons';
import { patchClient } from '@/lib/db';

interface DrawerProps {
  client: Client | null;
  stages: Stage[];
  isSeller?: boolean;
  onClose: () => void;
  onAdvance?: (stageIdx: number) => void;
  onSave?: (patch: Partial<Client>) => void;
}

interface TimelineEntry {
  d: string;
  e: React.ReactNode;
}

type EditFields = {
  name: string;
  address: string;
  price: string;
  source: string;
  agent: string;
  next_action: string;
  phone: string;
  email: string;
};

export function Drawer({ client, stages, isSeller = true, onClose, onAdvance, onSave }: DrawerProps) {
  const [noteMode, setNoteMode] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [extraNotes, setExtraNotes] = useState<TimelineEntry[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState<EditFields>({ name: '', address: '', price: '', source: '', agent: '', next_action: '', phone: '', email: '' });

  useEffect(() => {
    if (client) {
      setEditFields({
        name: client.name ?? '',
        address: client.address ?? '',
        price: client.price ?? '',
        source: client.source ?? '',
        agent: client.agent ?? '',
        next_action: client.next_action ?? '',
        phone: client.phone ?? '',
        email: client.email ?? '',
      });
      setEditMode(false);
      setNoteMode(false);
      setExtraNotes([]);
    }
  }, [client?.id]);

  const av = client ? avatarFor(editMode ? editFields.name || client.name : client.name) : { h: 0, init: '' };
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

  const saveEdit = async () => {
    if (!client) return;
    const patch: Partial<Client> = {
      name: editFields.name,
      address: editFields.address,
      price: editFields.price,
      source: editFields.source,
      agent: editFields.agent,
      next_action: editFields.next_action,
      phone: editFields.phone || undefined,
      email: editFields.email || undefined,
    };
    onSave?.(patch);
    patchClient(client.id, patch);
    setEditMode(false);
  };

  const field = (label: string, key: keyof EditFields, mono = false) => (
    <div className="detail-item" style={{ gridColumn: key === 'next_action' || key === 'address' ? 'span 2' : undefined }}>
      <div className="k">{label}</div>
      {editMode ? (
        <input
          value={editFields[key]}
          onChange={e => setEditFields(f => ({ ...f, [key]: e.target.value }))}
          style={{
            background: 'var(--bg-2)', border: '1px solid var(--accent)', borderRadius: 4,
            color: 'var(--ink)', fontSize: 12, padding: '4px 8px', width: '100%',
            fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', outline: 'none', boxSizing: 'border-box',
          }}
        />
      ) : (
        <div className={`v${mono ? ' mono' : ''}`}>{(client as any)?.[key] || '—'}</div>
      )}
    </div>
  );

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
                {editMode ? (
                  <input
                    value={editFields.name}
                    onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                    style={{ background: 'var(--bg-2)', border: '1px solid var(--accent)', borderRadius: 4, color: 'var(--ink)', fontSize: 15, fontWeight: 600, padding: '4px 8px', width: '100%', outline: 'none', boxSizing: 'border-box' }}
                  />
                ) : (
                  <div className="drawer-title">{client.name}</div>
                )}
                <div className="drawer-sub">{editMode ? editFields.address : client.address}</div>
              </div>
              <button
                className="btn"
                style={{ padding: '4px 10px', fontSize: 11, marginRight: 4 }}
                onClick={() => editMode ? saveEdit() : setEditMode(true)}
              >
                {editMode ? 'Save' : 'Edit'}
              </button>
              {editMode && (
                <button className="btn" style={{ padding: '4px 10px', fontSize: 11, marginRight: 4 }} onClick={() => setEditMode(false)}>Cancel</button>
              )}
              <button className="close" onClick={onClose}>{Icons.x}</button>
            </div>

            <div className="drawer-body">
              <div className={`drawer-status ${client.status}`}>
                <span className="pulse" />
                {sm!.icon} {sm!.label} · {stage?.label}
              </div>

              {!editMode && (
                <div className="next-action">
                  <div className="icon">{Icons.bolt}</div>
                  <div>
                    <div className="label">Next action</div>
                    <div className="text">{client.next_action}</div>
                  </div>
                  <div className="due">GO →</div>
                </div>
              )}

              <div className="section-title">Details</div>
              <div className="detail-grid">
                {field(isSeller ? 'List price' : 'Budget', 'price', true)}
                <div className="detail-item">
                  <div className="k">Days in stage</div>
                  <div className="v mono">{daysInStage != null ? `${daysInStage}d` : '—'}</div>
                </div>
                {field('Agent', 'agent')}
                {field('Source', 'source')}
                {field('Next action', 'next_action')}
                {editMode && field('Phone', 'phone')}
                {editMode && field('Email', 'email')}
              </div>

              {!editMode && (
                <>
                  <div className="section-title">Activity timeline</div>
                  {noteMode && (
                    <div style={{ marginBottom: 12 }}>
                      <textarea
                        autoFocus
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); } if (e.key === 'Escape') { setNoteMode(false); setNoteText(''); } }}
                        placeholder="Type a note… Enter to save, Esc to cancel"
                        style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-2)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', color: 'var(--ink)', fontSize: 13, padding: '10px 12px', resize: 'none', height: 80, fontFamily: 'inherit', outline: 'none' }}
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
                </>
              )}
            </div>

            <div className="drawer-actions">
              <a className="btn" href={`tel:${client.phone ?? ''}`} style={{ textDecoration: 'none' }} onClick={e => { if (!client.phone) e.preventDefault(); }}>{Icons.phone}<span>Call</span></a>
              <a className="btn" href={`mailto:${client.email ?? ''}`} style={{ textDecoration: 'none' }} onClick={e => { if (!client.email) e.preventDefault(); }}>{Icons.mail}<span>Email</span></a>
              <button className="btn" onClick={() => { setEditMode(false); setNoteMode(m => !m); }}>{Icons.note}<span>Note</span></button>
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
