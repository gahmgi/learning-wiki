import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Learning pages must carry provenance. Hub pages (wiki home, category index) are exempt;
// scripts/check-hubs.mjs makes sure only index files use `page: hub`.
const learningFields = z.object({
	page: z.enum(['learning', 'hub']).default('learning'),
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

const REQUIRED = ['worknote_id', 'status', 'sources', 'learned'] as const;

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: (context) =>
			docsSchema({ extend: learningFields })(context).superRefine((data, ctx) => {
				if (data.page === 'hub') return;
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
