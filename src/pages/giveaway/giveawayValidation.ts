export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DOMAIN_FIXES: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gmal.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com", "gmail.net": "gmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com", "yhoo.com": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com", "hotmal.com": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.co": "outlook.com", "outlook.con": "outlook.com", "outloo.com": "outlook.com",
  "iclod.com": "icloud.com", "icloud.co": "icloud.com", "icloud.con": "icloud.com", "icoud.com": "icloud.com",
  "aol.co": "aol.com", "aol.con": "aol.com",
};

/** Returns a corrected email if the domain looks like a common typo. */
export function suggestEmail(email: string): string | null {
  const at = email.trim().lastIndexOf("@");
  if (at < 1) return null;
  const local = email.trim().slice(0, at);
  const domain = email.trim().slice(at + 1).toLowerCase();
  let fix = DOMAIN_FIXES[domain];
  if (!fix && /\.(con|cmo|cm|comm|ocm)$/.test(domain)) fix = domain.replace(/\.[a-z]+$/, ".com");
  if (!fix && /\.(nte|ne|nett)$/.test(domain)) fix = domain.replace(/\.[a-z]+$/, ".net");
  return fix && fix !== domain ? `${local}@${fix}` : null;
}

export function phoneDigits(v: string): string {
  let d = v.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d;
}

export function formatPhone(v: string): string {
  const d = phoneDigits(v).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
