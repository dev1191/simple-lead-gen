// composables/useBlogServices.ts
import { useSupabaseClient } from '#imports'
import { slugify } from '../shared/utils'

export function useServices() {
    const supabase = useSupabaseClient()

    // Shared state
    const services = useState('blogServices', () => [] as any[])
    const loading = useState('blogServicesLoading', () => false)
    const totalCount = useState('blogServicesTotalCount', () => 0)
    const currentPage = useState('blogServicesCurrentPage', () => 1)
    const pageSize = useState('blogServicesPageSize', () => 10)
    const activeCount = useState('blogServicesactiveCount', () => 0)
    const inactiveCount = useState('blogServicesinactiveCount', () => 0)
    const error = useState('blogServicesError', () => null as any)

    const filters = useState('blogServicesFilters', () => ({
        search: '',
        name: '',
        email: '',
        status: '',
    }))

    const sort = useState('blogServicesSort', () => ({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
    }))

    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query
    const buildQuery = () => {
        let query = supabase
            .from('services')
            .select(`
        *
      `, { count: 'exact' })

        if (filters.value.search) {
            query = query.or(`name.ilike.%${filters.value.search}%,email.ilike.%${filters.value.search}%`)
        }

        if (filters.value.status) {
            query = query.eq('status', filters.value.status)
        }


        const ascending = sort.value.order === 'asc'
        return query.order(sort.value.field, { ascending })
    }

    // Fetch Services
    const fetchServices = async () => {
        loading.value = true
        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery()
            const { data, error: err, count } = await query.range(from, to)

            if (err) throw err

            services.value = data || []
            totalCount.value = count || 0
            await fetchCounts()
        } catch (err) {
            console.error('Error fetching Services:', err)
            services.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchServices()
    }

    const updateFilter = (key: string, value: any) => {
        (filters.value as any)[key] = value
        currentPage.value = 1
        fetchServices()
    }

    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1
        fetchServices()
    }

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchServices()
        }
    }

    const resetFilters = async () => {
        filters.value = {
            search: '',
            name: '',
            email: '',
            status: ''
        }
        sort.value = { field: 'created_at', order: 'desc' }
        currentPage.value = 1
        await fetchServices()
    }

    const createService = async (ServiceData: any, imageFile: File) => {
        try {

            const { data, error } = await supabase
                .from('services')
                .insert([{
                    ...ServiceData,
                }])
                .select()

            if (!error) await fetchServices()

            return { data, error }
        } catch (err) {
            console.error('Error creating blog Service:', err)
            return { data: null, error: err }
        }
    }

    const updateService = async (ServiceId: string, updateData: any, newImageFile = null) => {
        try {

            let updatePayload = { ...updateData }

            const { data, error } = await supabase
                .from('services')
                .update(updatePayload)
                .eq('id', ServiceId)
                .select()

            if (!error) await fetchServices()

            return { data, error }
        } catch (err) {
            console.error('Error updating blog Service:', err)
            return { data: null, error: err }
        }
    }

    const deleteService = async (ServiceId: string) => {
        try {

            const { data, error } = await supabase
                .from('services')
                .delete()
                .eq('id', ServiceId)

            if (!error) await fetchServices()

            return { data, error }
        } catch (err) {
            console.error('Error deleting blog Service:', err)
            return { data: null, error: err }
        }
    }

    const fetchCounts = async () => {
        loading.value = true
        error.value = null

        const { count: draft, error: errDraft } = await supabase
            .from('services')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'Active')

        if (errDraft) {
            error.value = errDraft
            loading.value = false
            return
        }

        const { count: published, error: errPublished } = await supabase
            .from('services')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'Inactive')

        if (errPublished) {
            error.value = errPublished
            loading.value = false
            return
        }

        activeCount.value = draft ?? 0
        inactiveCount.value = published ?? 0
        loading.value = false
    }

    return {
        activeCount,
        inactiveCount,
        services,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchServices,
        updateSearch,
        updateFilter,
        updateSort,
        fetchCounts,
        changePage,
        resetFilters,
        createService,
        updateService,
        deleteService
    }
}
