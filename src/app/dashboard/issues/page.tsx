import { getIssues } from "@/lib/db-service";
import { IssuesClient } from "./issues-client";

export const revalidate = 0;

export default async function DashboardIssuesPage() {
  const issues = await getIssues({ publishedOnly: false });

  return <IssuesClient initialIssues={issues} />;
}
