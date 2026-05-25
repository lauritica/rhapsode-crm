'use client';

import { SortOption, TabOption } from '@/lib/types';

interface TabsRowProps {
  tab: TabOption;
  setTab: (t: TabOption) => void;
  sellerCount: number;
  buyerCount: number;
  sort: SortOption;
  setSort: (s: SortOption) => void;
}

export function TabsRow({ tab, setTab, sellerCount, buyerCount, sort, setSort }: TabsRowProps) {
  return (
    <div className="bar-row">
      <div className="tabs">
        <button
          className={'tab' + (tab === 'seller' ? ' active' : '')}
          onClick={() => setTab('seller')}
        >
          <span>Sellers</span>
          <span className="count mono">{sellerCount}</span>
        </button>
        <button
          className={'tab' + (tab === 'buyer' ? ' active' : '')}
          onClick={() => setTab('buyer')}
        >
          <span>Buyers</span>
          <span className="count mono">{buyerCount}</span>
        </button>
      </div>

      <div className="sort-group">
        <span className="sort-label">Sort</span>
        <button
          className={'chip' + (sort === 'stage' ? ' active' : '')}
          onClick={() => setSort('stage')}
        >
          By stage
        </button>
        <button
          className={'chip' + (sort === 'hottest' ? ' active' : '')}
          onClick={() => setSort('hottest')}
        >
          Hottest 🔥
        </button>
        <button
          className={'chip' + (sort === 'stalest' ? ' active' : '')}
          onClick={() => setSort('stalest')}
        >
          Stalest 🧊
        </button>
        <button
          className={'chip' + (sort === 'name' ? ' active' : '')}
          onClick={() => setSort('name')}
        >
          A–Z
        </button>
      </div>
    </div>
  );
}
