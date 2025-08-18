<script setup lang="ts">
// Import composable
const {
  dashboardData,
  loading,
  error,
  fetchDashboardData,
  refreshKPIs,
  pauseAutoRefresh,
  resumeAutoRefresh,
} = useDashboard();

// Import shadcn-vue components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import Lucide icons
import {
  RefreshCw,
  Loader2,
  AlertCircle,
  Users,
  Activity,
  MousePointerClick,
  PlusCircle,
  Bell,
  AlertTriangle,
  Info,
  Settings,
  Wrench,
  Download,
} from "lucide-vue-next";
import { useDocumentVisibility } from "@vueuse/core";

// Meta and SEO
useHead({
  title: "Dashboard - Admin Panel",
  meta: [
    {
      name: "description",
      content: "Platform overview and analytics dashboard",
    },
  ],
});

// Define page meta for Nuxt
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

// Computed properties
const maxLeads = computed(() => {
  return Math.max(...dashboardData.value.monthlyLeads.map((m) => m.leads), 1);
});

// Helper functions
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

const formatGrowth = (growth: number): string => {
  const sign = growth > 0 ? "+" : "";
  return `${sign}${growth}%`;
};

const growthClass = (growth: number): string => {
  if (growth > 0) return "text-green-600";
  if (growth < 0) return "text-red-600";
  return "text-muted-foreground";
};

const formatMonth = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short" });
};

// Actions
const refreshData = async () => {
  await fetchDashboardData();
};

const exportData = () => {
  // Implement data export functionality
  console.log("Exporting dashboard data...");
  // You could create a CSV/Excel export here
};

// Lifecycle
onMounted(async () => {
  // Initial data fetch
  await fetchDashboardData();

  // Resume auto-refresh when component is mounted
  resumeAutoRefresh();
});

onUnmounted(() => {
  // Pause auto-refresh when component is unmounted
  pauseAutoRefresh();
});

// Handle visibility change to pause/resume auto-refresh
const { isSupported, visibility } = useDocumentVisibility();

if (isSupported) {
  watch(visibility, (current) => {
    if (current === "visible") {
      resumeAutoRefresh();
      refreshKPIs(); // Refresh data when tab becomes visible
    } else {
      pauseAutoRefresh();
    }
  });
}
</script>

<template>
  <div class="p-2 space-y-6">
    <!-- Header with Refresh -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground">
          Overview of your platform activity and performance
        </p>
      </div>
      <Button @click="refreshData" :disabled="loading" variant="outline">
        <RefreshCw :class="{ 'animate-spin': loading }" class="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading && !dashboardData.kpis.totalLeads"
      class="flex items-center justify-center h-64"
    >
      <div class="text-center">
        <Loader2 class="w-8 h-8 animate-spin mx-auto mb-4" />
        <p class="text-muted-foreground">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Error State -->
    <Alert v-else-if="error" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <!-- Total Leads -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Total Leads</CardTitle>
            <Users class="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ formatNumber(dashboardData.kpis.totalLeads) }}
            </div>
            <p class="text-xs text-muted-foreground">
              {{ formatNumber(dashboardData.kpis.totalLeadsThisMonth) }} this
              month
            </p>
          </CardContent>
        </Card>

        <!-- Active Services -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Active Services</CardTitle>
            <Activity class="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ formatNumber(dashboardData.kpis.activeServices) }}
            </div>
            <p class="text-xs text-muted-foreground">
              of {{ formatNumber(dashboardData.kpis.totalServices) }} total
              services
            </p>
          </CardContent>
        </Card>

        <!-- Tool Clicks -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Tool Clicks</CardTitle>
            <MousePointerClick class="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ formatNumber(dashboardData.kpis.toolClicks) }}
            </div>
            <p class="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <!-- New Listings -->
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">New Listings</CardTitle>
            <PlusCircle class="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ formatNumber(dashboardData.kpis.newListingsThisMonth) }}
            </div>
            <p class="text-xs text-muted-foreground">
              <span :class="growthClass(dashboardData.kpis.leadsGrowth)">
                {{ formatGrowth(dashboardData.kpis.leadsGrowth) }}
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Charts Section -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <!-- Monthly Leads Chart -->
        <Card class="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Leads Trend</CardTitle>
            <CardDescription
              >Lead generation over the last 6 months</CardDescription
            >
          </CardHeader>
          <CardContent class="pl-2">
            <div v-if="dashboardData.monthlyLeads.length > 0">
              <!-- Using a simple line chart representation -->
              <div class="h-80 flex items-end justify-between space-x-2">
                <div
                  v-for="(month, index) in dashboardData.monthlyLeads"
                  :key="month.month"
                  class="flex-1 flex flex-col items-center"
                >
                  <div
                    class="bg-primary w-full rounded-t transition-all hover:opacity-80"
                    :style="{ height: `${(month.leads / maxLeads) * 200}px` }"
                    :title="`${month.leads} leads in ${formatMonth(
                      month.date
                    )}`"
                  ></div>
                  <div class="text-xs text-muted-foreground mt-2 text-center">
                    {{ formatMonth(month.date) }}
                  </div>
                  <div class="text-xs font-medium">{{ month.leads }}</div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="h-80 flex items-center justify-center text-muted-foreground"
            >
              No data available
            </div>
          </CardContent>
        </Card>

        <!-- Top Categories -->
        <Card class="col-span-3">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Most popular service categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              v-if="dashboardData.topCategories.length > 0"
              class="space-y-4"
            >
              <div
                v-for="category in dashboardData.topCategories"
                :key="category.category"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 rounded-full bg-primary"></div>
                  <span class="text-sm font-medium capitalize">{{
                    category.category
                  }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-muted-foreground">{{
                    category.count
                  }}</span>
                  <Badge variant="secondary" class="text-xs"
                    >{{ category.percentage }}%</Badge
                  >
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted-foreground py-8">
              No categories data available
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Alerts Section -->
      <Card v-if="dashboardData.alerts.length > 0">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Bell class="h-5 w-5" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription
            >Important updates that need your attention</CardDescription
          >
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <Alert
              v-for="alert in dashboardData.alerts"
              :key="alert.id"
              :variant="alert.type === 'error' ? 'destructive' : 'default'"
            >
              <AlertCircle v-if="alert.type === 'error'" class="h-4 w-4" />
              <AlertTriangle
                v-else-if="alert.type === 'warning'"
                class="h-4 w-4"
              />
              <Info v-else class="h-4 w-4" />

              <AlertTitle>{{ alert.title }}</AlertTitle>
              <AlertDescription class="flex items-center justify-between">
                <span>{{ alert.message }}</span>
                <Button
                  v-if="alert.action && alert.actionLink"
                  variant="outline"
                  size="sm"
                  @click="navigateTo(alert.actionLink)"
                >
                  {{ alert.action }}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Actions -->
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" @click="navigateTo('/admin/services')">
              <Settings class="w-4 h-4 mr-2" />
              Manage Services
            </Button>
            <Button variant="outline" @click="navigateTo('/admin/leads')">
              <Users class="w-4 h-4 mr-2" />
              View Leads
            </Button>
            <Button variant="outline" @click="navigateTo('/admin/tools')">
              <Wrench class="w-4 h-4 mr-2" />
              Tools
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles if needed */
</style>
