<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Phone } from "lucide-vue-next";
import type { Tool } from "~/shared/types/tools";
import { currencyOptions, toolCategories } from "~/shared/constants";

const props = defineProps<{
  name: string;
  tagline: string;
  slug: string;
  rating: number;
  pricing: number;
  priceType?: string;
  category: string;
  sub_categories: string[];
  audience?: string;
  logo_url: string;
  banner_url?: string;
  currency_code?: string;
  best_for?: Array<string>;
  operate?: Array<string>;
  free_trail: boolean;
  pricing_model?: string;
}>();

const CategoryName = computed(() => {
  const category = toolCategories.find((cat) => cat.value === props.category);
  return category ? category.label : "";
});

const subCategories = computed(() => {
  return toolCategories.flatMap((cat) =>
    cat.subcategories.filter((sub) => props.sub_categories?.includes(sub.value))
  );
});

const bestForOptions = [
  {
    value: "solopreneurs",
    label: "Solopreneurs",
  },
  {
    value: "startups",
    label: "Startups",
  },
  {
    value: "smes",
    label: "SMEs",
  },
  {
    value: "agencies",
    label: "Agencies",
  },
  {
    value: "remote_teams",
    label: "Remote Teams",
  },
  {
    value: "product-base-brands",
    label: "Product-Based Brands",
  },
];
const bestFor = computed(() => {
  return bestForOptions.filter((opt) => props.best_for?.includes(opt.value));
});

const regionOptions = [
  {
    value: "malaysia",
    label: "Malaysia",
  },
  {
    value: "singapore",
    label: "Singapore",
  },
  {
    value: "global",
    label: "Global",
  },
];

const regions = computed(() => {
  return regionOptions.filter((opt) => props.operate?.includes(opt.value));
});

const pricingOptions = [
  { value: "free_forever", label: "Free Forever" },
  { value: "free_trial", label: "Free Trial Available" },
  { value: "freemium", label: "Freemium" },
  { value: "monthly_subscription", label: "Monthly Subscription" },
  { value: "pay_as_you_go", label: "Pay-as-you-go" },
  { value: "custom_varies", label: "Custom / Varies" },
];

const pricingModel = computed(() => {
  const option = pricingOptions.find(
    (opt) => opt.value === props.pricing_model
  );
  return option ? option.label : "Unknown";
});

const symbol = computed(() => {
  const currency = currencyOptions.find(
    (opt) => opt.value === props.currency_code
  );
  return currency ? currency.symbol : "";
});

defineEmits<{
  click: [tool: Tool];
}>();
</script>

<template>
  <Card
    class="group cursor-pointer p-0 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-white"
  >
    <CardContent class="p-0">
      <!-- Header Image/Thumbnail -->
      <div
        class="relative rounded-t-lg h-42 flex items-center justify-center bg-slate-800 bg-cover bg-center"
        :style="banner_url ? { backgroundImage: `url(${banner_url})` } : {}"
      >
        <!-- Logo on top-left -->
        <div v-if="logo_url" class="absolute top-4 left-4">
          <img
            :src="logo_url"
            alt="logo"
            class="h-12 w-12 object-contain rounded-md border-white border-2 shadow"
          />
        </div>
        <!-- Free Consultation Badge -->
        <div v-if="free_trail" class="absolute top-4 right-4">
          <Badge
            variant="secondary"
            class="bg-white text-slate-800 text-xs font-medium"
          >
            <Phone class="w-3 h-3 mr-1" />
            Free Consultation
          </Badge>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Title & Rating -->
        <div class="flex items-start justify-between mb-3">
          <h3
            class="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors"
          >
            {{ name }}
          </h3>
          <div class="flex items-center gap-1 ml-2">
            <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span class="text-sm font-medium text-gray-700">{{ rating }}</span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
          {{ tagline }}
        </p>

        <!-- Categories -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2">
            <Badge
              variant="outline"
              class="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
            >
              {{ CategoryName }}
            </Badge>
          </div>
          <div class="space-y-2 mb-4">
            <div
              v-for="subCategory in subCategories"
              :key="subCategory.value"
              variant="default"
              class="flex items-start gap-2 text-xs font-medium"
            >
              {{ subCategory.label }}
            </div>
          </div>
        </div>

        <!-- Meta Information -->
        <div class="space-y-2 mb-4 text-xs text-gray-500">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <Clock class="w-3 h-3" />
              {{ pricingModel }}
            </div>
            <div class="flex items-center gap-1">
              <MapPin class="w-3 h-3" />
              <template v-for="(region, index) in regions" :key="region.value">
                <span
                  >{{ region.label
                  }}<span v-if="index < regions.length - 1">, </span></span
                >
              </template>
            </div>
          </div>
        </div>

        <!-- Target Audience -->
        <div class="flex flex-wrap gap-1 mb-4">
          <Badge
            v-for="audience in bestFor"
            :key="audience"
            variant="secondary"
            class="text-xs bg-gray-100 text-gray-700"
          >
            {{ audience.label }}
          </Badge>
        </div>

        <!-- Pricing & CTA -->
        <div
          class="flex items-center justify-between pt-4 border-t border-gray-100"
        >
          <div>
            <div class="text-sm font-semibold text-gray-900">
              <span class="text-xs text-gray-500">From</span>
              {{ currency_code }} {{ symbol }}{{ pricing }}
            </div>
            <div class="text-xs text-gray-500"></div>
          </div>
          <Button
            class="bg-orange-500 hover:bg-orange-600 text-white w-30 h-10 px-2"
            @click.stop="$emit('click', tool)"
          >
            More Details
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
