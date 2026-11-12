import { getCategories } from "@/lib/db-service";
import { CategoriesClient } from "./categories-client";

export const revalidate = 0;

export default async function DashboardCategoriesPage() {
  const categories = await getCategories();
  return <CategoriesClient categories={categories} />;
}
