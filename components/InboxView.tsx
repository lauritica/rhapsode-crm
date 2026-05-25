'use client';

import { useState } from 'react';
import { avatarFor } from '@/lib/types';

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  tag?: string;
}

const MESSAGES: Message[] = [
  { id: '1', from: 'Liz Robertson', subject: 'Update on 345 E Enon Rd?', preview: 'Hi Laura! Any update on the offer? Getting a little anxious over here 😅 Let me know when you hear back from the seller.', time: '9:14 AM', read: false, tag: 'Under Contract' },
  { id: '2', from: 'Rubén Darío Intriago', subject: 'Available Thursday afternoon', preview: "I'm free Thursday after 1pm if you have anything to show. Budget still $225K, Huber or Dayton area. Let me know!", time: '8:47 AM', read: false, tag: 'Showing' },
  { id: '3', from: 'Wayne & Yuko Mcghie', subject: 'Shagbark feedback', preview: "We liked the house but it's too far from the kids school. Can you look for something closer to Beavercreek? Also still waiting on our house to sell before we commit.", time: 'Yesterday', read: false },
  { id: '4', from: 'Jacqueline Voss', subject: 'Saw a horse farm in Athens County', preview: 'Found a listing — 47 acres, barn, $980K. Is that too far out? I know we talked SE Ohio but this one looks incredible. Sending you the link.', time: 'Yesterday', read: false, tag: 'Hot lead' },
  { id: '5', from: 'Sarah & Zlatomir', subject: 'Confirming April 11 meeting', preview: 'Just confirming we are still on for Friday. We have a lot of questions about the YS market. Zlat is also curious about the financing options you mentioned.', time: 'Mon', read: false },
  { id: '6', from: 'Brian', subject: 'Reconsidering Yellow Springs', preview: 'Hey Laura — been thinking more seriously about making the move. Centerville just feels too suburban. Can we do a strategy call this week?', time: 'Mon', read: false },
  { id: '7', from: 'MLS Alert', subject: '3 new listings match your buyer searches', preview: 'New listings: 812 Linden Ave Dayton $219K · 4401 Grafton Dr Beavercreek $248K · 9 Whiteman St Yellow Springs $389K', time: 'Sun', read: true, tag: 'MLS' },
];

export function InboxView() {
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [selected, setSelected] = useState<Message | null>(null);

  const unread = messages.filter(m => !m.read).length;

  const open = (msg: Message) => {
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    setSelected(msg);
  };

  return (
    <main className="main">
      <div className="topbar">
        <div className="title-block">
          <div className="crumb"><span>Workspace</span><i className="crumb-dot" /><span>Inbox</span></div>
          <h1>Inbox {unread > 0 && <span style={{ fontSize: 14, fontFamily: 'JetBrains Mono', color: 'var(--accent-strong)', fontStyle: 'normal' }}>{unread}</span>}</h1>
        </div>
        <div className="topbar-spacer" />
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>laura@theunicornrealtors.com · mock</div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: selected ? 340 : '100%', borderRight: selected ? '1px solid var(--line-soft)' : 'none', overflowY: 'auto', flexShrink: 0 }}>
          {messages.map(msg => {
            const av = avatarFor(msg.from);
            return (
              <div
                key={msg.id}
                onClick={() => open(msg)}
                style={{
                  display: 'flex', gap: 12, padding: '14px 20px', cursor: 'pointer',
                  borderBottom: '1px solid var(--line-soft)',
                  background: selected?.id === msg.id ? 'var(--bg-2)' : msg.read ? 'transparent' : 'var(--bg-1)',
                  transition: 'background 0.1s',
                }}
              >
                <div className="avatar-sm" style={{ background: `oklch(0.55 0.14 ${av.h})`, color: `oklch(0.98 0.03 ${av.h})`, flexShrink: 0 }}>{av.init}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: msg.read ? 400 : 600, fontSize: 13 }}>{msg.from}</span>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', flexShrink: 0, marginLeft: 8 }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: msg.read ? 'var(--ink-mute)' : 'var(--ink)', marginBottom: 3 }}>{msg.subject}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.preview}</div>
                  {msg.tag && <div style={{ display: 'inline-block', marginTop: 5, fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--ink-mute)' }}>{msg.tag}</div>}
                </div>
                {!msg.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-strong)', flexShrink: 0, marginTop: 6 }} />}
              </div>
            );
          })}
        </div>

        {selected && (
          <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer', fontSize: 12, marginBottom: 20, padding: 0 }}>← Back</button>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{selected.subject}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginBottom: 24 }}>From {selected.from} · {selected.time}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>{selected.preview}</div>
          </div>
        )}
      </div>
    </main>
  );
}
