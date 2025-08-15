// composables/useTools.ts
import { useSupabaseClient } from '#imports'
import { slugify } from '../shared/utils'

export function useTools() {
    const supabase = useSupabaseClient()

    // Shared state
    const tools = useState('Tools', () => [] as any[])
    const loading = useState('ToolsLoading', () => false)
    const totalCount = useState('ToolsTotalCount', () => 0)
    const currentPage = useState('ToolsCurrentPage', () => 1)
    const pageSize = useState('ToolsPageSize', () => 10)
    const activeCount = useState('ToolsactiveCount', () => 0)
    const inactiveCount = useState('ToolsinactiveCount', () => 0)
    const error = useState('ToolsError', () => null as any)

    const filters = useState('ToolsFilters', () => ({
        search: '',
        name: '',
        email: '',
        status: '',
    }))

    const sort = useState('ToolsSort', () => ({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
    }))

    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query
    const buildQuery = () => {
        let query = supabase
            .from('tools')
            .select(`
        *
      `, { count: 'exact' })

        if (filters.value.search) {
            query = query.or(`name.ilike.%${filters.value.search}%,category.ilike.%${filters.value.search}%`)
        }

        if (filters.value.status) {
            query = query.eq('status', filters.value.status)
        }


        const ascending = sort.value.order === 'asc'
        return query.order(sort.value.field, { ascending })
    }

    // Fetch Tools
    const fetchTools = async () => {
        loading.value = true
        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery()
            const { data, error: err, count } = await query.range(from, to)

            if (err) throw err

            tools.value = data || []
            totalCount.value = count || 0
            await fetchCounts()
        } catch (err) {
            console.error('Error fetching Tools:', err)
            tools.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchTools()
    }

    const updateFilter = (key: string, value: any) => {
        (filters.value as any)[key] = value
        currentPage.value = 1
        fetchTools()
    }

    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1
        fetchTools()
    }

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchTools()
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
        await fetchTools()
    }

    const createTool = async (ToolData: any) => {
        try {
            //  Check if tool with this email already exists
            const { data: existingTool, error: checkError } = await supabase
                .from("tools")
                .select("*")
                .eq("email", ToolData.email)
                .maybeSingle();

            if (checkError) throw checkError;

            //  If exists, return existing tool
            if (existingTool) {
                return { data: [existingTool], error: null };
            }

            //  Otherwise, insert new tool
            const { data, error } = await supabase
                .from("tools")
                .insert(ToolData)
                .select();

            if (!error) await fetchTools();

            return { data, error };
        } catch (err) {
            console.error("Error creating Tool:", err);
            return { data: null, error: err };
        }
    }

    const updateTool = async (ToolId: string, updateData: any) => {
        try {

            console.log("ToolId",ToolId)
            let updatePayload = { ...updateData }

            const { data, error } = await supabase
                .from('tools')
                .update(updatePayload)
                .eq('id', ToolId)
                .select()

            if (!error) await fetchTools()

            return { data, error }
        } catch (err) {
            console.error('Error updating tool:', err)
            return { data: null, error: err }
        }
    }

    const deleteTool = async (ToolId: string) => {
        try {

            const { data, error } = await supabase
                .from('tools')
                .delete()
                .eq('id', ToolId)

            if (!error) await fetchTools()

            return { data, error }
        } catch (err) {
            console.error('Error deleting  Tool:', err)
            return { data: null, error: err }
        }
    }

    const fetchCounts = async () => {
        loading.value = true
        error.value = null

        const { count: draft, error: errDraft } = await supabase
            .from('tools')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'Active')

        if (errDraft) {
            error.value = errDraft
            loading.value = false
            return
        }

        const { count: published, error: errPublished } = await supabase
            .from('tools')
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
        tools,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchTools,
        updateSearch,
        updateFilter,
        updateSort,
        fetchCounts,
        changePage,
        resetFilters,
        createTool,
        updateTool,
        deleteTool
    }
}
