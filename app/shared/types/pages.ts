export interface Page {
    id: string
    title: string
    slug: string
    name: string;
    status: 'Published' | 'Draft'
    content: string
    image_url: string
    seo_title: string;
    seo_description: string;
    created_at: string
    updated_at: string
    published_at: string
    updated_by: string
    meta_data: {
        sub_title: string;
        featured_services: string[];
        featured_tools: string[];
    }


}