import { getAllSubscribers } from "@/lib/db-service";
import { formatDate } from "@/lib/utils";
import { Users, Mail } from "lucide-react";

export const revalidate = 0;

export default async function DashboardSubscribersPage() {
  const subscribers = await getAllSubscribers();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans text-primary">Subscribers</h1>
          <p className="text-xs text-secondary mt-1">
            Audience members receiving publication highlights and newsletters.
          </p>
        </div>
        <span className="px-3 py-1 bg-surface border border-gray-200 text-xs font-semibold rounded-full text-secondary">
          {subscribers.length} total subscribers
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted border-b border-gray-100 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-primary flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span>{sub.email}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold text-[10px]">
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-muted">
                    {formatDate(sub.created_at)}
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
