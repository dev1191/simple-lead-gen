// composables/useDashboard.ts

import { useIntervalFn } from "@vueuse/core"

export interface DashboardKPIs {
  totalLeads: number
  totalLeadsThisMonth: number
  activeServices: number
  totalServices: number
  toolClicks: number
  newListingsThisMonth: number
  leadsGrowth: number // percentage change from last month
  servicesGrowth: number
}

export interface MonthlyLeadsData {
  month: string
  leads: number
  date: Date
}

export interface TopCategory {
  category: string
  count: number
  percentage: number
}

export interface DashboardAlert {
  id: string
  type: 'warning' | 'info' | 'error'
  title: string
  message: string
  action?: string
  actionLink?: string
}

export interface DashboardData {
  kpis: DashboardKPIs
  monthlyLeads: MonthlyLeadsData[]
  topCategories: TopCategory[]
  alerts: DashboardAlert[]
  loading: boolean
  error: string | null
}

export const useDashboard = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Reactive dashboard data
  const dashboardData = ref<DashboardData>({
    kpis: {
      totalLeads: 0,
      totalLeadsThisMonth: 0,
      activeServices: 0,
      totalServices: 0,
      toolClicks: 0,
      newListingsThisMonth: 0,
      leadsGrowth: 0,
      servicesGrowth: 0
    },
    monthlyLeads: [],
    topCategories: [],
    alerts: [],
    loading: false,
    error: null
  })

  // Helper function to get date ranges
  const getDateRanges = () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    
    return {
      startOfMonth: startOfMonth.toISOString(),
      startOfLastMonth: startOfLastMonth.toISOString(),
      endOfLastMonth: endOfLastMonth.toISOString(),
      startOfYear: startOfYear.toISOString()
    }
  }

  // Fetch KPIs
  const fetchKPIs = async (): Promise<DashboardKPIs> => {
    const { startOfMonth, startOfLastMonth, endOfLastMonth } = getDateRanges()
    
    try {
      // Fetch leads data
      const [
        { count: totalLeads },
        { count: leadsThisMonth },
        { count: leadsLastMonth },
        { count: activeServices },
        { count: totalServices },
        { count: newListingsThisMonth },
        { count: totalToolClicks }
      ] = await Promise.all([
        // Total leads
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true }),
        
        // Leads this month
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth),
        
        // Leads last month (for growth calculation)
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfLastMonth)
          .lt('created_at', startOfMonth),
        
        // Active services
        supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('status', true),
        
        // Total services
        supabase
          .from('services')
          .select('*', { count: 'exact', head: true }),
        
        // New listings this month
        supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth),
        
        // Tool clicks (if tracking exists)
        supabase
          .from('tool_clicks')
          .select('clicks', { count: 'exact', head: true })
          .gte('created_at', startOfMonth)
          .then(result => ({ count: result.count || 0 }))
          .catch(() => ({ count: 0 })) // Handle if table doesn't exist
      ])

      // Calculate growth percentages
      const leadsGrowth = leadsLastMonth ? 
        ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100 : 0
      
      const servicesGrowth = 0 // You can implement this similarly if needed

      return {
        totalLeads: totalLeads || 0,
        totalLeadsThisMonth: leadsThisMonth || 0,
        activeServices: activeServices || 0,
        totalServices: totalServices || 0,
        toolClicks: totalToolClicks || 0,
        newListingsThisMonth: newListingsThisMonth || 0,
        leadsGrowth: Math.round(leadsGrowth * 100) / 100,
        servicesGrowth
      }
    } catch (err) {
      console.error('Error fetching KPIs:', err)
      throw new Error('Failed to fetch KPIs')
    }
  }

  // Fetch monthly leads trend (last 6 months)
  const fetchMonthlyLeads = async (): Promise<MonthlyLeadsData[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_monthly_leads_trend', { months_back: 6 })
        .order('month', { ascending: true })

      if (error) {
        // Fallback if RPC doesn't exist - fetch raw data and group
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('created_at')
          .gte('created_at', sixMonthsAgo.toISOString())
          .order('created_at', { ascending: true })

        if (leadsError) throw leadsError

        // Group by month
        const monthlyMap = new Map<string, number>()
        leadsData?.forEach(lead => {
          const date = new Date(lead.created_at)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1)
        })

        // Convert to array format
        return Array.from(monthlyMap.entries()).map(([monthKey, leads]) => ({
          month: monthKey,
          leads,
          date: new Date(monthKey + '-01')
        }))
      }

      return data?.map((item: any) => ({
        month: item.month,
        leads: item.leads,
        date: new Date(item.month + '-01')
      })) || []
    } catch (err) {
      console.error('Error fetching monthly leads:', err)
      return []
    }
  }

  // Fetch top categories
  const fetchTopCategories = async (): Promise<TopCategory[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('category')
        .not('category', 'is', null)

      if (error) throw error

      // Count categories
      const categoryCount = new Map<string, number>()
      const total = data?.length || 0
      
      data?.forEach(service => {
        if (service.category) {
          categoryCount.set(service.category, (categoryCount.get(service.category) || 0) + 1)
        }
      })

      // Convert to sorted array
      return Array.from(categoryCount.entries())
        .map(([category, count]) => ({
          category,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5) // Top 5
    } catch (err) {
      console.error('Error fetching top categories:', err)
      return []
    }
  }

  // Generate alerts based on data
  const generateAlerts = async (): Promise<DashboardAlert[]> => {
    const alerts: DashboardAlert[] = []
    
    try {
      // Check for paused services
      const { count: pausedServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'paused')

      if (pausedServices && pausedServices > 0) {
        alerts.push({
          id: 'paused-services',
          type: 'warning',
          title: 'Services Paused',
          message: `${pausedServices} service${pausedServices > 1 ? 's are' : ' is'} currently paused`,
          action: 'Review Services',
          actionLink: '/admin/services?status=paused'
        })
      }

      // Check for services with no recent activity (example)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { count: inactiveServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .lt('updated_at', thirtyDaysAgo.toISOString())

      if (inactiveServices && inactiveServices > 0) {
        alerts.push({
          id: 'inactive-services',
          type: 'info',
          title: 'Inactive Services',
          message: `${inactiveServices} active service${inactiveServices > 1 ? 's haven\'t' : ' hasn\'t'} been updated in 30 days`,
          action: 'Review Activity',
          actionLink: '/admin/services?filter=inactive'
        })
      }

      // Check for low tool clicks (if applicable)
      const { data: toolStats } = await supabase
        .from('tool_clicks')
        .select('tool_id, clicks')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('clicks', { ascending: true })
        .limit(1)
        .single()

      if (toolStats && toolStats.clicks < 5) {
        alerts.push({
          id: 'low-tool-clicks',
          type: 'warning',
          title: 'Low Tool Engagement',
          message: 'Some tools have very low click-through rates this week',
          action: 'View Analytics',
          actionLink: '/admin/tools/analytics'
        })
      }

    } catch (err) {
      console.error('Error generating alerts:', err)
    }

    return alerts
  }

  // Main fetch function
  const fetchDashboardData = async () => {
    loading.value = true
    error.value = null
    dashboardData.value.loading = true

    try {
      const [kpis, monthlyLeads, topCategories, alerts] = await Promise.all([
        fetchKPIs(),
        fetchMonthlyLeads(),
        fetchTopCategories(),
        generateAlerts()
      ])

      dashboardData.value = {
        kpis,
        monthlyLeads,
        topCategories,
        alerts,
        loading: false,
        error: null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      error.value = errorMessage
      dashboardData.value.error = errorMessage
      dashboardData.value.loading = false
    } finally {
      loading.value = false
    }
  }

  // Refresh specific KPI
  const refreshKPIs = async () => {
    try {
      const kpis = await fetchKPIs()
      dashboardData.value.kpis = kpis
    } catch (err) {
      console.error('Error refreshing KPIs:', err)
    }
  }

  // Auto-refresh functionality
  const { pause, resume } = useIntervalFn(() => {
    refreshKPIs()
  }, 30000) // Refresh KPIs every 30 seconds

  // Cleanup on unmount
  onUnmounted(() => {
    pause()
  })

  return {
    // State
    dashboardData: readonly(dashboardData),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchDashboardData,
    refreshKPIs,
    
    // Auto-refresh controls
    pauseAutoRefresh: pause,
    resumeAutoRefresh: resume
  }
}