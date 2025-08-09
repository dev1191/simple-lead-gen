

export interface BlogPost {
    id: string
    title: string
    slug: string
    status: 'published' | 'draft'
    category: string
    content:string
    author: string
    tags: string[]
    created_at: string
    updated_at: string

}