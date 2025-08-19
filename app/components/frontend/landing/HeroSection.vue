<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "vue-router";
import { toast } from "@steveyuowo/vue-hot-toast";
import { Brain, Building2, CreditCard, Scale, TrendingUp } from "lucide-vue-next";

const router = useRouter();

// Search state
const searchQuery = ref("");
const selectedCountry = ref("");
const isSearching = ref(false);

// Popular search terms
const popularSearches = ref([
  "Web Development",
  "Digital Marketing",
  "Accounting",
  "Legal Services",
  "AI Tools",
]);

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    toast({
      message: "Please enter a search term to find services.",
      type: "error",
    });
    return;
  }

  isSearching.value = true;

  // Simulate search delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Navigate to search results
  router.push({
    path: "/search",
    query: {
      q: searchQuery.value,
      country: selectedCountry.value || "all",
    },
  });

  toast({
    message: `Found services for "${searchQuery.value}"`,
  });

  isSearching.value = false;
};

const quickSearch = (term: string) => {
  searchQuery.value = term;
  performSearch();
};

const navigateToCategory = (category: string) => {
  router.push(`/categories/${category}`);
};

// Analytics tracking (optional)
const trackCategoryClick = (category: string) => {
  // Add your analytics tracking here
  console.log(`Category clicked: ${category}`);
};
</script>

<template>
  <section
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto text-center">
      <!-- Main Heading -->
      <div class="animate-fade-in-up">
        <h1
          class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Find a
          <span class="text-orange-500 relative">
            better deal
            <svg
              class="absolute -bottom-2 left-0 w-full h-3 text-orange-200"
              viewBox="0 0 100 8"
              fill="currentColor"
            >
              <path
                d="M0 4c20-3 40-3 60 0c20 3 40 3 40 0v2c-20 3-40 3-60 0c-20-3-40-3-40 0v-2z"
              />
            </svg>
          </span>
          for you
        </h1>
      </div>

      <!-- Subheading -->
      <div class="animate-fade-in-up animation-delay-200">
        <p
          class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Discover, compare and get quotes on the best services, deals, and AI
          tools to start, scale and succeed in business across Singapore and
          Malaysia.
        </p>
      </div>

      <!-- Search Section -->
      <div
        class="animate-fade-in-up animation-delay-400 max-w-2xl mx-auto mb-16"
      >
        <div
          class="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-lg shadow-lg border border-gray-100"
        >
          <div class="flex-1 relative">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              v-model="searchQuery"
              type="text"
              placeholder="Search for services, tools, or solutions..."
              class="border-0 text-lg h-12 pl-10 focus:ring-0 focus:outline-none"
              @keyup.enter="performSearch"
            />
          </div>

          <Select v-model="selectedCountry">
            <SelectTrigger class="w-full sm:w-48 h-12 border-0 focus:ring-0">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sg">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🇸🇬</span>
                  Singapore
                </div>
              </SelectItem>
              <SelectItem value="my">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🇲🇾</span>
                  Malaysia
                </div>
              </SelectItem>
              <SelectItem value="all">All Countries</SelectItem>
            </SelectContent>
          </Select>

          <Button
            @click="performSearch"
            class="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 h-12 transition-all duration-200 hover:shadow-lg"
            :disabled="isSearching"
          >
            <svg
              v-if="isSearching"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isSearching ? "Searching..." : "Search" }}
          </Button>
        </div>

        <!-- Popular searches -->
        <div class="mt-4 text-sm text-gray-500">
          <span>Popular searches: </span>
          <button
            v-for="term in popularSearches"
            :key="term"
            @click="quickSearch(term)"
            class="mx-1 text-orange-500 hover:text-orange-600 underline transition-colors"
          >
            {{ term }}
          </button>
        </div>
      </div>

      <!-- Service Categories -->
      <div class="animate-fade-in-up animation-delay-600">
        <h2 class="text-2xl font-semibold text-gray-900 mb-8">
          Popular Categories
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 w-full mx-auto">
          <!-- Register a Business -->
          <div
            @click="navigateToCategory('register-business')"
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            <div
              class="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-200"
            >
             <Building2 class="w-10 h-10 mx-auto"/>
            </div>
            <h3
              class="font-semibold text-gray-900 mb-2 group-hover:text-red-500 transition-colors"
            >
              Register a Business
            </h3>
            <p class="text-sm text-gray-600">
              Company formation and registration services
            </p>
          </div>

          <!-- Legal & Compliance -->
          <div
            @click="navigateToCategory('legal-compliance')"
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            <div
              class="text-yellow-500 mb-4 group-hover:scale-110 transition-transform duration-200"
            >
                       <Scale class="w-10 h-10 mx-auto"/>
            </div>
            <h3
              class="font-semibold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors"
            >
              Legal & Compliance
            </h3>
            <p class="text-sm text-gray-600">
              Legal services and regulatory compliance
            </p>
          </div>

          <!-- Banking & Finance -->
          <div
            @click="navigateToCategory('banking-finance')"
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            <div
              class="text-green-500 mb-4 group-hover:scale-110 transition-transform duration-200"
            >
                          <CreditCard class="w-10 h-10 mx-auto"/>
            </div>
            <h3
              class="font-semibold text-gray-900 mb-2 group-hover:text-green-500 transition-colors"
            >
              Banking & Finance
            </h3>
            <p class="text-sm text-gray-600">
              Financial services and business banking
            </p>
          </div>

          <!-- SaaS & AI Tools -->
          <div
            @click="navigateToCategory('saas-ai-tools')"
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            <div
              class="text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-200"
            >
                    <TrendingUp class="w-10 h-10 mx-auto"/>
            </div>
            <h3
              class="font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors"
            >
              SaaS & AI Tools
            </h3>
            <p class="text-sm text-gray-600">
              Software solutions to streamline your business
            </p>
          </div>

          <!-- Marketing & Growth -->
          <div
            @click="navigateToCategory('marketing-growth')"
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            <div
              class="text-purple-500 mb-4 group-hover:scale-110 transition-transform duration-200"
            >
                      <Brain class="w-10 h-10 mx-auto"/>
            </div>
            <h3
              class="font-semibold text-gray-900 mb-2 group-hover:text-purple-500 transition-colors"
            >
              Marketing & Growth
            </h3>
            <p class="text-sm text-gray-600">
              Grow your business with marketing tools
            </p>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div
        class="animate-fade-in-up animation-delay-800 mt-16 pt-8 border-t border-gray-200"
      >
        <div
          class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-500"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="h-5 w-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>10,000+ Happy Customers</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg
              class="h-5 w-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <span>4.8 Star Rating</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg
              class="h-5 w-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Secure & Trusted Platform</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animation classes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  opacity: 0;
}

.animation-delay-800 {
  animation-delay: 0.8s;
  opacity: 0;
}

/* Custom focus styles */
.focus\:ring-0:focus {
  --tw-ring-shadow: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}

/* Smooth hover transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
