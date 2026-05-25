'use client';

import { Icons } from './Icons';

interface TopbarProps {
  query: string;
  setQuery: (q: string) => void;
}

export function Topbar({ query, setQuery }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="title-block">
        <div className="crumb">
          <span>Workspace</span>
          <i className="crumb-dot" />
          <span>Dashboard</span>
        </div>
        <h1>Dashboard</h1>
      </div>

      <div className="topbar-spacer" />

      <div className="search">
        {Icons.search}
        <input
          placeholder="Search clients, addresses…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <kbd>⌘K</kbd>
      </div>

      <button className="btn">
        {Icons.filter}
        <span>Filter</span>
      </button>

      <button className="btn btn-primary">
        {Icons.plus}
        <span>New Client</span>
      </button>
    </div>
  );
}
