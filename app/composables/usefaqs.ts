// composables/useFaqs.ts
import { useSupabaseClient } from '#imports'
import type { Faq } from '~/shared/types'

export function useFaqs() {
    const supabase = useSupabaseClient()

    // Shared state
    const faqs = useState('blogFaqs', () => [] as any[])
    const loading = useState('blogFaqsLoading', () => false)
    const totalCount = useState('blogFaqsTotalCount', () => 0)
    const currentPage = useState('blogFaqsCurrentPage', () => 1)
    const pageSize = useState('blogFaqsPageSize', () => 10)

    const filters = useState('blogFaqsFilters', () => ({
        search: '',
    }))

    const sort = useState('blogFaqsSort', () => ({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
    }))

    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query
    const buildQuery = (category: string) => {
        let query = supabase
            .from('faqs')
            .select(`
        *
      `, { count: 'exact' })
            .eq('category', category)

        if (filters.value.search) {
            query = query.or(`question.ilike.%${filters.value.search}%,answer.ilike.%${filters.value.search}%`)
        }


        const ascending = sort.value.order === 'asc'
        return query.order(sort.value.field, { ascending })
    }

    // Fetch Faqs
    const fetchFaqs = async (category: string) => {
        loading.value = true
        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery(category)
            const { data, error: err, count } = await query.range(from, to)

            if (err) throw err

            faqs.value = data || []
            totalCount.value = count || 0
        } catch (err) {
            console.error('Error fetching Faqs:', err)
            faqs.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchFaqs()
    }

    const updateFilter = (key: string, value: any) => {
        (filters.value as any)[key] = value
        currentPage.value = 1
        fetchFaqs()
    }

    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1
        fetchFaqs()
    }

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchFaqs()
        }
    }

    const resetFilters = async () => {
        filters.value = {
            search: '',
        }
        sort.value = { field: 'created_at', order: 'desc' }
        currentPage.value = 1
        await fetchFaqs()
    }

    const createFaq = async (FaqData: Faq) => {
        try {

            const { data, error } = await supabase
                .from('faqs')
                .insert([{
                    ...FaqData,
                }])
                .select()

            if (!error) await fetchFaqs()

            return { data, error }
        } catch (err) {
            console.error('Error creating blog Faq:', err)
            return { data: null, error: err }
        }
    }

    const updateFaq = async (FaqId: string, updateData: Faq) => {
        try {

            let updatePayload = { ...updateData }

            const { data, error } = await supabase
                .from('faqs')
                .update(updatePayload)
                .eq('id', FaqId)
                .select()

            if (!error) await fetchFaqs()

            return { data, error }
        } catch (err) {
            console.error('Error updating blog Faq:', err)
            return { data: null, error: err }
        }
    }

    const deleteFaq = async (FaqId: string) => {
        try {

            const { data, error } = await supabase
                .from('faqs')
                .delete()
                .eq('id', FaqId)

            if (!error) await fetchFaqs()

            return { data, error }
        } catch (err) {
            console.error('Error deleting blog Faq:', err)
            return { data: null, error: err }
        }
    }



    return {
        faqs,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchFaqs,
        updateSearch,
        updateFilter,
        updateSort,
        changePage,
        resetFilters,
        createFaq,
        updateFaq,
        deleteFaq
    }
}
