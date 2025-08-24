import { serverSupabaseClient } from '#supabase/server';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const client = await serverSupabaseClient(event);

    // ✅ Insert into subscriptions
    const { data, error } = await client
        .from("subscriptions")
        .insert({
            email: body.email,
        })
        .select()
        .single();

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        });
    }

    return {
        message: "Subscribed successfully",
        data,
    };
});