import { serverSupabaseClient } from "#supabase/server"

// server/api/insights/latest.get.ts
export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('blog_posts')
        .select(`*
        `)
        .eq('status', 'Published')
        .order("published_at", { ascending: false })
        .limit(3)

    if (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Blog posts not found'
        })
    }

    return data;
})