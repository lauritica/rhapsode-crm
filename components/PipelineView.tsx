'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Client, ClientStatus, SELLER_STAGES, BUYER_STAGES, TabOption, SortOption } from '@/lib/types';
import { SELLERS, BUYERS } from '@/lib/data';
import { fetchClients, patchClient as saveClient } from '@/lib/db';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { KPIs } from './KPIs';
import { TabsRow } from './TabsRow';
import { Pipeline } from './Pipeline';
import { Drawer } from './Drawer';
import { CellPopover, PopoverState } from './CellPopover';
import { DashboardView } from './DashboardView';
import { InboxView } from './InboxView';

function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
}

export function PipelineView() {
  const [view, setView] = useLocalStorage<string>('rhap.view', 'dashboard');
  const [tab, setTab] = useLocalStorage<TabOption>('rhap.tab', 'seller');
  const [sort, setSort] = useLocalStorage<SortOption>('rhap.sort', 'stage');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Client | null>(null);
  const [pop, setPop] = useState<PopoverState | null>(null);
  const [sellers, setSellers] = useState<Client[]>(SELLERS);
  const [buyers, setBuyers] = useState<Client[]>(BUYERS);

  useEffect(() => {
    fetchClients().then(data => {
      if (data.length > 0) {
        setSellers(data.filter(c => c.type === 'seller'));
        setBuyers(data.filter(c => c.type === 'buyer'));
      }
    });
  }, []);

  const stages = tab === 'seller' ? SELLER_STAGES : BUYER_STAGES;
  const baseList = tab === 'seller' ? sellers : buyers;

  const clients = useMemo(() => {
    let arr = baseList;
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }
    const statusRank: Record<string, number> = { active: 0, warming: 1, cold: 2 };
    const copy = [...arr];
    if (sort === 'stage')
      copy.sort(
        (a, b) =>
          b.current_stage - a.current_stage ||
          statusRank[a.status] - statusRank[b.status]
      );
    if (sort === 'hottest')
      copy.sort(
        (a, b) =>
          statusRank[a.status] - statusRank[b.status] ||
          a.last_contact - b.last_contact
      );
    if (sort === 'stalest') copy.sort((a, b) => b.last_contact - a.last_contact);
    if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [baseList, query, sort]);

  const onRowClick = useCallback((c: Client) => setSelected(c), []);

  const onCellClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, client: Client, stageIdx: number) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPop({
        client,
        stageIdx,
        x: rect.left + rect.width / 2 - 130,
        y: rect.bottom,
      });
    },
    []
  );

  const patchClient = useCallback(
    async (patch: Partial<Client>) => {
      if (!pop) return;
      const clientId = pop.client.id;
      const clientType = pop.client.type;

      // Optimistic update
      const upd = (arr: Client[]) =>
        arr.map((c) => (c.id === clientId ? { ...c, ...patch } : c));
      if (clientType === 'seller') setSellers(upd);
      else setBuyers(upd);

      saveClient(clientId, patch);
    },
    [pop]
  );

  const setStatus = useCallback(
    (status: ClientStatus) => {
      patchClient({ status });
      setPop(null);
    },
    [patchClient]
  );

  const advanceTo = useCallback(
    (idx: number) => {
      patchClient({ current_stage: idx, entered_stage: 0 });
      setPop(null);
    },
    [patchClient]
  );

  // Keyboard close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setPop(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app">
      <Sidebar activeView={view} onNav={setView} />
      {view === 'clients' ? (
        <DashboardView sellers={sellers} buyers={buyers} />
      ) : ['pipeline', 'inbox', 'calendar', 'reports', 'automations'].includes(view) ? (
        <main className="main">
          <div className="topbar">
            <div className="title-block">
              <div className="crumb"><span>Workspace</span><i className="crumb-dot" /><span>{view.charAt(0).toUpperCase() + view.slice(1)}</span></div>
              <h1>{view.charAt(0).toUpperCase() + view.slice(1)}</h1>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-mute)', fontSize: 13 }}>
            Coming soon
          </div>
        </main>
      ) : (
        <main className="main">
          <Topbar query={query} setQuery={setQuery} />
          <KPIs sellers={sellers} buyers={buyers} />
          <TabsRow
            tab={tab}
            setTab={setTab}
            sellerCount={sellers.length}
            buyerCount={buyers.length}
            sort={sort}
            setSort={setSort}
          />
          <Pipeline
            stages={stages}
            clients={clients}
            showLabels={true}
            continuousBar={true}
            isSeller={tab === 'seller'}
            onRowClick={onRowClick}
            onCellClick={onCellClick}
          />
        </main>
      )}
      <Drawer
        client={selected}
        stages={stages}
        isSeller={tab === 'seller'}
        onClose={() => setSelected(null)}
        onSave={(patch) => {
          if (!selected) return;
          const upd = (arr: Client[]) => arr.map(c => c.id === selected.id ? { ...c, ...patch } : c);
          if (selected.type === 'seller') setSellers(upd); else setBuyers(upd);
          setSelected(prev => prev ? { ...prev, ...patch } : null);
        }}
        onAdvance={(idx) => {
          if (!selected) return;
          const upd = (arr: Client[]) => arr.map(c => c.id === selected.id ? { ...c, current_stage: idx, entered_stage: 0 } : c);
          if (selected.type === 'seller') setSellers(upd); else setBuyers(upd);
          setSelected(prev => prev ? { ...prev, current_stage: idx, entered_stage: 0 } : null);
          saveClient(selected.id, { current_stage: idx, entered_stage: 0 });
        }}
      />
      {pop && (
        <CellPopover
          pop={pop}
          stages={stages}
          onClose={() => setPop(null)}
          onSet={setStatus}
          onAdvance={advanceTo}
        />
      )}
    </div>
  );
}
