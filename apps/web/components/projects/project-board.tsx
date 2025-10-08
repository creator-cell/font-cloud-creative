"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProjectSummary, createProject } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const projectSchema = z.object({
  name: z.string().min(2, "Name is required")
});

type ProjectForm = z.infer<typeof projectSchema>;

export const ProjectBoard = ({
  token,
  initialProjects
}: {
  token: string;
  initialProjects: ProjectSummary[];
}) => {
  const [projects, setProjects] = useState(initialProjects);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema)
  });

  const onSubmit = async (data: ProjectForm) => {
    try {
      const response = await createProject(token, data);
      setProjects((prev) => [...prev, response.project]);
      reset();
    } catch (err) {
      console.error(err);
      alert("Could not create project. Try again later.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Name</label>
              <Input placeholder="Launch Campaign" {...register("name")}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create project"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet. Start by creating one above.</p>
          ) : (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project._id} className="rounded-md border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{project.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Brand voices: {project.brandVoiceIds.length}</p>
                    </div>
                    {project.modelOverride && (
                      <span className="text-xs text-slate-500 dark:text-slate-300">
                        Override: {project.modelOverride.provider}/{project.modelOverride.model}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
