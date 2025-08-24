<template>
  <div class="bg-white py-20">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          More Services to Grow Your Business
        </h2>
        <p class="text-gray-600 text-lg">
          Everything you need to start, scale, and succeed
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
        <ServiceIcon
          v-for="service in services"
          :key="service.id"
          :service="service"
          @click="handleServiceClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ServiceIcon from "./ServiceIcon.vue";
import { slugify } from "~/shared/utils";

interface Service {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

const props = defineProps<{
  more_services: string[];
}>();

const services = ref<Service[]>([
  {
    id: "payment-gateways",
    name: "Payment Gateways",
    icon: "💳",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "funding-capital",
    name: "Funding & Capital",
    icon: "🔥",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: "🛡️",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "hr-payroll",
    name: "HR & Payroll",
    icon: "👥",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "market-entry",
    name: "Market Entry",
    icon: "🚀",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  {
    id: "website-online",
    name: "Website Online",
    icon: "💻",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "shipping-fulfillment",
    name: "Shipping & Fulfillment",
    icon: "📦",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    id: "accounting-tax",
    name: "Accounting & Tax",
    icon: "📊",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
]);

watch(
  () => props.more_services,
  (newFeatured) => {
    newFeatured.forEach((item, index) => {
      if (services.value[index]) {
        services.value[index].id = slugify(item);
        services.value[index].name = item;
      }
    });
  },
  { immediate: true }
);

const handleServiceClick = (service: Service) => {
  console.log("Service clicked:", service.name);
  // Handle navigation to service category
};
</script>
