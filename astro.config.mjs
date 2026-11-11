// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Portability: static output to dist/ only. No host-specific files (netlify.toml, _redirects, _headers).
// Redirects live here so any static host (Netlify now, Cloudflare Pages later) serves them the same way.
// The wiki lives under /wiki/ so a homepage can take / later without breaking published links.

const CATEGORIES = [
	{ label: '파이프라인', dir: 'pipeline' },
	{ label: '도구', dir: 'tools' },
	{ label: '법·정책', dir: 'law-policy' },
	{ label: '조직·직무', dir: 'org-roles' },
	{ label: '디자인', dir: 'design' },
	{ label: '운영 경험', dir: 'operations' },
];

// Show a category only once it has at least one page, so the sidebar never lists empty sections.
const hasPages = (dir) => {
	const path = fileURLToPath(new URL(`./src/content/docs/wiki/${dir}`, import.meta.url));
	return existsSync(path) && readdirSync(path).some((f) => /\.mdx?$/.test(f));
};

export default defineConfig({
	// Update when a custom domain replaces the Netlify subdomain.
	site: 'https://magical-druid-50492b.netlify.app',
	output: 'static',
	redirects: { '/': '/wiki/' },
	integrations: [
		starlight({
			title: 'loglab study wiki',
			favicon: '/favicon.svg',
			defaultLocale: 'root',
			locales: { root: { label: '한국어', lang: 'ko' } },
			customCss: [
				'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css',
				'@fontsource/ibm-plex-mono/400.css',
				'@fontsource/ibm-plex-mono/500.css',
				'./src/styles/wiki.css',
			],
			components: {
				MarkdownContent: './src/components/PageMeta.astro',
				PageTitle: './src/components/PageTitle.astro',
				PageSidebar: './src/components/PageSidebar.astro',
				SiteTitle: './src/components/SiteTitle.astro',
			},
			pagination: false,
			sidebar: CATEGORIES.filter((c) => hasPages(c.dir)).map((c) => ({
				label: c.label,
				items: [{ autogenerate: { directory: `wiki/${c.dir}` } }],
			})),
		}),
	],
});
