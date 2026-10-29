import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Published projects in display order. Adding a project file is all it takes to show it. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => data.published);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** "01", "02", ... for the card label and the nav counter. */
export function projectNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}
