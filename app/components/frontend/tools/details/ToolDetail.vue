<script setup lang="ts">
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Star } from "lucide-vue-next";
import ToolHeader from "./ToolHeader.vue";

const product = {
  name: "DataFlow Analytics",
  rating: 4.8,
  description:
    "Advanced analytics platform with real-time insights and customizable dashboards for data-driven decisions",
  tags: ["Analytics & Insights", "Business Intelligence", "Data Visualization"],
  image: "",
  about: `DataFlow Analytics is a comprehensive business intelligence platform...`,
  problem: `Businesses struggle to make sense of their data scattered across multiple platforms...`,
  features: [
    "Real-time data visualization",
    "100+ data source integrations",
    "Automated reporting",
    "Custom dashboard builder",
    "Advanced analytics engine",
  ],
  pros: [
    "Intuitive drag-and-drop interface",
    "Fast data processing",
    "Excellent customer support",
    "Affordable pricing for small teams",
    "Mobile-responsive dashboards",
  ],
  cons: [
    "Learning curve for advanced features",
    "Limited customization on free plan",
    "No offline access",
  ],
  integrations: [
    "Slack",
    "Google Analytics",
    "Salesforce",
    "HubSpot",
    "Stripe",
    "Mailchimp",
    "Zapier",
  ],
  quickInfo: {
    bestFor: "Startups, SMEs, Remote Teams",
    pricing: "Freemium (from $29/mo)",
    regions: ["Global"],
    platforms: ["Web", "iOS", "Android", "API"],
  },
  trust: ["SSL Encrypted", "GDPR Compliant", "24/7 Support", "99.9% Uptime"],
};
</script>

<template>
  <ToolHeader />
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Left Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Header -->
        <div class="flex items-start gap-4">
          <ImageIcon class="w-20 h-20 text-gray-400 bg-gray-100 rounded-lg" />
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
          v-if="product.image"
          :src="product.image"
          alt="Preview"
          class="w-full h-80 object-cover"
        />
        <ImageIcon
          v-else
          class="w-full h-80 object-covertext-gray-400 bg-gray-100 "
        />

        <!-- About -->
        <Card>
          <CardHeader>About {{ product.name }}</CardHeader>
          <CardContent>{{ product.about }}</CardContent>
        </Card>

        <!-- Problem Solved -->
        <Card>
          <CardHeader>Problem Solved</CardHeader>
          <CardContent>{{ product.problem }}</CardContent>
        </Card>

        <!-- Features -->
        <Card>
          <CardHeader>Core Features</CardHeader>
          <CardContent>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="f in product.features" :key="f">{{ f }}</li>
            </ul>
          </CardContent>
        </Card>

        <!-- Pros & Cons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>Pros</CardHeader>
            <CardContent>
              <ul class="list-disc pl-5 space-y-1 text-green-600">
                <li v-for="p in product.pros" :key="p">{{ p }}</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>Cons</CardHeader>
            <CardContent>
              <ul class="list-disc pl-5 space-y-1 text-red-600">
                <li v-for="c in product.cons" :key="c">{{ c }}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <!-- Integrations -->
        <Card>
          <CardHeader>Integrations</CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="i in product.integrations" :key="i">{{ i }}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>Freemium</CardHeader>
          <CardContent>
            <p class="text-sm">Starting from <b>USD 29/month</b></p>
            <Button class="w-full mt-3">Start Free Trial</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Quick Info</CardHeader>
          <CardContent class="space-y-2 text-sm">
            <p><b>Best For:</b> {{ product.quickInfo.bestFor }}</p>
            <p><b>Pricing:</b> {{ product.quickInfo.pricing }}</p>
            <p><b>Regions:</b> {{ product.quickInfo.regions.join(", ") }}</p>
            <p>
              <b>Platforms:</b> {{ product.quickInfo.platforms.join(", ") }}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Trust & Security</CardHeader>
          <CardContent>
            <ul class="list-disc pl-5 text-sm space-y-1">
              <li v-for="t in product.trust" :key="t">{{ t }}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
