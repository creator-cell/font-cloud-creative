"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface PlanRowActionsProps {
  planId: string;
  editHref: string;
  token: string;
}

export const PlanRowActions = ({ planId, editHref, token }: PlanRowActionsProps) => {
  const router = useRouter();
  const [isDeleting, setDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const loading = isDeleting || isPending;

  const handleEdit = () => {
    if (loading) return;
    router.push(editHref);
  };

  const handleDelete = async () => {
    if (loading) return;
    const confirmDelete = window.confirm(
      "Deleting a plan cannot be undone and should only be done for experimental or unsold plans. Continue?"
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4004"}/admin/plans/${planId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error ?? "Failed to delete plan");
      }
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete plan";
      // eslint-disable-next-line no-alert
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 px-0 text-lg leading-none text-slate-900 hover:text-slate-900"
          disabled={loading}
          aria-label="Plan actions"
        >
          <span aria-hidden className="pointer-events-none">⋯</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={handleEdit} className="flex items-center gap-2 text-sm">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit plan
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={handleDelete}
          className="flex items-center gap-2 text-sm text-rose-600 focus:text-rose-600"
        >
          <Trash className="h-4 w-4" aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
