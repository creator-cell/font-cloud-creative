"use client";

import { useState } from "react";
import { replyToTicket } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SupportTableProps {
  token: string;
  tickets: any[];
}

export const SupportTable = ({ token, tickets }: SupportTableProps) => {
  const [replyState, setReplyState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleReply = async (ticketId: string) => {
    const message = replyState[ticketId];
    if (!message) {
      alert("Enter a reply first");
      return;
    }
    setLoading(ticketId);
    try {
      await replyToTicket(token, ticketId, { message });
      alert("Reply sent");
      setReplyState((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to reply");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket._id} className="rounded-lg border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{ticket.subject}</h3>
              <p className="text-xs text-slate-400">{ticket.status} • {ticket.priority} • {ticket.userId}</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Updated {new Date(ticket.updatedAt).toLocaleString()}</span>
          </div>
          <div className="mt-3 space-y-2">
            {ticket.messages.map((message: any, idx: number) => (
              <div key={idx} className="rounded bg-gray-100 p-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
                <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {message.senderId} • {new Date(message.createdAt).toLocaleString()}
                </div>
                {message.body}
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <Textarea
              rows={3}
              placeholder="Reply..."
              value={replyState[ticket._id] ?? ""}
              onChange={(event) => setReplyState((prev) => ({ ...prev, [ticket._id]: event.target.value }))}
            />
            <Button size="sm" onClick={() => handleReply(ticket._id)} disabled={loading === ticket._id}>
              {loading === ticket._id ? "Sending..." : "Reply"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
