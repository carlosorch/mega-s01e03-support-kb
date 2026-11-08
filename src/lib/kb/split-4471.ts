// Splits the reports merged into #4471 by what actually went wrong, so each problem gets its own
// ticket and count. Builds on causes.ts (tenant + channel decide parser vs hint) and adds the one
// thing causes.ts only footnotes: reports where the date moved by one day, not day <-> month.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day';

export type ProblemGroup = {
  problem: Problem;
  issue: number | null;
  reports: Report[];
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  // How intake tagged these reports: tag -> count. Intake guesses from the browser, so it drifts.
  taggedAs: Record<string, number>;
};

// The GitHub issue that tracks each problem in this repo.
export const ISSUE_OF: Record<Problem, number> = { parser: 1, hint: 2, 'one-day': 3 };

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem | null {
  if (oneDayMove.includes(r.id)) return 'one-day';
  return causeOf(r, t);
}

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: Report[]; groups: ProblemGroup[]; unplaced: Report[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  const unplaced: Report[] = [];
  for (const r of merged) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    if (p) by.set(p, [...(by.get(p) ?? []), r]);
    else unplaced.push(r);
  }
  const groups = [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        issue: ISSUE_OF[problem],
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        taggedAs: rs.reduce<Record<string, number>>(
          (n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }),
          {},
        ),
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { merged, groups, unplaced };
}
