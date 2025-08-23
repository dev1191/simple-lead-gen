// server/api/tools.get.ts
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
    toolType = [],
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

  if (typeof toolType === 'string') {
    try {
      // if query comes like ?category=["a","b"]
      toolType = JSON.parse(toolType)
    } catch {
      // if query comes like ?category=a
      toolType = [toolType]
    }
  }

  if (!Array.isArray(toolType)) {
    toolType = []
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


  let dbQuery = client.from('tools').select('*', { count: 'exact' })

  // Apply filters
  if (search) {
    dbQuery = dbQuery.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,tagline.ilike.%${search}%,problem_solved.ilike.%${search}%`
    )
  }

  if (category.length > 0) {
    dbQuery = dbQuery.in('category', category)
  }



  if (consultationType.length > 0) {
    dbQuery = dbQuery.in('free_trail', consultationType)
  }

  if (toolType.length > 0) {
    dbQuery = dbQuery.in('pricing_model', toolType)
  }

  if (region.length > 0) {
    dbQuery = dbQuery.contains('operate', region)
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

  const { data: tools, count, error } = await dbQuery

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    tools,
    filters: {
      search,
      category,
      sortBy,
      consultationType,
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
