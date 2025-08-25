import { serverSupabaseClient } from '#supabase/server';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const client = await serverSupabaseClient(event);

    // ✅ Insert into business_lists
    const { data, error } = await client
        .from("business_lists")
        .insert({
            business_name: body.data.business_name,
            name: body.data.name,
            email: body.data.email,
            phone: body.data.phone,
            subject: body.data.subject,
            category: body.data.category,
            website: body.data.website,
            description: body.data.description,
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
        message: "Form submitted",
        data,
    };
});