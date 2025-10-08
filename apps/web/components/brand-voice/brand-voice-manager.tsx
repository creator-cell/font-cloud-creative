"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { BrandVoiceSummary, ProjectSummary } from "@/lib/api/endpoints";
import { buildBrandVoice } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const builderSchema = z.object({
  projectId: z.string().min(1, "Select a project"),
  sample1: z.string().min(10, "Sample must be at least 10 characters"),
  sample2: z.string().min(10, "Sample must be at least 10 characters"),
  sample3: z.string().min(10, "Sample must be at least 10 characters")
});

type BuilderForm = z.infer<typeof builderSchema>;

export const BrandVoiceManager = ({
  token,
  projects,
  initialVoices
}: {
  token: string;
  projects: ProjectSummary[];
  initialVoices: BrandVoiceSummary[];
}) => {
  const [voices, setVoices] = useState(initialVoices);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<BuilderForm>({ resolver: zodResolver(builderSchema) });

  const onSubmit = async (data: BuilderForm) => {
    try {
      const response = await buildBrandVoice(token, {
        projectId: data.projectId,
        samples: [data.sample1, data.sample2, data.sample3]
      });
      setVoices((prev) => [...prev, response.brandVoice]);
      reset();
    } catch (err) {
      console.error(err);
      alert("Could not build brand voice. Please verify your samples.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create brand voice</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Create a project first before crafting a brand voice.</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Project</label>
                <Select defaultValue="" {...register("projectId")}> 
                  <option value="" disabled>
                    Select project
                  </option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
                {errors.projectId && (
                  <p className="mt-1 text-xs text-rose-400">{errors.projectId.message}</p>
                )}
              </div>
              {["sample1", "sample2", "sample3"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">
                    {field.replace("sample", "Sample ")}
                  </label>
                  <Textarea rows={3} {...register(field as keyof BuilderForm)} />
                  {errors[field as keyof BuilderForm] && (
                    <p className="mt-1 text-xs text-rose-400">
                      {errors[field as keyof BuilderForm]?.message as string}
                    </p>
                  )}
                </div>
              ))}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : "Build style card"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing style cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {voices.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No brand voices yet.</p>
          ) : (
            voices.map((voice) => (
              <div key={voice._id} className="rounded-md border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Linked project: {projects.find((p) => p._id === voice.projectId)?.name ?? "Unknown"}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tone</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{voice.styleCard.tone.join(", ")}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Cadence</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{voice.styleCard.cadence}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Power words</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{voice.styleCard.powerWords.join(", ") || "None"}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
