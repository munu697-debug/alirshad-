"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Flag, Trash2, Loader2 } from "lucide-react";

export function CommentActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async (req: () => Promise<Response>) => {
    setBusy(true);
    try {
      const res = await req();
      if (!res.ok) alert("Action failed.");
      else router.refresh();
    } catch {
      alert("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const setStatus = (next: string) =>
    run(() =>
      fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
    );

  const remove = () => {
    if (!confirm("Delete this comment permanently?")) return;
    run(() => fetch(`/api/comments/${id}`, { method: "DELETE" }));
  };

  return (
    <div className="flex items-center gap-1 shrink-0">
      {busy && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted" />}
      {status !== "approved" && (
        <button onClick={() => setStatus("approved")} disabled={busy} title="Approve"
          className="p-2 rounded-lg text-green-700 hover:bg-green-50 disabled:opacity-50">
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
      {status !== "flagged" && (
        <button onClick={() => setStatus("flagged")} disabled={busy} title="Flag"
          className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 disabled:opacity-50">
          <Flag className="w-3.5 h-3.5" />
        </button>
      )}
      <button onClick={remove} disabled={busy} title="Delete"
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
