import { randomUUID } from "crypto";
import type { ProjectSummary } from "@/lib/api/endpoints";

const projectStore = new Map<string, ProjectSummary>();

const seedProjects = () => {
  if (projectStore.size > 0) return;
  const initial: ProjectSummary[] = [
    {
      _id: randomUUID(),
      name: "Launch Campaign",
      brandVoiceIds: [],
    },
    {
      _id: randomUUID(),
      name: "Growth Experiments",
      brandVoiceIds: [],
    },
  ];
  initial.forEach((project) => projectStore.set(project._id, project));
};

seedProjects();

export const listProjects = (): ProjectSummary[] => {
  return Array.from(projectStore.values());
};

export const createProject = (name: string): ProjectSummary => {
  const project: ProjectSummary = {
    _id: randomUUID(),
    name,
    brandVoiceIds: [],
  };
  projectStore.set(project._id, project);
  return project;
};

export const updateProject = (id: string, updates: Partial<Pick<ProjectSummary, "name">>) => {
  const existing = projectStore.get(id);
  if (!existing) return null;
  const updated: ProjectSummary = {
    ...existing,
    ...updates,
  };
  projectStore.set(id, updated);
  return updated;
};

export const deleteProject = (id: string) => {
  return projectStore.delete(id);
};

