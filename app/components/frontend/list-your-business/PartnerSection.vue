<script setup lang="ts">
import { Users, LineChart, ShieldCheck, BadgeCheck } from "lucide-vue-next";
</script>

<template>
  <section class="bg-gray-50 py-16 px-6">
    <div class="max-w-6xl mx-auto text-center space-y-4">
      <!-- Title -->
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
        Why Partner With VentureNext?
      </h2>
      <p class="text-gray-600 max-w-2xl mx-auto">
        We're more than just a marketplace. We're your growth partner, connecting
        you with high-quality leads and helping you scale your business.
      </p>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mt-12">
        <!-- Item -->
        <div class="flex flex-col items-center text-center space-y-3">
          <div class="bg-red-50 p-4 rounded-full">
            <Users class="h-8 w-8 text-red-500" />
          </div>
          <h3 class="font-semibold text-gray-900">Quality Leads</h3>
          <p class="text-sm text-gray-600">
            Pre-qualified prospects actively seeking your services, not tire-kickers.
          </p>
        </div>

        <!-- Item -->
        <div class="flex flex-col items-center text-center space-y-3">
          <div class="bg-red-50 p-4 rounded-full">
            <LineChart class="h-8 w-8 text-red-500" />
          </div>
          <h3 class="font-semibold text-gray-900">Growth Focused</h3>
          <p class="text-sm text-gray-600">
            Our marketing drives consistent traffic and leads to help grow your business.
          </p>
        </div>

        <!-- Item -->
        <div class="flex flex-col items-center text-center space-y-3">
          <div class="bg-red-50 p-4 rounded-full">
            <ShieldCheck class="h-8 w-8 text-red-500" />
          </div>
          <h3 class="font-semibold text-gray-900">Trusted Platform</h3>
          <p class="text-sm text-gray-600">
            Join a vetted network of professionals with established credibility.
          </p>
        </div>

        <!-- Item -->
        <div class="flex flex-col items-center text-center space-y-3">
          <div class="bg-red-50 p-4 rounded-full">
            <BadgeCheck class="h-8 w-8 text-red-500" />
          </div>
          <h3 class="font-semibold text-gray-900">Easy Setup</h3>
          <p class="text-sm text-gray-600">
            Simple onboarding process gets you listed and generating leads quickly.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
