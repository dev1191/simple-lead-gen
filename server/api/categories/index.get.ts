import { serverSupabaseClient } from "#supabase/server"

// server/api/insights/latest.get.ts
export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)

    const { data, error } = await client
        .from('categories')
        .select(`id,name
        `, { count: 'exact' })

    if (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Categories not found'
        })
    }

    return data;
})