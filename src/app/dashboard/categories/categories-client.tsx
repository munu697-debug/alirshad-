"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import type { Category } from "@/lib/types";

type Form = { id?: string; name: string; slug: string; description: string; display_order: string };
const empty: Form = { name: "", slug: "", description: "", display_order: "0" };

const inputCls =
  "w-full px-3 py-2 text-sm font-normal border border-gray-200 rounded-xl focus:outline-none focus:border-accent";

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(form.id ? `/api/categories/${form.id}` : "/api/categories", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
      } else {
        setForm(null);
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Could not delete category (it may still be used by articles).");
  };

  const startEdit = (cat: Category) => {
    setError("");
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      display_order: String(cat.display_order ?? 0),
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-primary">Categories Management</h1>
          <p className="text-xs text-secondary mt-1">Organize taxonomy, editorial desks, and sub-genres.</p>
        </div>
        <button
          onClick={() => {
            setError("");
            setForm(empty);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-xs font-semibold rounded-xl hover:bg-accent-hover shadow-royal"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {form && (
        <form onSubmit={save} className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-primary">{form.id ? "Edit Category" : "New Category"}</h2>
            <button type="button" onClick={() => setForm(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-xs font-semibold text-primary space-y-1.5 block">
              Name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </label>
            <label className="text-xs font-semibold text-primary space-y-1.5 block">
              Slug (optional, auto from name)
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls + " font-mono"} />
            </label>
            <label className="text-xs font-semibold text-primary space-y-1.5 block sm:col-span-2">
              Description
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
            </label>
            <label className="text-xs font-semibold text-primary space-y-1.5 block">
              Display order
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className={inputCls} />
            </label>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-xs font-semibold rounded-xl disabled:opacity-60"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Category
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted border-b border-gray-100 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Slug</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No categories yet. Click "New Category" to add one.
                  </td>
                </tr>
              )}
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">{cat.name}</td>
                  <td className="py-3.5 pr-4 text-secondary font-mono text-[11px]">{cat.slug}</td>
                  <td className="py-3.5 pr-4 text-muted max-w-sm truncate">{cat.description || "—"}</td>
                  <td className="py-3.5 pr-4 text-secondary">{cat.display_order || idx + 1}</td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(cat)} className="p-2 rounded-lg text-secondary hover:text-accent hover:bg-accent-light/40" aria-label="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(cat)} className="p-2 rounded-lg text-red-600 hover:bg-red-50" aria-label="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
