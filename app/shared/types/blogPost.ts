import type { UserProfile } from "./user"


export interface BlogPost {
    id: string
    title: string
    slug: string
    status: 'Published' | 'Draft'
    category: string
    content:string
    author: string
    tags: string[]
    image_url:string
    seo_title:string;
    seo_description:string;
    created_at: string
    updated_at: string
    profiles:UserProfile

}