import { serverSupabaseClient } from "#supabase/server"

// server/api/faqs/[category].get.ts
export default defineEventHandler(async (event) => {
    const category = getRouterParam(event, 'category')
    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('faqs')
        .select('question,answer,category')
        .eq('category', category)

    if (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Faq not found'
        })
    }

    return data
})