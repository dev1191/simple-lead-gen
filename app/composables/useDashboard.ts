

export function useDashboard() {
  const supabase = useSupabaseClient()

  // State
  const leadsThisMonth = ref<number>(0)
  const activeServices = ref<number>(0)
  const totalVendors = ref<number>(0)
  const chartData = ref<{ month: string; Leads: number; "Active Services": number }[]>([])

  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)

  // Fetch functions
  async function fetchLeadsThisMonth() {
    const { data, error: err } = await supabase
      .from("leads")
      .select("id, created_at")

    if (err) {
      error.value = err.message
      return
    }

    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    leadsThisMonth.value = (data ?? []).filter((lead) => {
      const d = new Date(lead.created_at)
      return d.getMonth() === month && d.getFullYear() === year
    }).length
  }

  async function fetchActiveServices() {
    const { count, error: err } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("status", true)

    if (err) {
      error.value = err.message
      return
    }
    activeServices.value = count ?? 0
  }

  async function fetchTotalVendors() {
    const { count, error: err } = await supabase
      .from("vendors")
      .select("*", { count: "exact", head: true })

    if (err) {
      error.value = err.message
      return
    }
    totalVendors.value = count ?? 0
  }

  async function fetchMonthlyLeadsTrend() {
    // Fetch leads
    const { data: leads, error: err1 } = await supabase
      .from("leads")
      .select("id, created_at")

    // Fetch services
    const { data: services, error: err2 } = await supabase
      .from("services")
      .select("id, created_at")

    if (err1 || err2) {
      error.value = err1?.message ?? err2?.message ?? "Unknown error"
      return
    }

    // Group leads by month
    const groupedLeads: Record<string, number> = {}
    ;(leads ?? []).forEach((lead) => {
      const d = new Date(lead.created_at)
      const key = d.toLocaleString("default", { month: "short" })
      groupedLeads[key] = (groupedLeads[key] || 0) + 1
    })

    // Group services by month
    const groupedServices: Record<string, number> = {}
    ;(services ?? []).forEach((srv) => {
      const d = new Date(srv.created_at)
      const key = d.toLocaleString("default", { month: "short" })
      groupedServices[key] = (groupedServices[key] || 0) + 1
    })

    // Merge into one dataset
    const months = Array.from(new Set([...Object.keys(groupedLeads), ...Object.keys(groupedServices)]))

    chartData.value = months.map((month) => ({
      month,
      "Leads": groupedLeads[month] || 0,
      "Active Services": groupedServices[month] || 0
    }))
  }

  // Fetch all
  async function fetchDashboard() {
    loading.value = true
    error.value = null
    await Promise.all([
      fetchLeadsThisMonth(),
      fetchActiveServices(),
      fetchTotalVendors(),
      fetchMonthlyLeadsTrend()
    ])
    loading.value = false
  }

  // Auto fetch on mount
  onMounted(fetchDashboard)

  return {
    leadsThisMonth,
    activeServices,
    totalVendors,
    chartData,
    loading,
    error,
    fetchDashboard
  }
}
