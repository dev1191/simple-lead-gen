import { useSupabaseClient } from '#imports'
import type { Page } from '~/shared/types/pages'

export function usePages() {
    const supabase = useSupabaseClient()

    async function upsertPage(pageData: Page) {
        // check use 
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw new Error('Not authenticated')

        // 1. Check if slug exists
        const { data: existing, error: fetchError } = await supabase
            .from('static_pages')
            .select('id')
            .eq('name', pageData.name)
            .limit(1)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError
        }

        if (existing) {
            // 2. Update existing row with pageData as is
            const { data, error: updateError } = await supabase
                .from('static_pages')
                .update({ ...pageData, updated_by: user.id })
                .eq('id', existing.id)
                .select()
                .single()

            if (updateError) throw updateError
            return { action: 'updated', data }
        } else {
            // 3. Insert new row with pageData as is
            const { data, error: insertError } = await supabase
                .from('static_pages')
                .insert({ ...pageData, updated_by: user.id })
                .select()
                .single()

            if (insertError) throw insertError
            return { action: 'inserted', data }
        }
    }


    // get page by slug
    async function getPage(name: string): Promise<Page | null> {
        const { data, error } = await supabase
            .from('static_pages')
            .select('*')
            .eq('name', name)
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw error
        }

        return data
    }

    return {
        upsertPage,
        getPage
    }
}
