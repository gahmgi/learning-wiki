// Runs before `astro build`. `page: hub` skips the required learning fields,
// so only the home page and category overviews (index.md / index.mdx) may use it.
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename, relative } from 'node:path';

const ROOT = 'src/content/docs';
const bad = [];

function walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) walk(path);
		else if (/\.mdx?$/.test(entry.name)) check(path);
	}
}

function check(path) {
	const frontmatter = readFileSync(path, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
	const isHub = /^page:\s*['"]?hub['"]?\s*$/m.test(frontmatter);
	const isIndex = /^index\.mdx?$/.test(basename(path));
	if (isHub && !isIndex) bad.push(relative('.', path));
}

walk(ROOT);

if (bad.length > 0) {
	console.error('\n  ✋ page: hub 는 index 파일(홈·카테고리 개요)에만 쓸 수 있습니다.');
	console.error('     학습 페이지라면 page: hub 를 지우고 머리말 4칸을 채우세요.\n');
	for (const p of bad) console.error(`     - ${p}`);
	console.error('');
	process.exit(1);
}
