// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Portability: static output to dist/ only. No host-specific files (netlify.toml, _redirects, _headers).
// Redirects live here so any static host (Netlify now, Cloudflare Pages later) serves them the same way.
export default defineConfig({
	output: 'static',
	redirects: {},
	integrations: [
		starlight({
			title: '학습 위키',
			defaultLocale: 'root',
			locales: { root: { label: '한국어', lang: 'ko' } },
			customCss: ['./src/styles/wiki.css'],
			components: { MarkdownContent: './src/components/PageMeta.astro' },
			sidebar: [
				{ label: '파이프라인', items: [{ autogenerate: { directory: 'pipeline' } }] },
				{ label: '도구', items: [{ autogenerate: { directory: 'tools' } }] },
				{ label: '법·정책', items: [{ autogenerate: { directory: 'law-policy' } }] },
				{ label: '조직·직무', items: [{ autogenerate: { directory: 'org-roles' } }] },
			],
		}),
	],
});
