<template>
  <div class="w-full max-w-6xl mx-auto px-4 py-12">
    <!-- Header Section -->
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Explore Categories
      </h2>
      <p class="text-gray-600 text-lg">
        Find the right tools for every aspect of your business
      </p>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @click="handleCategoryClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CategoryCard from './CategoryCard.vue'

interface Category {
  id: string
  title: string
  description: string
  icon: string
  iconColor: string
  count: string
  countColor: string
}

const categories = ref<Category[]>([
  {
    id: 'company-formation',
    title: 'Company Formation & Banking',
    description: 'Incorporate your business and set up banking solutions',
    icon: '📋',
    iconColor: 'text-blue-500',
    count: '45+ tools',
    countColor: 'text-blue-600'
  },
  {
    id: 'saas-tools',
    title: 'SAAS Tools',
    description: 'HR, payroll, email, hosting, and CRM solutions',
    icon: '👥',
    iconColor: 'text-orange-500',
    count: '120+ tools',
    countColor: 'text-orange-600'
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description: 'Marketing, content creation, and coding assistants',
    icon: '⚡',
    iconColor: 'text-blue-500',
    count: '85+ tools',
    countColor: 'text-blue-600'
  },
  {
    id: 'incubators',
    title: 'Incubators & Accelerators',
    description: 'Programs to accelerate your startup growth',
    icon: '📈',
    iconColor: 'text-orange-500',
    count: '30+ programs',
    countColor: 'text-orange-600'
  },
  {
    id: 'government-grants',
    title: 'Government Grants & Funding',
    description: 'Funding and grants for eligible businesses',
    icon: '💰',
    iconColor: 'text-blue-500',
    count: '25+ grants',
    countColor: 'text-blue-600'
  },
  {
    id: 'legal-tax',
    title: 'Legal, Tax & Compliance',
    description: 'Legal services, tax, and compliance tools',
    icon: '⚖️',
    iconColor: 'text-orange-500',
    count: '40+ services',
    countColor: 'text-orange-600'
  }
])

const handleCategoryClick = (category: Category) => {
  // Handle category click - navigate to category page
  console.log('Category clicked:', category.title)
  // Example: navigateTo(`/categories/${category.id}`)
}
</script>