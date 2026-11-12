import { getCategories } from "@/lib/db-service";

export const revalidate = 0;

export default async function DashboardCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-sans text-primary">Categories Management</h1>
        <p className="text-xs text-secondary mt-1">
          Organize taxonomy, editorial desks, and sub-genres.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted border-b border-gray-100 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Slug</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Display Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-primary">{cat.name}</td>
                  <td className="py-3.5 pr-4 text-secondary font-mono text-[11px]">{cat.slug}</td>
                  <td className="py-3.5 pr-4 text-muted max-w-sm truncate">{cat.description || "—"}</td>
                  <td className="py-3.5 pr-4 text-secondary">{cat.display_order || idx + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
