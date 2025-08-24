import { serverSupabaseClient } from '#supabase/server';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const client = await serverSupabaseClient(event);

    // ✅ Insert into service_details
    const { data, error } = await client
        .from("service_details")
        .insert({
            service_id: body.data.service_id,
            name: body.data.name,
            email: body.data.email,
            company_name: body.data.company_name,
            phone_number: body.data.phone_number,
            timeline: body.data.timeline,
            budgets: body.data.budgets,
            content: body.data.content,
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
        message: "Query send successfully",
        data,
    };
});