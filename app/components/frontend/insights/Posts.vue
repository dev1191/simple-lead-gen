<template>
  <div class=" bg-gray-50">
    <!-- Category Navigation -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-wrap justify-center items-center gap-2">
          <Button
            v-for="category in categories"
            :key="category.id"
            :variant="activeCategory === category.id ? 'default' : 'outline'"
            :class="[
              'px-4 py-2 rounded-md transition-colors',
              activeCategory === category.id
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100',
            ]"
            @click="setActiveCategory(category.id)"
          >
            {{ category.name }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Blog Posts Grid -->
    <div class="max-w-7xl  mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card
          v-for="post in paginatedPosts"
          :key="post.id"
          class="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
          @click="navigateToPost(post.id)"
        >
          <div class="relative">
            <!-- Placeholder Image -->
            <div
              class="w-full h-48 bg-gray-200 flex items-center justify-center"
            >
              <ImageIcon class="w-12 h-12 text-gray-400" />
            </div>
            <!-- Category Badge -->
            <Badge
              :class="getCategoryColor(post.category)"
              class="absolute top-3 left-3 text-xs px-2 py-1"
            >
              {{ post.category }}
            </Badge>
          </div>

          <CardContent class="p-6">
            <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div class="flex items-center gap-1">
                <CalendarIcon class="w-4 h-4" />
                {{ formatDate(post.date) }}
              </div>
              <div class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                {{ post.readTime }}
              </div>
            </div>

            <h3
              class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2"
            >
              {{ post.title }}
            </h3>

            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>

            <Button
              variant="ghost"
              class="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 h-auto font-medium"
              @click.stop="navigateToPost(post.id)"
            >
              Read More
              <ArrowRightIcon
                class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2" v-if="totalPages > 1">
        <Button
          variant="outline"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="px-3 py-2"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          Previous
        </Button>

        <div class="flex gap-1">
          <Button
            v-for="page in visiblePages"
            :key="page"
            :variant="currentPage === page ? 'default' : 'outline'"
            :class="[
              'px-3 py-2 min-w-[40px]',
              currentPage === page
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>
        </div>

        <Button
          variant="outline"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-3 py-2"
        >
          Next
          <ChevronRightIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
} from "lucide-vue-next";

// Types
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
}

// Reactive data
const activeCategory = ref("all");
const currentPage = ref(1);
const postsPerPage = 8; // 4 rows × 2 columns = 8 posts per page

// Categories data
const categories: Category[] = [
  { id: "all", name: "All" },
  { id: "business-registration", name: "Business Registration" },
  { id: "ai-tools", name: "AI Tools" },
  { id: "banking-finance", name: "Banking & Finance" },
  { id: "legal-compliance", name: "Legal & Compliance" },
  { id: "marketing", name: "Marketing" },
  { id: "funding", name: "Funding" },
];

// Sample blog posts data
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Essential Steps to Register Your Business in Singapore",
    excerpt:
      "Navigate the process of company formation with our comprehensive guide covering ACRA registration, statutory requirements, and key considerations.",
    category: "Business Registration",
    date: "2024-12-15",
    readTime: "5 min read",
    slug: "5-essential-steps-register-business-singapore",
  },
  {
    id: "2",
    title: "Top AI Tools Every SME Should Consider in 2024",
    excerpt:
      "Discover the latest AI solutions that can streamline operations, boost productivity, and give your business a competitive edge.",
    category: "AI Tools",
    date: "2024-12-12",
    readTime: "7 min read",
    slug: "top-ai-tools-sme-2024",
  },
  {
    id: "3",
    title: "Banking Solutions for Startups: Singapore vs Malaysia",
    excerpt:
      "Compare banking options, account opening requirements, and financial services tailored for emerging businesses in both markets.",
    category: "Banking & Finance",
    date: "2024-12-10",
    readTime: "6 min read",
    slug: "banking-solutions-startups-singapore-malaysia",
  },
  {
    id: "4",
    title: "Understanding GST Registration Requirements",
    excerpt:
      "A complete guide to GST registration thresholds, exemptions, and compliance obligations for Singapore businesses.",
    category: "Legal & Compliance",
    date: "2024-12-08",
    readTime: "8 min read",
    slug: "understanding-gst-registration-requirements",
  },
  {
    id: "5",
    title: "Digital Marketing Strategies for B2B Companies",
    excerpt:
      "Effective digital marketing approaches that drive lead generation and brand awareness in the B2B space.",
    category: "Marketing",
    date: "2024-12-05",
    readTime: "9 min read",
    slug: "digital-marketing-strategies-b2b-companies",
  },
  {
    id: "6",
    title: "Securing Seed Funding: A Step-by-Step Guide",
    excerpt:
      "Learn how to prepare your startup for seed funding rounds, from pitch deck creation to investor negotiations.",
    category: "Funding",
    date: "2024-12-03",
    readTime: "10 min read",
    slug: "securing-seed-funding-step-by-step-guide",
  },
  {
    id: "7",
    title: "Corporate Secretarial Services: What You Need to Know",
    excerpt:
      "Essential corporate secretarial requirements and how professional services can ensure compliance.",
    category: "Legal & Compliance",
    date: "2024-12-01",
    readTime: "5 min read",
    slug: "corporate-secretarial-services-what-you-need-know",
  },
  {
    id: "8",
    title: "Choosing the Right Business Structure in Singapore",
    excerpt:
      "Compare sole proprietorship, partnership, and private limited company structures to find the best fit.",
    category: "Business Registration",
    date: "2024-11-28",
    readTime: "7 min read",
    slug: "choosing-right-business-structure-singapore",
  },
  {
    id: "9",
    title: "AI-Powered Customer Service Solutions",
    excerpt:
      "Transform your customer service with chatbots, automated responses, and intelligent routing systems.",
    category: "AI Tools",
    date: "2024-11-25",
    readTime: "6 min read",
    slug: "ai-powered-customer-service-solutions",
  },
  {
    id: "10",
    title: "Cross-Border Payment Solutions for SMEs",
    excerpt:
      "Navigate international payments with cost-effective solutions and compliance considerations.",
    category: "Banking & Finance",
    date: "2024-11-22",
    readTime: "8 min read",
    slug: "cross-border-payment-solutions-smes",
  },
];

// Computed properties
const filteredPosts = computed(() => {
  if (activeCategory.value === "all") {
    return blogPosts;
  }
  return blogPosts.filter(
    (post) =>
      post.category.toLowerCase().replace(/\s+/g, "-") === activeCategory.value
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage);
});

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return filteredPosts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...", total);
    } else if (current >= total - 3) {
      pages.push(1, "...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, "...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...", total);
    }
  }

  return pages.filter((page) => page !== "..." || !pages.includes(page));
});

// Methods
const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Scroll to top of posts section
    document.querySelector(".container")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Business Registration": "bg-blue-100 text-blue-800",
    "AI Tools": "bg-purple-100 text-purple-800",
    "Banking & Finance": "bg-green-100 text-green-800",
    "Legal & Compliance": "bg-red-100 text-red-800",
    Marketing: "bg-pink-100 text-pink-800",
    Funding: "bg-yellow-100 text-yellow-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

const navigateToPost = async (postId: string) => {
  const post = blogPosts.find((p) => p.id === postId);
  if (post) {
    // Navigate to the blog post detail page
    await navigateTo(`/blog/${post.slug}`);
  }
};

// Lifecycle
onMounted(() => {
  // Any initialization logic
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
