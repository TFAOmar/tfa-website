// Shared: builds and sends the LDA notification email (with PDF summary) for a deed service request.
import jsPDF from "https://esm.sh/jspdf@2.5.1?bundle";
// deno-lint-ignore no-explicit-any
type Sb = any;

// LDA inbox that receives every paid / notary-only request.
export const LDA_EMAIL = "leads@tfainsuranceadvisors.com";

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const LABELS: Record<string, string> = {
  grantorName: "Current owner / grantor – full legal name",
  grantorDeedName: "Name exactly as shown on current deed",
  granteeName: "New owner / grantee – full legal name",
  titleHeld: "How title will be held",
  address: "Property address",
  cityStateZip: "City / State / ZIP",
  apn: "APN",
  recordingDate: "Existing deed recording date",
  instrumentNo: "Document / instrument no.",
  county: "County",
  transferType: "Transfer type",
  transferOther: "Transfer type (other)",
  consideration: "Consideration / purchase price",
  granteeMailing: "Grantee mailing address",
  returnAddress: "Return address for recorded document",
  otherOwners: "Other owners / interest holders",
  entityHeld: "Held in trust, LLC or entity?",
  entityDetails: "Entity details",
  primaryResidence: "Primary residence (homestead)",
};

function rows(obj: Record<string, unknown>) {
  return Object.entries(obj)
    .filter(([, v]) => v !== "" && v !== null && v !== undefined)
    .map(([k, v]) => [LABELS[k] ?? k, typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)] as [string, string]);
}

export async function notifyLda(sb: Sb, id: string) {
  const { data: r, error } = await sb.from("deed_service_requests").select("*").eq("id", id).single();
  if (error || !r) throw new Error("Request not found");
  if (r.notified_at) return { alreadySent: true };

  const RESEND = Deno.env.get("RESEND_API_KEY");
  if (!RESEND) throw new Error("RESEND_API_KEY missing");

  const fd = r.form_data ?? {};
  const properties: Record<string, unknown>[] = fd.properties ?? [];
  const notary = fd.notary ?? null;
  const ref = id.slice(0, 8).toUpperCase();

  // Signed links (7 days) for every uploaded document
  const docs: { path: string; name: string; kind: string }[] = r.documents ?? [];
  const links: { name: string; kind: string; url: string }[] = [];
  for (const d of docs) {
    const { data } = await sb.storage.from("deed-documents").createSignedUrl(d.path, 60 * 60 * 24 * 7);
    if (data?.signedUrl) links.push({ name: d.name, kind: d.kind, url: data.signedUrl });
  }

  const contact: [string, string][] = [
    ["Submitted by", r.submitter_role === "agent" ? "Agent" : "Client"],
    ["Agent", [r.agent_name, r.agent_email, r.agent_phone].filter(Boolean).join(" · ") || "—"],
    ["Client", [r.client_name, r.client_email, r.client_phone].filter(Boolean).join(" · ") || "—"],
    ["Services", `Deeds: ${r.deed_count} · Homesteads: ${r.homestead_count} · Notary: ${r.notary_requested ? "Yes" : "No"}`],
    ["Amount paid", `$${(r.amount_cents / 100).toFixed(2)}`],
    ["SMS consent", r.sms_consent ? "Yes" : "No"],
  ];

  const table = (title: string, data: [string, string][]) =>
    `<h3 style="color:#1E3A5F;margin:20px 0 8px">${esc(title)}</h3><table style="border-collapse:collapse;width:100%">${data
      .map(([k, v]) => `<tr><td style="padding:6px;border:1px solid #ddd;background:#f7f7f7;width:40%">${esc(k)}</td><td style="padding:6px;border:1px solid #ddd">${esc(v)}</td></tr>`)
      .join("")}</table>`;

  let html = `<div style="font-family:Arial,sans-serif;max-width:680px"><h2 style="color:#1E3A5F">New Deed / Homestead / Notary Request #${ref}</h2>`;
  html += table("Request & contact", contact);
  properties.forEach((p, i) => (html += table(`Property ${i + 1}`, rows(p))));
  if (notary) html += table("Notary scheduling", rows(notary as Record<string, unknown>));
  if (fd.notes) html += table("Notes", [["Notes", String(fd.notes)]]);
  html += `<h3 style="color:#1E3A5F">Documents (links valid 7 days)</h3><ul>${
    links.map((l) => `<li>${esc(l.kind)}: <a href="${esc(l.url)}">${esc(l.name)}</a></li>`).join("") || "<li>None uploaded</li>"
  }</ul><p style="font-size:12px;color:#666">Signed by: ${esc(fd.signature)} · Request ID ${esc(id)}</p></div>`;

  // PDF summary
  const pdf = new jsPDF();
  let y = 15;
  const line = (t: string, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    for (const l of pdf.splitTextToSize(t, 180)) {
      if (y > 280) { pdf.addPage(); y = 15; }
      pdf.text(l, 15, y); y += 6;
    }
  };
  pdf.setFontSize(14); line(`Deed / Homestead / Notary Request #${ref}`, true); pdf.setFontSize(10); y += 2;
  contact.forEach(([k, v]) => line(`${k}: ${v}`));
  properties.forEach((p, i) => { y += 3; line(`Property ${i + 1}`, true); rows(p).forEach(([k, v]) => line(`${k}: ${v}`)); });
  if (notary) { y += 3; line("Notary scheduling", true); rows(notary as Record<string, unknown>).forEach(([k, v]) => line(`${k}: ${v}`)); }
  if (fd.notes) { y += 3; line("Notes", true); line(String(fd.notes)); }
  y += 3; line("Documents", true); docs.forEach((d) => line(`${d.kind}: ${d.name}`));
  y += 3; line(`Signed by: ${fd.signature ?? ""}`);
  const pdfB64 = pdf.output("datauristring").split(",")[1];

  const cc = r.agent_email && r.agent_email !== LDA_EMAIL ? [r.agent_email] : undefined;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND}` },
    body: JSON.stringify({
      from: "TFA Deed Services <noreply@tfainsuranceadvisors.com>",
      to: [LDA_EMAIL],
      cc,
      subject: `Deed Services Request #${ref} – ${r.client_name ?? "Client"}`,
      html,
      attachments: [{ filename: `deed-request-${ref}.pdf`, content: pdfB64 }],
    }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  await sb.from("deed_service_requests").update({ notified_at: new Date().toISOString() }).eq("id", id);
  return { sent: true };
}
