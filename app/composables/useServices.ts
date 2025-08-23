// composables/useBlogServices.ts
import { useSupabaseClient } from '#imports'
import type { FilterOptions, Service } from '~/shared/types/service'
import { slugify } from '~/shared/utils'

export function useServices() {
    const supabase = useSupabaseClient()

    // Shared state
    const services = useState('blogServices', () => [] as any[])
    const categories = useState('Categories', () => [] as any[])
    const loading = useState('blogServicesLoading', () => false)
    const totalCount = useState('blogServicesTotalCount', () => 0)
    const currentPage = useState('blogServicesCurrentPage', () => 1)
    const pageSize = useState('blogServicesPageSize', () => 10)
    const activeCount = useState('blogServicesactiveCount', () => 0)
    const inactiveCount = useState('blogServicesinactiveCount', () => 0)
    const error = useState('blogServicesError', () => null as any)

    const filters = useState('blogServicesFilters', () => ({
        search: '',
        status: false
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
        *,
       vendors(id,name,email),
       service_categories(
            categories(id,name)
            )
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
            status: false

        }
        sort.value = { field: 'created_at', order: 'desc' }
        currentPage.value = 1
        await fetchServices()
    }

    const createService = async (ServiceData: any) => {
        try {

            const { createVendor } = useVendors();
            const { data: vendor, error: vendorError } = await createVendor({
                name: ServiceData.provider_name,
                email: ServiceData.provider_email,
            })


            if (vendorError) throw vendorError

            const serviceInsert: Service = [{
                service_name: ServiceData.service_name,
                service_tagline: ServiceData.service_tagline,
                logo_url: ServiceData.logo_url,
                banner_url: ServiceData.banner_url,
                description: ServiceData.description,
                business_types: ServiceData.business_types,
                type_of_service: ServiceData.type_of_service,
                highlights: ServiceData.highlights,
                included: ServiceData.included,
                currency_code: ServiceData.currency_code,
                pricing: ServiceData.pricing,
                turnaround_time: ServiceData.turnaround_time,
                free_consulatation: ServiceData.free_consulatation,
                url: ServiceData.url,
                client_logos: ServiceData.client_logos,
                servers: ServiceData.servers,
                vendor_id: vendor[0].id,
                slug: slugify(ServiceData.service_name)
            }];

            const { data: newService, error } = await supabase
                .from('services')
                .insert(serviceInsert)
                .select()


            if (ServiceData.service_categories && ServiceData.service_categories.length > 0) {
                const categoryAssociations = ServiceData.service_categories.map(categoryId => ({
                    service_id: newService[0].id,
                    category_id: categoryId.id
                }));

                const { error: categoryError } = await supabase
                    .from('service_categories') // Assuming this is your junction table
                    .insert(categoryAssociations)

                if (categoryError) {
                    await supabase.from('services').delete().eq('id', newService[0].id)
                    throw categoryError
                }

                // Prepare sub-category associations
                const subCategoryAssociations = ServiceData.service_categories.flatMap(category => {
                    return (category.sub_categories || []).map(subId => ({
                        service_id: newService[0].id,
                        sub_category_id: subId.id,
                    }))
                })

                if (subCategoryAssociations.length > 0) {
                    const { error: subCategoryError } = await supabase
                        .from('service_sub_categories')
                        .insert(subCategoryAssociations)

                    if (subCategoryError) {
                        // Rollback both category and service
                        await supabase.from('service_categories').delete().eq('service_id', newService[0].id)
                        await supabase.from('services').delete().eq('id', newService[0].id)
                        throw subCategoryError
                    }
                }
            }


            if (!error) await fetchServices()

            return { newService, error }
        } catch (err) {
            console.error('Error creating blog Service:', err)
            return { data: null, error: err }
        }
    }

    const updateService = async (serviceId: string, ServiceData: any) => {
        try {
            const { updateVendor } = useVendors();

            // 1️⃣ Update Vendor
            const { error: vendorError } = await updateVendor(ServiceData.vendor_id, {
                name: ServiceData.provider_name,
                email: ServiceData.provider_email,
            });

            if (vendorError) throw vendorError;

            // 2️⃣ Update Service
            const serviceUpdate: Service = {
                service_name: ServiceData.service_name,
                service_tagline: ServiceData.service_tagline,
                logo_url: ServiceData.logo_url,
                banner_url: ServiceData.banner_url,
                description: ServiceData.description,
                business_types: ServiceData.business_types,
                type_of_service: ServiceData.type_of_service,
                highlights: ServiceData.highlights,
                included: ServiceData.included,
                currency_code: ServiceData.currency_code,
                pricing: ServiceData.pricing,
                turnaround_time: ServiceData.turnaround_time,
                free_consulatation: ServiceData.free_consulatation,
                url: ServiceData.url,
                client_logos: ServiceData.client_logos,
                servers: ServiceData.servers,
                vendor_id: ServiceData.vendor_id,
                slug: slugify(ServiceData.service_name)
            };

            const { error: serviceError } = await supabase
                .from("services")
                .update(serviceUpdate)
                .eq("id", serviceId);

            if (serviceError) throw serviceError;

            // 3️⃣ Update Categories (reset then insert)
            await supabase.from("service_categories").delete().eq("service_id", serviceId);

            if (ServiceData.service_categories?.length > 0) {
                const categoryAssociations = ServiceData.service_categories.map((categoryId) => ({
                    service_id: serviceId,
                    category_id: categoryId.id,
                }));

                const { error: categoryError } = await supabase
                    .from("service_categories")
                    .insert(categoryAssociations);

                if (categoryError) throw categoryError;
            }

            // 4️⃣ Update Sub-Categories (reset then insert)
            await supabase.from("service_sub_categories").delete().eq("service_id", serviceId);

            const subCategoryAssociations = ServiceData.service_categories?.flatMap((category) =>
                (category.sub_categories || []).map((subId) => ({
                    service_id: serviceId,
                    sub_category_id: subId.id,
                }))
            ) || [];

            if (subCategoryAssociations.length > 0) {
                const { error: subCategoryError } = await supabase
                    .from("service_sub_categories")
                    .insert(subCategoryAssociations);

                if (subCategoryError) throw subCategoryError;
            }

            // 5️⃣ Refresh data
            await fetchServices();

            return { success: true, error: null };
        } catch (err) {
            console.error("Error updating Service:", err);
            return { success: false, error: err };
        }
    };

    const updateStatus = async (serviceId: string, status: boolean) => {
        try {

            let updatePayload = { status }

            const { data, error } = await supabase
                .from('services')
                .update(updatePayload)
                .eq('id', serviceId)
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


    // get page by slug
    async function getService(serviceId: string): Promise<Service | null> {
        const { data, error } = await supabase
            .from('services')
            .select(`
                *,
            vendors(id,name,email),
            service_categories(
            categories(id,name)
            ),
            service_sub_categories (
                sub_categories(
                    id,
                    name,
                    category_id
                )
            )
            `)
            .eq('id', serviceId)
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw error
        }

        return transformServiceData(data)
    }

    const fetchCounts = async () => {
        loading.value = true
        error.value = null

        const { count: draft, error: errDraft } = await supabase
            .from('services')
            .select('id', { count: 'exact', head: true })
            .eq('status', true)

        if (errDraft) {
            error.value = errDraft
            loading.value = false
            return
        }

        const { count: published, error: errPublished } = await supabase
            .from('services')
            .select('id', { count: 'exact', head: true })
            .eq('status', false)

        if (errPublished) {
            error.value = errPublished
            loading.value = false
            return
        }

        activeCount.value = draft ?? 0
        inactiveCount.value = published ?? 0
        loading.value = false
    }


    const fetchCategories = async () => {
        loading.value = true
        try {
            const { data, error: err } = await supabase
                .from('categories')
                .select(`*,sub_categories(id,name)`, { count: 'exact' })

            if (err) throw err

            categories.value = data || []

        } catch (err) {
            console.error('Error fetching posts:', err)
            categories.value = []

        } finally {
            loading.value = false
        }
    }


    // Transform the data to match your original structure
    function transformServiceData(serviceData: any) {
        // Create a map to group subcategories by their parent category
        const categoryMap = new Map();

        // First, add all categories
        serviceData.service_categories.forEach(sc => {
            const category = sc.categories;
            categoryMap.set(category.id, {
                id: category.id,
                name: category.name,
                sub_categories: []
            });
        });


        // Then, add subcategories to their respective parent categories
        serviceData.service_sub_categories.forEach(ssc => {
            const subCategory = ssc.sub_categories;
            const parentCategory = categoryMap.get(subCategory.category_id);
            if (parentCategory) {
                parentCategory.sub_categories.push({
                    id: subCategory.id,
                    name: subCategory.name
                });
            }
        });

        // Convert categories map to array and clean up service data
        const transformedCategories = Array.from(categoryMap.values());

        // Return the service with clean structure (remove the raw relationships)
        const {
            service_categories,
            service_sub_categories,
            ...cleanServiceData
        } = serviceData;

        return {
            ...cleanServiceData,
            provider_name: serviceData.vendors.name,
            provider_email: serviceData.vendors.email,
            service_categories: transformedCategories,
            vendor_id: serviceData.vendors.id
        };
    }


 


    return {
        activeCount,
        inactiveCount,
        services,
        categories,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchServices,
        fetchCategories,
        updateSearch,
        updateFilter,
        updateSort,
        fetchCounts,
        changePage,
        resetFilters,
        getService,
        createService,
        updateService,
        updateStatus,
        deleteService
    }
}
