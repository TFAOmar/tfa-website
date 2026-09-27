export type GiveawayEntry = Record<string, string> & { entry_id: string };

const key = (slug: string) => `giveaway-queue:${slug}`;

export function readQueue(slug: string): GiveawayEntry[] {
  try {
    const raw = localStorage.getItem(key(slug));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(slug: string, q: GiveawayEntry[]) {
  try {
    localStorage.setItem(key(slug), JSON.stringify(q));
  } catch {
    /* storage full/blocked — nothing more we can do */
  }
}

export function enqueue(slug: string, entry: GiveawayEntry) {
  const q = readQueue(slug);
  if (!q.some((e) => e.entry_id === entry.entry_id)) q.push(entry);
  writeQueue(slug, q);
}

function removeEntry(slug: string, id: string) {
  writeQueue(slug, readQueue(slug).filter((e) => e.entry_id !== id));
}

/** CORS-simple POST. Only a readable 2xx counts as delivered. */
export async function sendEntry(url: string, entry: GiveawayEntry): Promise<boolean> {
  if (!url) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(entry),
      signal: ctrl.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

let flushing = false;
/** Try every queued entry; remove only after 2xx. Ignores endsAt on purpose. */
export async function flushQueue(slug: string, url: string): Promise<number> {
  if (flushing) return readQueue(slug).length;
  flushing = true;
  try {
    for (const entry of readQueue(slug)) {
      if (await sendEntry(url, entry)) removeEntry(slug, entry.entry_id);
    }
  } finally {
    flushing = false;
  }
  return readQueue(slug).length;
}
