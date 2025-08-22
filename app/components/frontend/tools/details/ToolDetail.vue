<script setup lang="ts">
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Star } from "lucide-vue-next";
import ToolHeader from "./ToolHeader.vue";

const props = defineProps({
  tool: Object,
});

const product = props.tool;

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
  return bestForOptions.filter((opt) => product.best_for?.includes(opt.value));
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
    (opt) => opt.value === product.pricing_model
  );
  return option ? option.label : "Unknown";
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

const region = computed(() => {
  return regionOptions.filter((opt) => product.operate?.includes(opt.value));
});
</script>

<template>
  <ToolHeader />
  <div class="container mx-auto px-4 py-8">
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Left Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Header -->
        <div class="flex items-start gap-4">
          <img
            v-if="product.logo_url"
            :src="product.logo_url"
            class="w-20 h-20 text-gray-400 bg-gray-100 rounded-lg"
          />
          <ImageIcon
            v-else
            class="w-20 h-20 text-gray-400 bg-gray-100 rounded-lg"
          />
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold">{{ product.name }}</h1>
              <div class="flex items-center gap-2 mt-2">
                <Star class="w-4 h-4 text-yellow-500" />
                <span>{{ product.rating }}</span>
              </div>
            </div>

            <p class="text-gray-600">{{ product.description }}</p>

            <div class="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" v-for="tag in product.tags" :key="tag">{{
                tag
              }}</Badge>
            </div>
          </div>
        </div>

        <!-- Preview Image -->
        <img
          v-if="product.banner_url"
          :src="product.banner_url"
          alt="Preview"
          class="w-full h-80 object-cover"
        />
        <ImageIcon
          v-else
          class="w-full h-80 object-cover text-gray-400 bg-gray-100"
        />

        <!-- About -->
        <Card>
          <CardHeader class="text-2xl font-semibold leading-none tracking-tight"
            >About {{ product.name }}</CardHeader
          >
          <CardContent>{{ product.description }}</CardContent>
        </Card>

        <!-- Problem Solved -->
        <Card>
          <CardHeader class="text-2xl font-semibold leading-none tracking-tight"
            >Problem Solved</CardHeader
          >
          <CardContent>{{ product.problem_solved }}</CardContent>
        </Card>

        <!-- Features -->
        <Card>
          <CardHeader class="text-2xl font-semibold leading-none tracking-tight"
            >Core Features</CardHeader
          >
          <CardContent>
            <ul class="pl-5 space-y-1">
              <li
                v-for="f in product.core_features"
                :key="f"
                class="flex items-start gap-2"
              >
                <Icon name="Check" class="w-4 h-4 text-primary" />
                {{ f }}
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- Pros & Cons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader
              class="text-2xl font-semibold leading-none tracking-tight text-green-600 dark:text-green-400"
              >Pros</CardHeader
            >
            <CardContent>
              <ul class="pl-5 space-y-1 text-green-600">
                <li
                  v-for="p in product.pros"
                  :key="p"
                  class="flex items-start gap-2"
                >
                  <Icon name="Check" class="w-4 h-4" />{{ p }}
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              class="text-2xl font-semibold leading-none tracking-tight text-red-600 dark:text-red-400"
              >Cons</CardHeader
            >
            <CardContent class="p-6 pt-0 space-y-3">
              <ul class="list-disc pl-5 space-y-1 text-red-600">
                <li
                  v-for="c in product.cons"
                  :key="c"
                  class="flex items-start gap-2"
                >
                  <Icon name="X" class="w-4 h-4" />{{ c }}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <!-- Integrations -->
        <Card v-if="product.integrations">
          <CardHeader class="text-2xl font-semibold leading-none tracking-tight"
            >Integrations</CardHeader
          >
          <CardContent class="p-6 pt-0">
            <div class="text-sm text-muted-foreground mb-3">
              Connects seamlessly with your favorite tools:
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                class="font-semibold rounded-full"
                v-for="i in product.integrations.split(',')"
                :key="i"
                >{{ i }}</Badge
              >
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <Card
          class="shadow-sm border-primary/20 bg-gradient-to-br from-primary/5 to-primary-glow/5"
        >
          <CardHeader class="text-center font-bold text-2xl text-black mb-0"
            >Freemium</CardHeader
          >
          <CardContent class="text-center">
            <div class="text-sm text-muted-foreground">
              Starting from <b>USD 29/month</b>
            </div>
            <div
              class="flex items-center justify-center gap-1 text-sm text-green-600 dark:text-green-400"
            >
              <Icon name="Check" class="w-4 h-4" />
              Free trial available
            </div>
            <Button class="w-full h-10 mt-3">Start Free Trial</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="font-semibold tracking-tight text-lg"
            >Quick Info</CardHeader
          >
          <CardContent class="p-6 pt-0 space-y-4">
            <div class="flex items-center gap-3">
              <Icon name="Users" class="w-4 h-4 text-gray-400" />
              <div>
                <div class="text-sm font-medium">Best For</div>
                <div class="text-sm text-muted-foreground">
                  {{ bestFor.map((b) => b.label).join(", ") }}
                </div>
              </div>
            </div>
            <Separator />
            <div class="flex items-center gap-3">
              <Icon name="DollarSign" class="w-4 h-4 text-gray-400" />
              <div>
                <div class="text-sm font-medium">Pricing Model</div>
                <div class="text-sm text-muted-foreground">
                  {{ pricingModel }}
                </div>
              </div>
            </div>
            <Separator />
            <div class="flex items-center gap-3">
              <Icon name="Globe" class="w-4 h-4 text-gray-400" />
              <div>
                <div class="text-sm font-medium">Supported Regions</div>
                <div class="text-sm text-muted-foreground">
                  {{ region.map((b) => b.label).join(", ") }}
                </div>
              </div>
            </div>
            <Separator />
            <div class="flex items-center gap-3">
              <Icon name="Monitor" class="w-4 h-4 text-gray-400" />
              <div>
                <div class="text-sm font-medium">Platforms</div>
                <div class="text-sm text-muted-foreground">
                  <div class="flex flex-wrap gap-2">
                    <Badge
                      v-for="value in product.platforms"
                      :key="value"
                      variant="outline"
                      class="font-semibold text-sm text-black rounded-full"
                    >
                      {{ value }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- <Card>
          <CardHeader>Trust & Security</CardHeader>
          <CardContent>
            <ul class="list-disc pl-5 text-sm space-y-1">
              <li v-for="t in product.trust" :key="t">{{ t }}</li>
            </ul>
          </CardContent>
        </Card> -->
      </div>
    </div>
  </div>
</template>
