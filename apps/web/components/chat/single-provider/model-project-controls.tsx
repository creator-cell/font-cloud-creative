"use client";

import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectSummary } from "@/lib/api/endpoints";
import { formatPlanName, ModelOption } from "./utils";

type ModelProjectControlsProps = {
  modelOptions: ModelOption[];
  selectedModelValue: string;
  selectedModelOption: ModelOption | null;
  modelUnavailable: boolean;
  onModelChange: (value: string) => void;
  projects: ProjectSummary[];
  selectedProjectId: string | null;
  onProjectChange: (value: string) => void;
};

export const ModelProjectControls = ({
  modelOptions,
  selectedModelValue,
  selectedModelOption,
  modelUnavailable,
  onModelChange,
  projects,
  selectedProjectId,
  onProjectChange,
}: ModelProjectControlsProps) => (
  <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,18rem)_minmax(0,18rem)] xl:items-start xl:gap-5">
    <div className="flex w-full flex-col gap-2 xl:max-w-sm">
      <label htmlFor="model" className="text-sm font-medium text-slate-700">
        Model
      </label>
      <Select value={selectedModelValue} onValueChange={onModelChange} disabled={modelOptions.length === 0}>
        <SelectTrigger id="model" aria-label="Select AI model">
          <SelectValue
            placeholder={modelOptions.length === 0 ? "No models available" : "Choose a model"}
          />
        </SelectTrigger>
        <SelectContent>
          {modelOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={!option.available}>
              {option.label}
              {!option.available ? " · Locked" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {modelOptions.length === 0 ? (
        <p className="text-xs text-slate-500">No models are available for your plan.</p>
      ) : modelUnavailable ? (
        <p className="text-xs text-amber-600">
          Your plan does not include this model
          {selectedModelOption?.minPlan ? ` (requires ${formatPlanName(selectedModelOption.minPlan)} plan)` : ""}.
          Choose an available option.
        </p>
      ) : null}
    </div>

    <div className="flex w-full flex-col gap-2 xl:max-w-sm">
      <label htmlFor="project" className="flex items-center gap-2 text-sm font-medium text-slate-700">
        Project
        <span
          className="group relative inline-flex"
          tabIndex={0}
          aria-label="Every conversation will be tagged to this project"
        >
          <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span className="pointer-events-none absolute left-1/2 top-full z-20 hidden -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover:block group-focus-visible:block">
            Every conversation will be tagged to this project
          </span>
        </span>
      </label>
      <Select
        value={selectedProjectId ?? ""}
        onValueChange={onProjectChange}
        disabled={projects.length === 0}
      >
        <SelectTrigger id="project" aria-label="Select project">
          <SelectValue placeholder={projects.length === 0 ? "No projects available" : "Choose a project"} />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project._id} value={project._id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {projects.length === 0 ? (
        <p className="text-xs text-slate-500">Create a project first from the Projects section.</p>
      ) : null}
    </div>
  </div>
);
