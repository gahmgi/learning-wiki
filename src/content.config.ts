import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Learning pages must carry provenance. Hub pages (wiki home, category index) are exempt;
// scripts/check-hubs.mjs makes sure only index files use `page: hub`.
// origin: where the page started. `worknote` pages are published from a WorkNote note and must name it;
// `wiki` pages are written here first (heavy on images, tables, diagrams) and need no source note.
const learningFields = z.object({
	page: z.enum(['learning', 'hub']).default('learning'),
	origin: z.enum(['worknote', 'wiki']).default('worknote'),
	worknote_id: z.string().trim().min(1).optional(),
	// One sentence saying what has been checked and what has not, e.g. "주요 출처 확인. 저작권 절은 기사 해설만 봄."
	status: z.string().trim().min(1).optional(),
	sources: z
		.array(
			z.object({
				title: z.string().min(1),
				url: z.string().url().optional(),
				note: z.string().optional(),
			}),
		)
		.optional(),
	learned: z.coerce.date().optional(),
});

const REQUIRED = ['status', 'sources', 'learned'] as const;

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: (context) =>
			docsSchema({ extend: learningFields })(context).superRefine((data, ctx) => {
				if (data.page === 'hub') return;
				if (data.origin === 'worknote' && !data.worknote_id) {
					ctx.addIssue({
						code: 'custom',
						path: ['worknote_id'],
						message: "WorkNote에서 발행한 페이지는 'worknote_id'가 필요합니다. 위키에서 처음 쓰는 글이면 origin: wiki",
					});
				}
				for (const key of REQUIRED) {
					const value = (data as Record<string, unknown>)[key];
					if (value === undefined || (Array.isArray(value) && value.length === 0)) {
						ctx.addIssue({
							code: 'custom',
							path: [key],
							message: `학습 페이지 머리말에 '${key}'가 없습니다. (허브 페이지면 page: hub)`,
						});
					}
				}
			}),
	}),
};
