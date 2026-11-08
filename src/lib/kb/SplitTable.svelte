<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket } from '#lib/kb/split-4471';

  // `repo` is where the per-problem tickets live: owner/name on GitHub.
  let { ticket, repo }: { ticket: number; repo: string } = $props();

  const all = reports as Report[];
  const split = $derived(splitTicket(all, ticket, tenantOf, notes.oneDayMove));
  const tags = (t: Record<string, number>) =>
    Object.entries(t)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{all.length}</strong> rows in the export · <strong>{split.merged.length}</strong> unique reports merged
  into #{ticket} · <strong>{split.groups.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tagged as</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td class="tags">{tags(g.taggedAs)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td><a href="https://github.com/{repo}/issues/{g.issue}">{repo}#{g.issue}</a></td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.groups as g (g.problem)}
  {#if g.oneDay}
    <p class="note">{g.oneDay} of the <code>{g.problem}</code> reports read as a one-day move (desk-notes.json); counted under <code>{g.problem}</code> by tenant.</p>
  {/if}
{/each}

{#if split.unplaced.length}
  <p class="note">{split.unplaced.length} reports have no tenant on file and are not placed.</p>
{/if}

<style>
  .sum { font-size: 1.1rem; }
  .tags, .note { color: var(--muted); font-size: 0.85em; }
</style>
