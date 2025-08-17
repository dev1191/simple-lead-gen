// composables/useBlogVendors.ts
import { useSupabaseClient } from '#imports'
import type { Vendor } from '~/shared/types/vendor'
import { slugify } from '../shared/utils'

export function useVendors() {
    const supabase = useSupabaseClient()

    // Shared state
    const vendors = useState('blogVendors', () => [] as any[])
    const lists = useState('vendorLists', () => [] as Vendor[])
    const loading = useState('blogVendorsLoading', () => false)
    const totalCount = useState('blogVendorsTotalCount', () => 0)
    const currentPage = useState('blogVendorsCurrentPage', () => 1)
    const pageSize = useState('blogVendorsPageSize', () => 10)
    const activeCount = useState('blogVendorsactiveCount', () => 0)
    const inactiveCount = useState('blogVendorsinactiveCount', () => 0)
    const error = useState('blogVendorsError', () => null as any)

    const filters = useState('blogVendorsFilters', () => ({
        search: '',
        name: '',
        email: '',
        status: '',
    }))

    const sort = useState('blogVendorsSort', () => ({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
    }))

    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query
    const buildQuery = () => {
        let query = supabase
            .from('vendors')
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

    // Fetch Vendors
    const fetchVendors = async () => {
        loading.value = true
        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery()
            const { data, error: err, count } = await query.range(from, to)

            if (err) throw err

            vendors.value = data || []
            totalCount.value = count || 0
            await fetchCounts()
        } catch (err) {
            console.error('Error fetching Vendors:', err)
            vendors.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchVendors()
    }

    const updateFilter = (key: string, value: any) => {
        (filters.value as any)[key] = value
        currentPage.value = 1
        fetchVendors()
    }

    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1
        fetchVendors()
    }

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchVendors()
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
        await fetchVendors()
    }

    const createVendor = async (VendorData: any) => {
        try {
            //  Check if vendor with this email already exists
            const { data: existingVendor, error: checkError } = await supabase
                .from("vendors")
                .select("*")
                .eq("email", VendorData.email)
                .maybeSingle();

            if (checkError) throw checkError;

            //  If exists, return existing vendor
            if (existingVendor) {
                return { data: [existingVendor], error: null };
            }

            //  Otherwise, insert new vendor
            const { data, error } = await supabase
                .from("vendors")
                .insert([VendorData])
                .select();

            if (!error) await fetchVendors();

            return { data, error };
        } catch (err) {
            console.error("Error creating Vendor:", err);
            return { data: null, error: err };
        }
    }

    const updateVendor = async (VendorId: string, updateData: any) => {
        try {

            console.log("VendorId", VendorId)
            let updatePayload = { ...updateData }

            const { data, error } = await supabase
                .from('vendors')
                .update(updatePayload)
                .eq('id', VendorId)
                .select()

            if (!error) await fetchVendors()

            return { data, error }
        } catch (err) {
            console.error('Error updating vendor:', err)
            return { data: null, error: err }
        }
    }

    const deleteVendor = async (VendorId: string) => {
        try {

            const { data, error } = await supabase
                .from('vendors')
                .delete()
                .eq('id', VendorId)

            if (!error) await fetchVendors()

            return { data, error }
        } catch (err) {
            console.error('Error deleting blog Vendor:', err)
            return { data: null, error: err }
        }
    }

    const fetchCounts = async () => {
        loading.value = true
        error.value = null

        const { count: draft, error: errDraft } = await supabase
            .from('vendors')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'Active')

        if (errDraft) {
            error.value = errDraft
            loading.value = false
            return
        }

        const { count: published, error: errPublished } = await supabase
            .from('vendors')
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


    const getVendors = async () => {
        loading.value = true
        try {
            const { data, error: err } = await supabase
                .from('vendors')
                .select(`id,name,email)`, { count: 'exact' })
                .eq('status','Active')

            if (err) throw err

            lists.value = data || []

        } catch (err) {
            console.error('Error fetching posts:', err)
            lists.value = []

        } finally {
            loading.value = false
        }
    }


    return {
        activeCount,
        inactiveCount,
        lists,
        vendors,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchVendors,
        updateSearch,
        updateFilter,
        updateSort,
        fetchCounts,
        getVendors,
        changePage,
        resetFilters,
        createVendor,
        updateVendor,
        deleteVendor
    }
}
