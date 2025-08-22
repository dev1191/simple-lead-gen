// server/api/tools.get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const client = await serverSupabaseClient(event)

  const {
    page = 1,
    limit = 24,
    search = '',
    category = '',
    sortBy = 'newest',
    toolType = '',
    minPrice = '',
    maxPrice = '',
    minRating = '',
    consultationType = '',
    tags = '',
    region = ''
  } = query

  let dbQuery = client.from('tools').select('*', { count: 'exact' })

  // Apply filters
  if (search) {
    dbQuery = dbQuery.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`
    )
  }

  if (category) {
    dbQuery = dbQuery.eq('category', category)
  }

  if (minPrice) {
    dbQuery = dbQuery.gte('pricing', parseInt(minPrice))
  }
  if (maxPrice) {
    dbQuery = dbQuery.lte('pricing', parseInt(maxPrice))
  }

  if (minRating) {
    dbQuery = dbQuery.gte('rating', parseFloat(minRating))
  }

  if (consultationType) {
    dbQuery = dbQuery.eq('free_trail', consultationType === 'Yes' ? true : false)
  }

  if (toolType) {
    dbQuery = dbQuery.eq('pricing_model', toolType)
  }

  if (region) {
    dbQuery = dbQuery.contains('operate', [region])
  }

  if (tags) {
    const tagArray = tags.split(',').map((tag) => tag.trim())
    // Assuming `tags` is stored as a Postgres array
    dbQuery = dbQuery.contains('tags', tagArray)
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
      dbQuery = dbQuery.order('price', { ascending: true })
      break
    case 'priceHighToLow':
      dbQuery = dbQuery.order('price', { ascending: false })
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
      minPrice,
      maxPrice,
      minRating,
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
