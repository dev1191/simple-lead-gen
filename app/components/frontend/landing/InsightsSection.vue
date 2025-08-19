<template>
  <div class="w-full bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Latest Business Insights
        </h2>
        <p class="text-gray-600 text-lg">
          Stay ahead with expert tips and industry trends
        </p>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card 
          v-for="article in articles" 
          :key="article.id"
          class="bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
        >
          <CardContent class="p-0">
            <!-- Image Container -->
            <div class="relative bg-gradient-to-br from-purple-100 to-blue-100 h-48 flex items-center justify-center">
              <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <component :is="article.icon" class="w-6 h-6 text-white" />
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Category and Date -->
              <div class="flex justify-between items-center mb-4">
                <Badge 
                  :variant="article.category.variant"
                  class="text-xs font-medium px-3 py-1"
                >
                  {{ article.category.name }}
                </Badge>
                <span class="text-sm text-gray-500">
                  {{ formatDate(article.date) }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                {{ article.title }}
              </h3>

              <!-- Footer -->
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">
                  {{ article.readTime }} min read
                </span>
                <button class="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                  Read More
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Cpu, 
  Banknote, 
  ChevronRight 
} from 'lucide-vue-next'

interface Article {
  id: number
  title: string
  category: {
    name: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  date: string
  readTime: number
  icon: any
}

// Sample articles data
const articles: Article[] = [
  {
    id: 1,
    title: '5 Essential Steps to Register Your Business in Singapore',
    category: {
      name: 'Business Registration',
      variant: 'secondary'
    },
    date: '2024-12-15',
    readTime: 5,
    icon: Building2
  },
  {
    id: 2,
    title: 'Top AI Tools Every SME Should Consider in 2024',
    category: {
      name: 'AI Tools',
      variant: 'outline'
    },
    date: '2024-12-12',
    readTime: 7,
    icon: Cpu
  },
  {
    id: 3,
    title: 'Banking Solutions for Startups: Singapore vs Malaysia',
    category: {
      name: 'Banking & Finance',
      variant: 'secondary'
    },
    date: '2024-12-10',
    readTime: 6,
    icon: Banknote
  }
]

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Handle article click
const handleArticleClick = (article: Article) => {
  console.log('Article clicked:', article.title)
  // Add your navigation logic here
  // Example: navigateTo(`/insights/${article.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>