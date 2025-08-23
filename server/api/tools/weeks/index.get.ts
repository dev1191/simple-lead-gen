import { serverSupabaseClient } from "#supabase/server"

// server/api/tools/weeks/index.get.ts
export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('tools')
        .select(`*
        `)
        .eq('status', true)
        .eq('is_featured', true)
        .limit(3)

    if (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Tool not found'
        })
    }

    return data;
})