import { serverSupabaseClient } from '#supabase/server';
// server/api/tools/[id]/status.patch.ts
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  try {
    // Validate the request
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Item ID is required'
      })
    }

    if (typeof body.is_featured !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'is_featured must be a boolean'
      })
    }

    // Update the item in Supabase
    const { data, error } = await supabase
      .from('tools') // Replace 'tools' with your table name
      .update({ is_featured: body.is_featured })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update item status in database'
      })
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update item status'
    })
  }
})