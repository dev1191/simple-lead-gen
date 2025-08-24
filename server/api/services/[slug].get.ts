import { serverSupabaseClient } from "#supabase/server"

// server/api/services/[slug].get.ts
export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug")
    const client = await serverSupabaseClient(event)

    // fetch main service
    const { data: service, error } = await client
        .from("services")
        .select(
            `
        *,
        service_categories (
          categories ( id, name )
        ),
        service_sub_categories (
          sub_categories ( id, name )
        )
      `
        )
        .eq("slug", slug)
        .single()

    if (error || !service) {
        throw createError({
            statusCode: 404,
            statusMessage: "Service not found",
        })
    }

    // fetch similar services (same category, exclude self)
    let similar: any[] = []

    if (service.service_categories?.length) {
        const categoryIds = service.service_categories.map(
            (sc: any) => sc.categories.id
        )

        const { data: similarServices } = await client
            .from("services")
            .select(`
            *,
            service_categories!inner (
                category_id,
                categories ( id, name )
            ),
            service_sub_categories (
                sub_categories ( id, name )
            )
            `)
            .in("service_categories.category_id", categoryIds.length ? categoryIds : [-1]) // filter inside join
            .neq("slug", slug) // exclude current service
            .limit(3)

        similar = similarServices || []
    }

    return {
        ...service,
        similar,
    }
})
