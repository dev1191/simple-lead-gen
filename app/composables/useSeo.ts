import { useHead, useSeoMeta, useRuntimeConfig, useRoute } from '#imports'

export function useSeo(
  title?: string,
  description?: string,
  image?: string,
  keywords?: string[]
) {
  const siteName = 'Yotta'
  const route = useRoute()
  const config = useRuntimeConfig()

  const baseUrl = config.public.siteUrl || 'https://yotta.com'
  const url = `${baseUrl}${route.fullPath}`

  const seoTitle = title ? `${title} | ${siteName}` : siteName
  const seoDesc = description || 'Default description for Yotta'
  const seoImage = image || `${baseUrl}/default-og-image.jpg`
  const seoKeywords = keywords?.join(', ') || 'yotta, technology, services'

  // Use useSeoMeta for SEO-friendly meta tags
  useSeoMeta({
    title: seoTitle,
    description: seoDesc,
    keywords: seoKeywords,
    ogTitle: seoTitle,
    ogDescription: seoDesc,
    ogImage: seoImage,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: seoTitle,
    twitterDescription: seoDesc,
    twitterImage: seoImage
  })

  // Use useHead for canonical URL and any custom tags
  useHead({
    link: [{ rel: 'canonical', href: url }]
    // You can also add JSON-LD or extra scripts here if needed
  })
}
