// composables/useBlogPosts.ts
import { useSupabaseClient } from '#imports'
import { slugify } from '../shared/utils'

export function useBlogPosts() {
    const supabase = useSupabaseClient()

    // Shared state
    const posts = useState('blogPosts', () => [] as any[])
    const loading = useState('blogPostsLoading', () => false)
    const totalCount = useState('blogPostsTotalCount', () => 0)
    const currentPage = useState('blogPostsCurrentPage', () => 1)
    const pageSize = useState('blogPostsPageSize', () => 10)
    const draftCount = useState('blogPostsDraftCount', () => 0)
    const publishedCount = useState('blogPostsPublishedCount', () => 0)
    const error = useState('blogPostsError', () => null as any)

    const filters = useState('blogPostsFilters', () => ({
        search: '',
        category: '',
        status: '',
        author: '',
        tags: [] as string[]
    }))

    const sort = useState('blogPostsSort', () => ({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
    }))

    const totalPages = computed(() =>
        Math.ceil(totalCount.value / pageSize.value)
    )

    // Build query
    const buildQuery = () => {
        let query = supabase
            .from('blog_posts')
            .select(`
        *,
        profiles(id,display_name,avatar_url)
      `, { count: 'exact' })

        if (filters.value.search) {
            query = query.or(`title.ilike.%${filters.value.search}%,content.ilike.%${filters.value.search}%`)
        }
        if (filters.value.category) {
            query = query.eq('category', filters.value.category)
        }
        if (filters.value.status) {
            query = query.eq('status', filters.value.status)
        }
        if (filters.value.author) {
            query = query.eq('profiles.display_name', filters.value.author)
        }
        if (filters.value.tags.length > 0) {
            query = query.contains('tags', filters.value.tags)
        }

        const ascending = sort.value.order === 'asc'
        return query.order(sort.value.field, { ascending })
    }

    // Fetch posts
    const fetchPosts = async () => {
        loading.value = true
        try {
            const from = (currentPage.value - 1) * pageSize.value
            const to = from + pageSize.value - 1

            const query = buildQuery()
            const { data, error: err, count } = await query.range(from, to)

            if (err) throw err

            posts.value = data || []
            totalCount.value = count || 0
            await fetchCounts()
        } catch (err) {
            console.error('Error fetching posts:', err)
            posts.value = []
            totalCount.value = 0
        } finally {
            loading.value = false
        }
    }

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchPosts()
    }

    const updateFilter = (key: string, value: any) => {
        (filters.value as any)[key] = value
        currentPage.value = 1
        fetchPosts()
    }

    const updateSort = (field: string, order: 'asc' | 'desc' = 'desc') => {
        sort.value = { field, order }
        currentPage.value = 1
        fetchPosts()
    }

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            fetchPosts()
        }
    }

    const resetFilters = async () => {
        filters.value = {
            search: '',
            category: '',
            status: 'published',
            author: '',
            tags: []
        }
        sort.value = { field: 'created_at', order: 'desc' }
        currentPage.value = 1
        await fetchPosts()
    }

    const createPost = async (postData: any, imageFile: File) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error('Not authenticated')

            let imageUrl = null
            if (imageFile) {
                const fileExt = imageFile.name.split(".").pop()
                const fileName = `${user.id}/${Date.now()}-${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(uploadData.path)

                imageUrl = publicUrl
            }

            const { data, error } = await supabase
                .from('blog_posts')
                .insert([{
                    ...postData,
                    slug: slugify(postData.title),
                    author_id: user.id,
                    image_url: imageUrl,
                }])
                .select()

            if (!error) await fetchPosts()

            return { data, error }
        } catch (err) {
            console.error('Error creating blog post:', err)
            return { data: null, error: err }
        }
    }

    const updatePost = async (postId: string, updateData: any, newImageFile = null) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error('Not authenticated')

            let updatePayload = { ...updateData, slug: slugify(updateData.title) }

            if (newImageFile) {
                const { data: existingPost } = await supabase
                    .from('blog_posts')
                    .select('image_url')
                    .eq('id', postId)
                    .eq('author_id', user.id)
                    .single()

                if (existingPost?.image_url) {
                    const urlParts = existingPost.image_url.split('/')
                    const fileName = urlParts[urlParts.length - 1]
                    const oldPath = `${user.id}/${fileName}`
                    await supabase.storage.from('blog-images').remove([oldPath])
                }

                const fileExt = newImageFile.name.split(".").pop()
                const fileName = `${user.id}/${Date.now()}-${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, newImageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(uploadData.path)

                updatePayload.image_url = publicUrl
            }

            const { data, error } = await supabase
                .from('blog_posts')
                .update(updatePayload)
                .eq('id', postId)
                .select()

            if (!error) await fetchPosts()

            return { data, error }
        } catch (err) {
            console.error('Error updating blog post:', err)
            return { data: null, error: err }
        }
    }

    const deletePost = async (postId: string) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error('Not authenticated')

            const { data: post } = await supabase
                .from('blog_posts')
                .select('image_url')
                .eq('id', postId)
                .single()

            if (post?.image_url) {
                const urlParts = post.image_url.split('/')
                const fileName = urlParts[urlParts.length - 1]
                const imagePath = `${user.id}/${fileName}`
                await supabase.storage.from('blog-images').remove([imagePath])
            }

            const { data, error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', postId)

            if (!error) await fetchPosts()

            return { data, error }
        } catch (err) {
            console.error('Error deleting blog post:', err)
            return { data: null, error: err }
        }
    }

    const fetchCounts = async () => {
        loading.value = true
        error.value = null

        const { count: draft, error: errDraft } = await supabase
            .from('blog_posts')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'Draft')

        if (errDraft) {
            error.value = errDraft
            loading.value = false
            return
        }

        const { count: published, error: errPublished } = await supabase
            .from('blog_posts')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'Published')

        if (errPublished) {
            error.value = errPublished
            loading.value = false
            return
        }

        draftCount.value = draft ?? 0
        publishedCount.value = published ?? 0
        loading.value = false
    }

    return {
        draftCount,
        publishedCount,
        posts,
        loading,
        totalCount,
        currentPage,
        pageSize,
        totalPages,
        filters,
        sort,
        fetchPosts,
        updateSearch,
        updateFilter,
        updateSort,
        fetchCounts,
        changePage,
        resetFilters,
        createPost,
        updatePost,
        deletePost
    }
}
