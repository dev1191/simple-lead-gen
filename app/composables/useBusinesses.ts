// composables/useBusinesses.ts
import { useSupabaseClient } from '#imports'

export function useBusinesses() {
    const supabase = useSupabaseClient()

    // Shared state
    const businesses = useState('business', () => [] as any[])
    const loading = useState('businessLoading', () => false)
    const totalCount = useState('businessTotalCount', () => 0)
    const currentPage = useState('businessCurrentPage', () => 1)
    const pageSize = useState('businessPageSize', () => 10)

    const filters = useState('businessFilters', () => ({
        search: '',
    }))

    const sort = useState('businessSort', () => ({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
    }))

    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query
    const buildQuery = () => {
        let query = supabase
            .from('business_lists')
            .select(`
        *
      `, { count: 'exact' })

        if (filters.value.search) {
            query = query.or(`business_name.ilike.%${filters.value.search}%,email.ilike.%${filters.value.search}%,phone.ilike.%${filters.value.search}%`)
        }


        const ascending = sort.value.order === 'asc'
        return query.order(sort.value.field, { ascending })
    }

    // Fetch businesses
    const fetchBusiness = async () => {
        loading.value = true
        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery()
            const { data, error: err, count } = await query.range(from, to)

            if (err) throw err

            businesses.value = data || []
            totalCount.value = count || 0

        } catch (err) {
            console.error('Error fetching businesses:', err)
            businesses.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchBusiness()
    }

    const updateFilter = (key: string, value: any) => {
        (filters.value as any)[key] = value
        currentPage.value = 1
        fetchBusiness()
    }

    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1
        fetchBusiness()
    }

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchBusiness()
        }
    }

    const resetFilters = async () => {
        filters.value = {
            search: ''
        }
        sort.value = { field: 'created_at', order: 'desc' }
        currentPage.value = 1
        await fetchBusiness()
    }



    return {

        businesses,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchBusiness,
        updateSearch,
        updateFilter,
        updateSort,
        changePage,
        resetFilters,

    }
}
