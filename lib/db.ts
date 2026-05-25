import { Client } from './types';

export async function fetchClients(): Promise<Client[]> {
  try {
    const res = await fetch('/api/clients');
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function patchClient(id: string, patch: Partial<Client>): Promise<void> {
  try {
    await fetch(`/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  } catch {}
}
