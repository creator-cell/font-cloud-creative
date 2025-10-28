"use client";

import { useEffect, useMemo, useState, MouseEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Loader2,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ProjectSummary,
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/api/endpoints";

const projectSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

type ProjectForm = z.infer<typeof projectSchema>;

const PAGE_SIZE = 6;

type SortColumn = "name" | "brandVoices" | "model";
type SortDirection = "asc" | "desc";
type SortState = { column: SortColumn; direction: SortDirection };
type ModelFilter = "all" | "withOverride" | "withoutOverride";

export const ProjectBoard = ({
  token,
  initialProjects,
}: {
  token: string;
  initialProjects: ProjectSummary[];
}) => {
  const [projects, setProjects] = useState<ProjectSummary[]>(initialProjects);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState<ModelFilter>("all");
  const [sortState, setSortState] = useState<SortState>({ column: "name", direction: "asc" });
  const [page, setPage] = useState(1);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    const matchesSearch = (project: ProjectSummary) => {
      if (!normalizedSearch) {
        return true;
      }
      const haystack = [
        project.name,
        project.modelOverride?.model ?? "",
        project.modelOverride?.provider ?? "",
        ...project.brandVoiceIds,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    };

    const matchesFilter = (project: ProjectSummary) => {
      if (modelFilter === "withOverride") {
        return Boolean(project.modelOverride);
      }
      if (modelFilter === "withoutOverride") {
        return !project.modelOverride;
      }
      return true;
    };

    const sorted = projects
      .filter((project) => matchesSearch(project) && matchesFilter(project))
      .sort((a, b) => {
        let comparison = 0;
        switch (sortState.column) {
          case "brandVoices":
            comparison = a.brandVoiceIds.length - b.brandVoiceIds.length;
            break;
          case "model": {
            const aModel = `${a.modelOverride?.provider ?? ""} ${a.modelOverride?.model ?? ""}`.trim();
            const bModel = `${b.modelOverride?.provider ?? ""} ${b.modelOverride?.model ?? ""}`.trim();
            comparison = aModel.localeCompare(bModel);
            break;
          }
          case "name":
          default:
            comparison = a.name.localeCompare(b.name);
            break;
        }
        return sortState.direction === "asc" ? comparison : -comparison;
      });

    return sorted;
  }, [projects, normalizedSearch, modelFilter, sortState]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, page]);

  useEffect(() => {
    setPage(1);
  }, [normalizedSearch, modelFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const toggleSort = (column: SortColumn) => {
    setSortState((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { column, direction: "asc" }
    );
  };

  const openCreateDialog = () => {
    reset();
    setIsCreateOpen(true);
  };

  const closeCreateDialog = () => {
    if (!isSubmitting) {
      setIsCreateOpen(false);
    }
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeCreateDialog();
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      const response = await createProject(token, data);
      setProjects((prev) => [...prev, response.project]);
      reset();
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
      window.alert("Could not create project. Try again later.");
    }
  };

  const beginEdit = (project: ProjectSummary) => {
    setEditingProjectId(project._id);
    setEditName(project.name);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
    setEditName("");
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editingProjectId) return;
    const trimmed = editName.trim();
    if (trimmed.length < 2) {
      setEditError("Name must be at least 2 characters long.");
      return;
    }

    setIsSavingEdit(true);
    try {
      let updatedProject: ProjectSummary | undefined;
      try {
        const response = await updateProject(token, editingProjectId, { name: trimmed });
        updatedProject = response.project;
      } catch (error) {
        console.error(error);
        updatedProject = undefined;
      }

      setProjects((prev) =>
        prev.map((project) =>
          project._id === editingProjectId
            ? updatedProject ?? { ...project, name: trimmed }
            : project
        )
      );
      cancelEdit();
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Delete this project? This action cannot be undone.")) return;
    setDeletingProjectId(projectId);
    try {
      try {
        await deleteProject(token, projectId);
      } catch (error) {
        console.error(error);
      }
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
      if (editingProjectId === projectId) {
        cancelEdit();
      }
    } finally {
      setDeletingProjectId(null);
    }
  };

  const startItem = filteredProjects.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem =
    filteredProjects.length === 0 ? 0 : Math.min(filteredProjects.length, page * PAGE_SIZE);

  const sortLabel =
    sortState.column === "name"
      ? "Name"
      : sortState.column === "brandVoices"
      ? "Brand voices"
      : "Model override";

  const SortIndicator = ({ column }: { column: SortColumn }) => {
    if (sortState.column !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />;
    }
    return sortState.direction === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Projects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organize workstreams, connect brand voices, and tailor model overrides by project.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreateDialog}
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          Create project
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
            Project overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search projects"
                  className="pl-9"
                  aria-label="Search projects"
                />
              </div>
              <Select
                value={modelFilter}
                onValueChange={(value) => setModelFilter(value as ModelFilter)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by model override" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  <SelectItem value="withOverride">With model override</SelectItem>
                  <SelectItem value="withoutOverride">Without model override</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span>Sorting:</span>
              <span className="capitalize text-slate-900 dark:text-white">
                {sortLabel} ({sortState.direction})
              </span>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                No projects yet
              </h3>
              <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                Spin up your first project to keep campaigns, prompts, and brand voices organized.
              </p>
              <Button
                type="button"
                onClick={openCreateDialog}
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300"
              >
                Create project
              </Button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No matches found
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Adjust your search or filter to see projects again.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    <th scope="col" className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSort("name")}
                        className="flex items-center gap-2 text-left font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                      >
                        Name
                        <SortIndicator column="name" />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSort("brandVoices")}
                        className="flex items-center gap-2 text-left font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                      >
                        Brand Voices
                        <SortIndicator column="brandVoices" />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSort("model")}
                        className="flex items-center gap-2 text-left font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                      >
                        Model Override
                        <SortIndicator column="model" />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  {paginatedProjects.map((project) => {
                    const isEditing = editingProjectId === project._id;
                    return (
                      <tr
                        key={project._id}
                        className="align-top transition hover:bg-slate-50/60 dark:hover:bg-slate-800/60"
                      >
                        <td className="px-4 py-4">
                          {isEditing ? (
                            <div className="space-y-1">
                              <Input
                                value={editName}
                                onChange={(event) => {
                                  setEditName(event.target.value);
                                  setEditError(null);
                                }}
                                autoFocus
                              />
                              {editError && <p className="text-xs text-rose-500">{editError}</p>}
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {project.name}
                              </p>
                              {project.modelOverride ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {project.modelOverride.provider} · {project.modelOverride.model}
                                </p>
                              ) : null}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {project.brandVoiceIds.length}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {project.modelOverride
                            ? `${project.modelOverride.provider}/${project.modelOverride.model}`
                            : "—"}
                        </td>
                        <td className="px-4 py-4">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={saveEdit}
                                disabled={isSavingEdit}
                                className="h-8 rounded-full px-3 text-xs font-medium"
                              >
                                {isSavingEdit ? "Saving..." : "Save"}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={cancelEdit}
                                className="h-8 rounded-full px-3 text-xs font-medium"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => beginEdit(project)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                                aria-label={`Edit ${project.name}`}
                              >
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDelete(project._id)}
                                disabled={deletingProjectId === project._id}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-200"
                                aria-label={`Delete ${project.name}`}
                              >
                                {deletingProjectId === project._id ? (
                                  <Loader2
                                    className="h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredProjects.length > 0 ? (
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {startItem}-{endItem} of {filteredProjects.length} project
                {filteredProjects.length === 1 ? "" : "s"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="h-8 rounded-full px-3 text-xs font-medium disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="h-8 rounded-full px-3 text-xs font-medium disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {isCreateOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6"
          onClick={handleOverlayClick}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-100 p-6 text-slate-900 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create project</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Group your prompts, brand voices, and overrides under a new project.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={closeCreateDialog}
                disabled={isSubmitting}
                className="h-9 w-9 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                aria-label="Close create project dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                  htmlFor="project-name"
                >
                  Project name
                </label>
                <Input
                  id="project-name"
                  placeholder="Launch Campaign"
                  autoFocus
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create project"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};
