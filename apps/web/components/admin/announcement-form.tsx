"use client";

import { useState } from "react";
import { createAnnouncement } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  token: string;
  onCreated?: () => void;
}

export const AnnouncementForm = ({ token, onCreated }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      title: String(data.get("title")),
      body: String(data.get("body")),
      audience: String(data.get("audience")) as "all" | "paid" | "free",
      link: String(data.get("link") ?? "").trim() || undefined,
      published: data.get("published") === "on"
    };

    setLoading(true);
    try {
      await createAnnouncement(token, payload);
      event.currentTarget.reset();
      onCreated?.();
      alert("Announcement created");
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Title
          <Input name="title" required className="mt-1" />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Audience
          <select name="audience" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            <option value="all">All users</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </label>
      </div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
        Link
        <Input name="link" className="mt-1" placeholder="https://" />
      </label>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
        Body
        <Textarea name="body" rows={4} className="mt-1" required />
      </label>
      <label className="flex items-center gap-2 text-xs text-slate-400">
        <input type="checkbox" name="published" /> Publish immediately
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Publishing..." : "Create announcement"}
      </Button>
    </form>
  );
};
