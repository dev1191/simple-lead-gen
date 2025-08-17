// composables/useLeads.ts
import { useSupabaseClient } from '#imports'
import type { Lead } from '~/shared/types/leads'

export function useLeads() {
    const supabase = useSupabaseClient()

    // Shared state
    const leads = useState('Leads', () => [] as any[])
    const loading = useState('LeadsLoading', () => false)
    const totalCount = useState('LeadsTotalCount', () => 0)
    const currentPage = useState('LeadsCurrentPage', () => 1)
    const pageSize = useState('LeadsPageSize', () => 10)

    const filters = useState('LeadsFilters', () => ({
        search: '',
    }))

    const sort = useState('LeadsSort', () => ({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
    }))

    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query
    const buildQuery = () => {
        let query = supabase
            .from('leads')
            .select(`
        *,
        vendors(id,name,email)
      `, { count: 'exact' })

        if (filters.value.search) {
            query = query.or(`question.ilike.%${filters.value.search}%,answer.ilike.%${filters.value.search}%`)
        }


        const ascending = sort.value.order === 'asc'
        return query.order(sort.value.field, { ascending })
    }

    // Fetch Leads
    const fetchLeads = async () => {
        loading.value = true
        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery()
            const { data, error: err, count } = await query.range(from, to)

            if (err) throw err

            leads.value = data || []
            totalCount.value = count || 0
        } catch (err) {
            console.error('Error fetching Leads:', err)
            leads.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchLeads()
    }

    const updateFilter = (key: string, value: any) => {
        (filters.value as any)[key] = value
        currentPage.value = 1
        fetchLeads()
    }

    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1
        fetchLeads()
    }

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchLeads()
        }
    }

    const resetFilters = async () => {
        filters.value = {
            search: '',
        }
        sort.value = { field: 'created_at', order: 'desc' }
        currentPage.value = 1
        await fetchLeads()
    }

    const createLead = async (LeadData: Lead) => {
        try {

            const { data, error } = await supabase
                .from('leads')
                .insert([{
                    ...LeadData,
                }])
                .select()

            if (!error) await fetchLeads()

            return { data, error }
        } catch (err) {
            console.error('Error creating  Lead:', err)
            return { data: null, error: err }
        }
    }

    const updateLead = async (LeadId: string, updateData: Lead) => {
        try {

            let updatePayload = { ...updateData }

            const { data, error } = await supabase
                .from('leads')
                .update(updatePayload)
                .eq('id', LeadId)
                .select()

            if (!error) await fetchLeads()

            return { data, error }
        } catch (err) {
            console.error('Error updating  Lead:', err)
            return { data: null, error: err }
        }
    }

    const deleteLead = async (LeadId: string) => {
        try {

            const { data, error } = await supabase
                .from('leads')
                .delete()
                .eq('id', LeadId)

            if (!error) await fetchLeads()

            return { data, error }
        } catch (err) {
            console.error('Error deleting  Lead:', err)
            return { data: null, error: err }
        }
    }



    return {
        leads,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchLeads,
        updateSearch,
        updateFilter,
        updateSort,
        changePage,
        resetFilters,
        createLead,
        updateLead,
        deleteLead
    }
}
