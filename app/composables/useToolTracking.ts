export const useToolTracking = () => {
  const supabase = useSupabaseClient()

  const trackClick = async (toolId: string, clicks = 1) => {
    try {
      const { data, error } = await supabase
        .from("tool_clicks")
        .insert([
          {
            tool_id: toolId,
            clicks,
          },
        ])
        .select() // return inserted row if you want

      if (error) {
        console.error("Error tracking click:", error)
        return null
      }

      return data
    } catch (err) {
      console.error("Unexpected error tracking click:", err)
      return null
    }
  }

  return { trackClick }
}
