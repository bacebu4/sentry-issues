import { z } from 'zod';

export type Project = {
  id: string;
  name: string;
  hasAccess: boolean;
  slug: string;
  organization: { slug: string };
};

export const projectsScheme: z.ZodType<Project[]> = z.array(
  z.object({
    name: z.string(),
    id: z.string(),
    hasAccess: z.boolean(),
    slug: z.string(),
    organization: z.object({
      slug: z.string(),
    }),
  }),
);

export type Issue = {
  id: string;
  count: string;
  title: string;
  lastSeen: string;
  firstSeen: string;
  permalink: string;
  metadata: { value: string } | { title: string };
  project: { id: string };
};

export const issueScheme: z.ZodType<Issue> = z.object({
  count: z.string(),
  id: z.string(),
  lastSeen: z.string(),
  firstSeen: z.string(),
  title: z.string(),
  metadata: z.union([z.object({ value: z.string() }), z.object({ title: z.string() })]),
  permalink: z.string(),
  project: z.object({ id: z.string() }),
});

export type Event = {
  /**
   * @deprecated
   */
  tags: { key: string; value: string }[];
  raw: string;
};

/**
 * @deprecated
 */
export const eventScheme = z.object({
  tags: z.array(z.object({ key: z.string(), value: z.string() })),
});

/**
 * @deprecated
 */
export const eventsScheme = z.array(eventScheme);

export type Tag = {
  key: string;
  topValues: {
    count: number;
    value: string;
  }[];
};

const tagScheme: z.ZodType<Tag> = z.object({
  key: z.string(),
  topValues: z.array(
    z.object({
      count: z.number(),
      value: z.string(),
    }),
  ),
});

export const tagsScheme = z.array(tagScheme);
