import { serverSupabaseClient } from "#supabase/server"

// server/api/pages/[slug].get.ts
export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('blog_posts')
        .select(`
            id,
            title,
            slug,
            content,
            author_id,
            image_url,
            category,
            published_at,
            tags,
            seo_title,
            seo_description,
            profiles:author_id (
                display_name,
                avatar_url
            )
        `)
        .eq('slug', slug)
        .single()

    if (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Insights(Blog) not found'
        })
    }


    const { data: related, error: relatedError } = await client
        .from("blog_posts")
        .select("id, title, slug, image_url, category, tags")
        .eq("category", data.category)
        .neq("slug", data.slug) // exclude current post
        .limit(3)

    if (relatedError) {
        console.error("Related posts error:", relatedError)
    }


    return { data, related_posts: related ?? [] }
})