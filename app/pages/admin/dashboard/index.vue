CardContent
<script setup lang="ts">
import { LineChart } from "@/components/ui/chart-line";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BarChart3, ActivitySquare, FileText, Briefcase } from "lucide-vue-next";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: "Dashboard",
});

const {
  leadsThisMonth,
  activeServices,
  totalVendors,
  chartData,
  loading,
  error,
} = useDashboard();
</script>

<template>
  <div>
    <!-- Error State -->
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- Dashboard Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- KPI Cards Grid -->

      <!-- Total Leads -->
      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle>Total Leads</CardTitle>
          <FileText class="w-6 h-6 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="loading" class="h-6 w-20" />
          <span v-else class="text-2xl font-semibold">{{
            leadsThisMonth
          }}</span>
        </CardContent>
      </Card>

      <!-- Active Services -->
      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle>Active Services</CardTitle>
          <Briefcase class="w-6 h-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="loading" class="h-6 w-20" />
          <span v-else class="text-2xl font-semibold">{{
            activeServices
          }}</span>
        </CardContent>
      </Card>

      <!-- Vendors -->
      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle>Vendors</CardTitle>
          <Users class="w-6 h-6 text-orange-600" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="loading" class="h-6 w-20" />
          <span v-else class="text-2xl font-semibold">{{ totalVendors }}</span>
        </CardContent>
      </Card>
    </div>

    <!-- Chart -->
    <Card class="mt-6">
      <CardHeader>
        <CardTitle>Monthly Leads & Services Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton v-if="loading" class="h-48 w-full" />

        <LineChart
          v-else
          :data="chartData"
          index="month"
          :categories="['Leads', 'Active Services']"
          :y-formatter="
            (tick) => (typeof tick === 'number' ? tick.toString() : '')
          "
        />
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
