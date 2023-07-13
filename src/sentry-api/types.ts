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
};

export const issuesScheme: z.ZodType<Issue[]> = z.array(
  z.object({
    count: z.string(),
    id: z.string(),
    title: z.string(),
  }),
);
