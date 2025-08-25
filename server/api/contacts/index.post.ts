import { serverSupabaseClient } from '#supabase/server';
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const client = await serverSupabaseClient(event);

    // ✅ Insert into contacts
    const { data, error } = await client
        .from("contacts")
        .insert({
            name: body.data.name,
            email: body.data.email,
            subject: body.data.subject,
            category: body.data.category,
            message: body.data.message,
        })
        .select()
        .single();

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        });
    }

    const { data: mailData, error: mailError } = await client.functions.invoke("send-email-provider-lead", {
        body: {
            subject: `New Contact: ${data.subject}`,
            mail: "venturenexthq@gmail.com", // "devrajthapa1191@gmail.com",
            message: `Name: ${data.name}\nEmail: ${data.email}\nCategory: ${data.category}\nMessage: ${data.message}`,
        },
    })

     if (mailError) {
        throw createError({
            statusCode: 500,
            statusMessage: mailError.message,
        });
    }

    return {
        message: "Contact form submitted",
        data,
    };
});