// Applies the kb's own causes.ts logic to the 4471 export, to compare with what the page claims.
import fs from 'node:fs';
const base = process.argv[2];
// Fails with the file name, so a broken export is easy to spot.
const readJson = (p) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.error(`cannot read ${p}: ${e.message}`); process.exit(1); }
};
const reports = readJson(`${base}/src/lib/data/reports-4471.json`);
const tenants = Object.fromEntries(fs.readdirSync(`${base}/src/lib/data/tenants`).map(f => { const t = readJson(`${base}/src/lib/data/tenants/${f}`); return [t.handle, t]; }));
const dayFirst = (l) => { const o = new Intl.DateTimeFormat(l,{year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(Date.UTC(2026,0,2,12))).map(p=>p.type); return o.indexOf('day') < o.indexOf('month'); };
const HINT = {'booking-v2':'DD/MM/YYYY','booking-v3':'MM/DD/YYYY'};
const causeOf = (r,t) => (!t || !dayFirst(t.locale)) ? null : (r.channel==='form' && HINT[t.form].startsWith('MM') ? 'hint' : 'parser');
const uniq = [...new Map(reports.map(r=>[r.id,r])).values()];
for (const [h,t] of Object.entries(tenants)) console.log(h, t.locale, t.form, 'dayFirst', dayFirst(t.locale));
const groups = {};
for (const r of uniq) { const c = causeOf(r, tenants[r.tenant]) ?? 'unplaced'; (groups[c] ??= []).push(r); }
for (const [c, rs] of Object.entries(groups)) {
  const tags = {}; rs.forEach(r => tags[r.meta.intakeTag] = (tags[r.meta.intakeTag]??0)+1);
  const days = rs.map(r=>r.receivedAt.slice(0,10)).sort();
  console.log(c, rs.length, JSON.stringify(tags), 'tenants', new Set(rs.map(r=>r.tenant)).size, days[0], days.at(-1));
}
fs.writeFileSync(process.argv[3], JSON.stringify(uniq.map(r=>({...r, cause: causeOf(r, tenants[r.tenant]) ?? 'unplaced'})), null, 1));
