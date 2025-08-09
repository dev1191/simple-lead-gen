// stores/blogPosts.ts
export const useBlogPostsStore = defineStore('blogPosts', () => {
    const posts = ref([])
    const loading = ref(false)
    const totalCount = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)

    // Filters and search state
    const filters = ref({
        search: '',
        category: '',
        status: 'published',
        author: '',
        tags: []
    })

    // Sorting state
    const sort = ref({
        field: 'created_at',
        order: 'desc' // 'asc' or 'desc'
    })

    // Computed for total pages
    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query based on current filters and sort
    const buildQuery = (supabase: any) => {
        let query = supabase
            .from('blog_posts')
            .select(`
        *,
        categories:category_id (
          id,
          name,
          slug
        ),
        users:author_id (
          id,
          user_metadata,
          email,
          avatar_url
        )
      `, { count: 'exact' })

        // Apply search filter
        if (filters.value.search) {
            query = query.or(`title.ilike.%${filters.value.search}%,content.ilike.%${filters.value.search}%,excerpt.ilike.%${filters.value.search}%`)
        }

        // Apply category filter
        if (filters.value.category) {
            query = query.eq('category_id', filters.value.category)
        }

        // Apply status filter
        if (filters.value.status) {
            query = query.eq('status', filters.value.status)
        }

        // Apply author filter
        if (filters.value.author) {
            query = query.eq('author_id', filters.value.author)
        }

        // Apply tags filter (assuming tags is a JSON array)
        if (filters.value.tags.length > 0) {
            query = query.contains('tags', filters.value.tags)
        }

        // Apply sorting
        const ascending = sort.value.order === 'asc'
        query = query.order(sort.value.field, { ascending })

        return query
    }

    const supabase = useSupabaseClient()

    // Fetch posts with current filters
    const fetchPosts = async () => {
        loading.value = true

        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery(supabase)
            const { data, error, count } = await query.range(from, to)

            if (error) throw error

            posts.value = data || []
            totalCount.value = count || 0
        } catch (error) {
            console.error('Error fetching posts:', error)
            posts.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    // Update search
    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1 // Reset to first page
        fetchPosts()
    }

    // Update filters
    const updateFilter = (key: string, value: any) => {
        filters.value[key] = value
        currentPage.value = 1 // Reset to first page
        fetchPosts()
    }

    // Update sorting
    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1 // Reset to first page
        fetchPosts()
    }

    // Change page
    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchPosts()
        }
    }

    // Reset all filters
    const resetFilters = () => {
        filters.value = {
            search: '',
            category: '',
            status: 'published',
            author: '',
            tags: []
        }
        sort.value = { field: 'created_at', order: 'desc' }
        currentPage.value = 1
        fetchPosts()
    }


    // Create new post
    const createPost = async (post: any) => {
        const { data, error } = await supabase
            .from('blog_posts')
            .insert(post)
            .select()
            .single()

        return { data, error }
    }

    // Update post
    const updatePost = async (id: string, updates: any) => {
        const { data, error } = await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        return { data, error }
    }

    // Delete post
    const deletePost = async (id: string) => {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id)

        return { error }
    }

    return {
        // State
        posts: readonly(posts),
        loading: readonly(loading),
        totalCount: readonly(totalCount),
        currentPage: readonly(currentPage),
        pageSize,
        totalPages,
        filters: readonly(filters),
        sort: readonly(sort),

        // Actions
        fetchPosts,
        updateSearch,
        updateFilter,
        updateSort,
        changePage,
        resetFilters,
        deletePost,
        updatePost,
        createPost
    }
})