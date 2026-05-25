export type ClientStatus = 'active' | 'warming' | 'cold';
export type ClientType = 'seller' | 'buyer';

export interface Client {
  id: string;
  name: string;
  address: string;
  price: string;
  last_contact: number; // days since last contact
  status: ClientStatus;
  current_stage: number; // 0-indexed into stages array
  next_action: string;
  agent: string;
  source: string;
  entered_stage: number; // days in current stage
  type: ClientType;
  created_at?: string;
  updated_at?: string;
}

export interface Stage {
  key: string;
  label: string;
}

export const SELLER_STAGES: Stage[] = [
  { key: 'lead', label: 'Lead' },
  { key: 'walkthrough', label: 'Walkthrough' },
  { key: 'comps', label: 'Comps / Pricing' },
  { key: 'reno', label: 'Reno Prep' },
  { key: 'photos', label: 'Photos' },
  { key: 'listed', label: 'Listed' },
  { key: 'contract', label: 'Under Contract' },
  { key: 'closed', label: 'Closed' },
];

export const BUYER_STAGES: Stage[] = [
  { key: 'lead', label: 'Lead' },
  { key: 'consult', label: 'Consultation' },
  { key: 'preapp', label: 'Pre-Approved' },
  { key: 'showing', label: 'Actively Showing' },
  { key: 'offer', label: 'Offer Made' },
  { key: 'contract', label: 'Under Contract' },
  { key: 'closed', label: 'Closed' },
];

export const AVATAR_HUES = [20, 48, 95, 142, 175, 210, 255, 298, 335];

export function avatarFor(name: string): { h: number; init: string } {
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const h = AVATAR_HUES[sum % AVATAR_HUES.length];
  const init = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return { h, init };
}

export const STATUS_META: Record<ClientStatus, { label: string; icon: string }> = {
  active: { label: 'On Fire', icon: '🔥' },
  warming: { label: 'Warming', icon: '🌤' },
  cold: { label: 'Cold', icon: '🧊' },
};

export type SortOption = 'stage' | 'hottest' | 'stalest' | 'name';
export type TabOption = 'seller' | 'buyer';
