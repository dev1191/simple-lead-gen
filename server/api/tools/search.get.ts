// server/api/services/search.get.ts
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);

  const client = await serverSupabaseClient(event)

  let query = client.from("tools").select("name");

  if (q && typeof q === "string" && q.trim() !== "") {
    query = query.ilike("name", `%${q}%`);
  }

  // always limit to 10 results
  const { data, error } = await query.limit(10);

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return data;
});
