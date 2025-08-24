// server/api/services.get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const client = await serverSupabaseClient(event)

    let {
        page = 1,
        limit = 24,
        search = '',
        category = [],
        sortBy = 'newest',
        turnaroundTime = [],
        serviceType = [],
        consultationType = [],
        region = []
    } = query

    if (typeof category === 'string') {
        try {
            // if query comes like ?category=["a","b"]
            category = JSON.parse(category)
        } catch {
            // if query comes like ?category=a
            category = [category]
        }
    }

    if (!Array.isArray(category)) {
        category = []
    }

    if (typeof turnaroundTime === 'string') {
        try {
            // if query comes like ?category=["a","b"]
            turnaroundTime = JSON.parse(turnaroundTime)
        } catch {
            // if query comes like ?category=a
            turnaroundTime = [turnaroundTime]
        }
    }

    if (!Array.isArray(turnaroundTime)) {
        turnaroundTime = []
    }

    if (typeof serviceType === 'string') {
        try {
            // if query comes like ?category=["a","b"]
            serviceType = JSON.parse(serviceType)
        } catch {
            // if query comes like ?category=a
            serviceType = [serviceType]
        }
    }

    if (!Array.isArray(serviceType)) {
        serviceType = []
    }

    if (typeof region === 'string') {
        try {

            region = JSON.parse(region)
        } catch {

            region = [region]
        }
    }

    if (!Array.isArray(region)) {
        region = []
    }

    if (typeof consultationType === 'string') {
        if (consultationType === 'true' || consultationType === 'false') {
            consultationType = [consultationType === 'true'] // convert to boolean inside array
        } else {
            consultationType = [consultationType] // wrap normal string in array
        }
    }

    if (!Array.isArray(consultationType)) {
        consultationType = []
    }


    let dbQuery = client.from('services').select(
        `
      *,
      service_categories!inner (
        category_id,
        categories ( id, name )
      ),
      service_sub_categories (
        sub_categories ( id, name )
      )
    `,
        { count: "exact" }).eq('status', true)

    // Apply filters
    if (search) {
        dbQuery = dbQuery.or(
            `service_name.ilike.%${search}%,service_tagline.ilike.%${search}%,service_tagline.ilike.%${search}%,type_of_service.ilike.%${search}%`
        )
    }


    if (category.length > 0) {
        dbQuery = dbQuery.in('service_categories.category_id', category)
    }



    if (consultationType.length > 0) {
        dbQuery = dbQuery.in('free_consultation', consultationType)
    }

    if (turnaroundTime.length > 0) {
        dbQuery = dbQuery.in('turnaround_time', turnaroundTime)
    }

    if (serviceType.length > 0) {
        dbQuery = dbQuery.in('type_of_service', serviceType)
    }



    if (region.includes('global')) {
        region = ['malaysia', 'singapore', 'global']
    }

    if (region.length > 0) {
        dbQuery = dbQuery.or(
            region.map(r => `servers.cs.{${r}}`).join(',')
        )
    }



    // Sorting
    switch (sortBy) {
        case 'mostPopular':
        case 'highestRated':
            dbQuery = dbQuery.order('rating', { ascending: false })
            break
        case 'newest':
            dbQuery = dbQuery.order('created_at', { ascending: false })
            break
        case 'priceLowToHigh':
            dbQuery = dbQuery.order('pricing', { ascending: true })
            break
        case 'priceHighToLow':
            dbQuery = dbQuery.order('pricing', { ascending: false })
            break
    }

    // Pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum - 1

    dbQuery = dbQuery.range(from, to)

    const { data: services, count, error } = await dbQuery

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }

    return {
        services,
        filters: {
            search,
            category,
            sortBy,
            consultationType,
            turnaroundTime,
            serviceType,
        },
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil((count || 0) / limitNum),
            totalItems: count || 0,
            itemsPerPage: limitNum,
            hasNextPage: pageNum * limitNum < (count || 0),
            hasPrevPage: pageNum > 1,
            nextPage: pageNum * limitNum < (count || 0) ? pageNum + 1 : null,
            prevPage: pageNum > 1 ? pageNum - 1 : null,
        },
    }
})
