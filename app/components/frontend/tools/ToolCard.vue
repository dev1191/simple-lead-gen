<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Star, ExternalLink, ImageIcon } from "lucide-vue-next";
import { toolCategories } from "~/shared/constants";
import { formatDescription } from "~/shared/utils";

const props = defineProps<{
  name: string;
  tagline:string;
  slug: string;
  description: string;
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
  free_trial?: boolean;
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
</script>

<template>
  <Card
    class="flex flex-col rounded-lg shadow-md group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
  >
    <!-- Logo + Rating -->
    <CardHeader class="flex flex-row items-start gap-3 pr-4 pl-4">
      <div class="flex items-center gap-3">
        <img
          :src="logo_url"
          :alt="name"
          class="w-12 h-12 rounded-lg object-cover border border-border/50"
        />
        <div class="flex-1 min-w-0">
          <h3
            class="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors"
          >
            {{ name }}
          </h3>
          <p class="text-gray-500 text-sm line-clamp-2 whitespace-pre-line">
            {{ formatDescription(tagline, 40) }}
          </p>
        </div>
      </div>

      <div class="flex items-center text-yellow-500 text-sm">
        <Star class="w-4 h-4 fill-current" />
        <span class="ml-1 font-medium">{{ rating ? rating : 0 }}</span>
      </div>
    </CardHeader>

    <!-- Tags -->
    <CardContent class="flex flex-wrap gap-2 pr-4 pl-4">
      <!-- Banner -->
      <div
        class="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden"
      >
        <img
          v-if="banner_url"
          :src="banner_url"
          alt="Banner"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <ImageIcon v-else class="w-12 h-12 text-gray-400" />
      </div>

      <div class="flex flex-wrap gap-2">
        <Badge variant="secondary" class="font-semibold">{{ CategoryName }}</Badge>
        <Badge v-for="sub in subCategories" :key="sub.value" variant="secondary" class="font-semibold">
          {{ sub.label }}
        </Badge>
      </div>
    </CardContent>

    <!-- Pricing Row -->
    <CardContent class="pr-4 pl-4">
      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2 flex-1">
          <Icon name="DollarSign" class="font-medium text-sm text-gray-500" />
          <span class="font-medium text-sm text-gray-500">
            {{ pricingModel }}</span
          >
          <span class="font-medium text-foreground"
            >{{ currency_code }} {{ pricing }}</span
          >
          <span
            v-if="bestFor?.length"
            class="text-sm text-gray-500 w-full sm:w-auto"
          >
            <Icon name="Users" class="font-medium text-sm text-gray-500" />
            {{ bestFor[0].label }}
          </span>
        </div>
      </div>
    </CardContent>

    <!-- Footer Buttons -->
    <CardFooter class="flex justify-between gap-2">
      <Button class="flex-1 w-full h-10" >
        <NuxtLink  :to="`/tools/${slug}`"
          >View Details</NuxtLink
        ></Button
      >
      <Button class="w-10 h-10" variant="outline">
        <ExternalLink class="w-4 h-4" />
      </Button>
    </CardFooter>
  </Card>
</template>
