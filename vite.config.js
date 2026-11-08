// Minimal build for the kb export: .svx pages run through mdsvex and get the `runbook` layout
// from src/lib/layouts. adapter-static writes every page as plain HTML into build/.
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook } })],
      adapter: adapter({ strict: false }),
      prerender: { entries: ['*'], handleHttpError: 'warn' },
    }),
  ],
});
