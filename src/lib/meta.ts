// Shared helpers for page provenance display.
export const CATEGORY_LABELS: Record<string, string> = {
	pipeline: '파이프라인',
	tools: '도구',
	'law-policy': '법·정책',
	'org-roles': '조직·직무',
	design: '디자인',
	operations: '운영 경험',
};

export interface Source {
	title: string;
	url?: string;
	note?: string;
}

export function pageInfo(entry: { id: string; data: Record<string, any> }) {
	const data = entry.data;
	const isLearning = data.page !== 'hub';
	const segment = entry.id.split('/')[1] ?? '';
	const category = CATEGORY_LABELS[segment] ?? '';
	// YAML dates parse as UTC midnight, so the ISO date part is the date that was written.
	const learned = data.learned instanceof Date ? data.learned.toISOString().slice(0, 10) : '';
	const sources = (data.sources ?? []) as Source[];
	return { isLearning, category, learned, sources, status: data.status as string | undefined };
}

// Korean titles break before "·" under word-break: keep-all ("포토샵 / ·일러스트레이터").
// A word joiner before the dot keeps it on the line of the word it follows.
export const joinDots = (s: string) => s.replace(/·/g, '⁠·');
