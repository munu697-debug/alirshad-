import { getAllComments } from "@/lib/db-service";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export const revalidate = 0;

export default async function DashboardCommentsPage() {
  const comments = await getAllComments();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-sans text-primary">Comment Moderation</h1>
        <p className="text-xs text-secondary mt-1">
          Review, approve, or flag reader responses across publications.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-secondary">No comments yet</p>
            <p className="text-xs text-muted mt-1">Reader comments will appear here once published.</p>
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-gray-100">
            {comments.map((comm) => (
              <div key={comm.id} className="pt-4 first:pt-0 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-xs text-primary">{comm.name}</strong>
                    {comm.is_anonymous && (
                      <span className="text-[10px] bg-gray-100 text-muted px-2 py-0.5 rounded-full font-medium">
                        Anonymous
                      </span>
                    )}
                    <span className="text-[11px] text-muted">&bull; {formatDate(comm.created_at)}</span>
                  </div>
                  <p className="text-xs text-secondary font-malayalam leading-relaxed">{comm.content}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                  comm.status === "approved"
                    ? "bg-green-50 text-green-700"
                    : comm.status === "flagged"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}>
                  {comm.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
