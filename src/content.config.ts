import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const contentStatus = z.enum(['placeholder', 'draft', 'verified']);

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const processStepSchema = z.object({
  title: z.string(),
  text: z.string(),
});

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const halls = defineCollection({
  loader: glob({ base: './src/content/halls', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      eyebrow: z.string().optional(),
      status: contentStatus.default('placeholder'),
      disclaimer: z.string().optional(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      fit: z
        .object({
          title: z.string().default('Är den här lösningen rätt för projektet?'),
          intro: z.string().optional(),
          items: z.array(z.string()).default([]),
        })
        .optional(),
      scope: z
        .object({
          intro: z.string().optional(),
          included: z.array(z.string()).default([]),
          options: z.array(z.string()).default([]),
          customer: z.array(z.string()).default([]),
        })
        .optional(),
      costDrivers: z
        .array(
          z.object({
            title: z.string(),
            text: z.string(),
          }),
        )
        .default([]),
      process: z.array(processStepSchema).default([]),
      faq: z.array(faqItemSchema).default([]),
      primaryCta: ctaSchema,
      secondaryCta: ctaSchema.optional(),
      lastReviewed: z.coerce.date().optional(),
    }),
});

const references = defineCollection({
  loader: glob({ base: './src/content/references', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      eyebrow: z.string().optional(),
      status: contentStatus.default('placeholder'),
      disclaimer: z.string().optional(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      location: z.string().optional(),
      year: z.string().optional(),
      hallType: z.string().optional(),
      area: z.string().optional(),
      facts: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          }),
        )
        .default([]),
      need: z.string().optional(),
      scope: z.array(z.string()).default([]),
      solution: z.string().optional(),
      result: z.string().optional(),
      relatedHallHref: z.string().optional(),
      relatedHallLabel: z.string().optional(),
      primaryCta: ctaSchema.optional(),
      lastReviewed: z.coerce.date().optional(),
    }),
});

const knowledge = defineCollection({
  loader: glob({ base: './src/content/knowledge', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: contentStatus.default('placeholder'),
    lastReviewed: z.coerce.date().optional(),
    sourceOwner: z.string().optional(),
  }),
});

export const collections = { halls, references, knowledge };
