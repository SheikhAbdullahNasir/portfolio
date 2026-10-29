import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { cardColors } from './data/palette';

// One Markdown file per project in src/content/projects. The body is reserved for
// the future /work/[slug] case study page and may be empty.
// Missing content is left out (optional fields, empty lists) and the page renders
// the matching placeholder from src/data/placeholders.ts. Never fill gaps with invented text.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      /** Display order, lowest first. Also sets the "01 / 02" counter. */
      order: z.number().int().positive(),
      /** Short status pill, for example "MVP · Live". */
      status: z.string(),
      color: z.enum(cardColors),
      headline: z.string(),
      summary: z.string(),
      /** Shorter summary for the mobile card. Falls back to `summary`. */
      mobileSummary: z.string().optional(),
      why: z.string().optional(),
      facts: z.array(z.string()).default([]),
      /** Empty until verified from the project's repo. */
      stack: z.array(z.string()).default([]),
      links: z
        .object({
          live: z.url().optional(),
          github: z.url().optional(),
        })
        .default({}),
      visual: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('screenshots'),
          images: z
            .array(
              z.object({
                src: image(),
                alt: z.string(),
                /** Set while a screenshot is waiting to be retaken. */
                note: z.string().optional(),
              }),
            )
            .min(1),
        }),
        z.object({
          type: z.literal('diagram'),
          steps: z
            .array(
              z.object({
                title: z.string(),
                detail: z.string().optional(),
              }),
            )
            .min(2),
        }),
      ]),
      published: z.boolean().default(false),
    }),
});

export const collections = { projects };
