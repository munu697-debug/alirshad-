import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db-service";
import EditPostClient from "./edit-client";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return <EditPostClient initialPost={post} />;
}
