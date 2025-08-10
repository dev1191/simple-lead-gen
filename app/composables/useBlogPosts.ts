// composables/useBlogPosts.ts
import { ref, computed, readonly } from 'vue'
import { useSupabaseClient } from '#imports'
import { slugify } from '../shared/utils'

export function useBlogPosts() {
    const supabase = useSupabaseClient()

    const posts = ref([])
    const loading = ref(false)
    const totalCount = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)

    // Filters and search state
    const filters = ref({
        search: '',
        category: '',
        status: '',
        author: '',
        tags: [] as string[]
    })

    // Sorting state
    const sort = ref({
        field: 'created_at',
        order: 'desc' as 'asc' | 'desc'
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
        *
      `, { count: 'exact' })

            console.log("query",query)

        if (filters.value.search) {
            query = query.or(`title.ilike.%${filters.value.search}%,content.ilike.%${filters.value.search}%,excerpt.ilike.%${filters.value.search}%`)
        }
        if (filters.value.category) {
            query = query.eq('category_id', filters.value.category)
        }
        if (filters.value.status) {
            query = query.eq('status', filters.value.status)
        }
          if (filters.value.author) {
            query = query.eq('author', filters.value.author)
        }

        if (filters.value.tags.length > 0) {
            query = query.contains('tags', filters.value.tags)
        }

        const ascending = sort.value.order === 'asc'
        return query.order(sort.value.field, { ascending })
    }

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

    const updateSearch = (searchTerm: string) => {
        filters.value.search = searchTerm
        currentPage.value = 1
        fetchPosts()
    }

    const updateFilter = (key: string, value: any) => {
        filters.value[key] = value
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

    const createPost = async (postData: any, imageFile: File) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error('Not authenticated')

            let imageUrl = null
            if (imageFile) {
                const fileExt = imageFile.name.split(".").pop();
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

            return { data, error }
        } catch (error) {
            console.error('Error creating blog post:', error)
            return { data: null, error }
        }
    }

    const updatePost = async (postId: string, updateData: any, newImageFile = null) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error('Not authenticated');

            let updatePayload = { ...updateData, slug: slugify(updateData.title) };

            // Handle image update
            if (newImageFile) {
                // Get existing post to check for old image
                const { data: existingPost } = await supabase
                    .from('blog_posts')
                    .select('image_url')
                    .eq('id', postId)
                    .eq('author_id', user.id)
                    .single();

                // Delete old image if exists
                if (existingPost?.image_url) {
                    // Extract the file path from the URL
                    const urlParts = existingPost.image_url.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const oldPath = `${user.id}/${fileName}`;

                    await supabase.storage
                        .from('blog-images')
                        .remove([oldPath]);
                }

                // Upload new image
                const fileExt = newImageFile.name.split(".").pop();
                const fileName = `${user.id}/${Date.now()}-${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, newImageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(uploadData.path);

                updatePayload.image_url = publicUrl;
            }

            // Update blog post (RLS will ensure only author can update)
            const { data, error } = await supabase
                .from('blog_posts')
                .update(updatePayload)
                .eq('id', postId)
                .select();

            return { data, error };
        } catch (error) {
            console.error('Error updating blog post:', error);
            return { data: null, error };
        }
    }

    const deletePost = async (postId: string) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error('Not authenticated');

            // Get post data to find image (RLS will ensure only author can access)
            const { data: post } = await supabase
                .from('blog_posts')
                .select('image_url')
                .eq('id', postId)
                .single();

            // Delete image from storage if exists
            if (post?.image_url) {
                const urlParts = post.image_url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const imagePath = `${user.id}/${fileName}`;

                await supabase.storage
                    .from('blog-images')
                    .remove([imagePath]);
            }

            // Delete blog post (RLS will ensure only author can delete)
            const { data, error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', postId);

            return { data, error };
        } catch (error) {
            console.error('Error deleting blog post:', error);
            return { data: null, error };
        }
    }

    return {
        posts: readonly(posts),
        loading: readonly(loading),
        totalCount: readonly(totalCount),
        currentPage: readonly(currentPage),
        pageSize,
        totalPages,
        filters: readonly(filters),
        sort: readonly(sort),
        fetchPosts,
        updateSearch,
        updateFilter,
        updateSort,
        changePage,
        resetFilters,
        createPost,
        updatePost,
        deletePost
    }
}
