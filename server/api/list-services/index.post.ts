import { serverSupabaseClient } from '#supabase/server';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const client = await serverSupabaseClient(event);

    // ✅ Insert into business_lists
    const { data, error } = await client
        .from("service_lists")
        .insert({
            business_name: body.data.business_name,
            email: body.data.email,
            phone_number: body.data.phone_number,
            country: body.data.country,
            category: body.data.category,
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
        message: "Service Form submitted",
        data,
    };
});