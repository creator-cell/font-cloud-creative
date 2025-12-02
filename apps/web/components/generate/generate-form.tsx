"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generationTypeSchema } from "@/lib/validation";
import type {
  BrandVoiceSummary,
  ProjectSummary,
  ProviderModelSummary,
} from "@/lib/api/endpoints";
import { postGenerate } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModelPicker } from "@/components/model-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formSchema = z.object({
  type: generationTypeSchema,
  projectId: z.string().optional(),
  styleCardId: z.string().optional(),
  brief: z.string().min(10, "Provide a brief so the AI has context."),
  audience: z.string().min(2, "Describe your audience."),
  offer: z.string().min(2, "Describe the offer."),
  claimsMode: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const GenerateForm = ({
  token,
  models,
  projects,
  brandVoices,
  defaults,
}: {
  token: string;
  models: ProviderModelSummary[];
  projects: ProjectSummary[];
  brandVoices: BrandVoiceSummary[];
  defaults?: { provider?: string; model?: string };
}) => {
  const [selection, setSelection] = useState<
    { provider: string; model: string } | undefined
  >(
    defaults?.provider && defaults?.model
      ? { provider: defaults.provider, model: defaults.model }
      : undefined
  );
  const [result, setResult] = useState<any | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: "ad" },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const payload = {
        type: values.type,
        inputs: {
          brief: values.brief,
          audience: values.audience,
          offer: values.offer,
        },
        projectId: values.projectId || undefined,
        styleCardId: values.styleCardId || undefined,
        claimsMode: values.claimsMode,
        provider: selection?.provider as
          | "openai"
          | "google"
          | "anthropic"
          | "ollama"
          | undefined,
        model: selection?.model,
      };
      const response: any = await postGenerate(token, payload);
      setResult(response);
      setWarnings(response?.warnings ?? []);
    } catch (err) {
      console.error(err);
      const status = (err as Error & { status?: number }).status;
      if (status === 402) {
        setError("You hit your plan limit. Upgrade to keep generating.");
      } else if (status === 429) {
        setError("Rate limited. Try again in a moment.");
      } else {
        setError((err as Error).message);
      }
    }
  };

  const selectedProjectVoices = brandVoices.filter(
    (voice) => voice.projectId === watch("projectId")
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle>Generation setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <form id="generate-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Content type</label>
              <Select defaultValue="ad" {...register("type")}>
                <option value="ad">Ad</option>
                <option value="carousel">Carousel</option>
                <option value="blog">Blog</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Project</label>
              <Select defaultValue="" {...register("projectId")}> 
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Brand voice</label>
              <Select defaultValue="" {...register("styleCardId")}> 
                <option value="">Auto</option>
                {selectedProjectVoices.map((voice) => (
                  <option key={voice._id} value={voice._id}>
                    {voice.styleCard.tone.join(", ")}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Campaign brief</label>
              <Textarea rows={3} {...register("brief")} />
              {errors.brief && <p className="mt-1 text-xs text-rose-400">{errors.brief.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Audience</label>
              <Input {...register("audience")} />
              {errors.audience && <p className="mt-1 text-xs text-rose-400">{errors.audience.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">Offer</label>
              <Input {...register("offer")} />
              {errors.offer && <p className="mt-1 text-xs text-rose-400">{errors.offer.message}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4" {...register("claimsMode")} />
              Include claims & compliance notes
            </label>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </form> */}
          <form
            id="generate-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* CONTENT TYPE */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">
                Content type
              </label>
              <Select onValueChange={(v) => setValue("type", v as any)}>
                <SelectTrigger className="w-full my-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ad">Ad</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PROJECT */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">
                Project
              </label>
              <Select onValueChange={(v) => setValue("projectId", v)}>
                <SelectTrigger className="w-full my-2">
                  <SelectValue
                    placeholder={`${projects.length === 0 ? "No Project" : "Select Project"}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="none">No project</SelectItem> */}
                  {projects?.length > 0 &&
                    projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* BRAND VOICE */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">
                Brand voice
              </label>
              <Select onValueChange={(v) => setValue("styleCardId", v)}>
                <SelectTrigger className="w-full my-2">
                  <SelectValue
                    placeholder={`${selectedProjectVoices?.length === 0 ? "Auto" : "Select Auto"}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  {selectedProjectVoices?.length > 0 &&
                    selectedProjectVoices.map((voice) => (
                      <SelectItem key={voice._id} value={voice._id}>
                        {voice.styleCard.tone.join(", ")}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* REMAINING SAME */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">
                Campaign brief
              </label>
              <Textarea rows={3} {...register("brief")} />
              {errors.brief && (
                <p className="mt-1 text-xs text-rose-400">
                  {errors.brief.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">
                Audience
              </label>
              <Input {...register("audience")} />
              {errors.audience && (
                <p className="mt-1 text-xs text-rose-400">
                  {errors.audience.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-200">
                Offer
              </label>
              <Input {...register("offer")} />
              {errors.offer && (
                <p className="mt-1 text-xs text-rose-400">
                  {errors.offer.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4"
                {...register("claimsMode")}
              />
              Include claims & compliance notes
            </label>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelPicker
              models={models}
              selected={selection}
              onChange={setSelection}
            />
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {warnings.length > 0 && (
                <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-xs text-amber-200">
                  <strong>Warnings:</strong>
                  <ul className="mt-2 space-y-1">
                    {warnings.map((warning) => (
                      <li key={warning}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              <pre className="max-h-80 overflow-auto rounded-md bg-gray-100 p-4 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {JSON.stringify(result.output, null, 2)}
              </pre>
              {result.watermark && (
                <p className="text-xs text-slate-500">
                  Watermark: {result.watermark}
                </p>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(result.output, null, 2)
                  )
                }
              >
                Copy JSON
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
