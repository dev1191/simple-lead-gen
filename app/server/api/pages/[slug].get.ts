import { serverSupabaseClient } from "#supabase/server"

// server/api/pages/[slug].get.ts
export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('static_pages')
        .select('*')
        .eq('name', slug)
        .single()

    if (error) throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
    })

    return data
})