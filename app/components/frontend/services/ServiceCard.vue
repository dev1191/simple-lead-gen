<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Star } from "lucide-vue-next";
import { currencyOptions } from "~/shared/constants";

const props = defineProps<{
  service_name: string;
  service_tagline: string;
  slug: string;
  description: string;
  rating: number;
  pricing: number;
  type_of_service?: string;
  service_categories: [];
  service_sub_categories: [];
  audience?: string;
  logo_url: string;
  banner_url?: string;
  currency_code?: string;
  best_for?: Array<string>;
  free_trial?: boolean;
  pricing_model?: string;
  turnaround_time?: string;
  servers?: string[];
  business_types?: string[];
  free_consultation?: boolean;
}>();

const types = [
  { value: "one-time", label: "One-time" },
  { value: "retainer-monthly", label: "Retainer / Monthly" },
  { value: "project-based", label: "Project-based" },
  { value: "custom-varies", label: "Custom / Varies" },
];

const ServiceType = computed(() => {
  const type = types.find((type) => type.value === props.type_of_service);
  return type ? type.label : "";
});

const options = [
  { value: "within-24-hours", label: "Within 24 hours" },
  { value: "within-48-hours", label: "Within 48 hours" },
  { value: "3-5-business-days", label: "3–5 Business Days" },
  { value: "1-2-weeks", label: "1–2 Weeks" },
  { value: "1-month", label: "1 Month" },
  { value: "custom-varies", label: "Custom / Varies" },
];

const turnaroundTime = computed(() => {
  const option = options.find((opt) => opt.value === props.turnaround_time);
  return option ? option.label : "";
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
  if (!props.servers) return "";

  const matched = regionOptions
    .filter((reg) => props.servers.includes(reg.value))
    .map((reg) => reg.label);

  return matched.join(", ");
});

const businessTypeOptions = [
  {
    value: "solopreneurs",
    label: "Solopreneurs",
  },
  {
    value: "early_stage_startups",
    label: "Early-stage Startups",
  },
  {
    value: "smes",
    label: "SMEs",
  },
  {
    value: "vc_backed_startups",
    label: "VC-backed Startups",
  },
  {
    value: "remote_teams",
    label: "Remote Teams",
  },
];

const businessTypes = computed(() => {
  return businessTypeOptions.filter((opt) =>
    props.business_types?.includes(opt.value)
  );
});

const symbol = computed(() => {
  const currency = currencyOptions.find(
    (opt) => opt.value === props.currency_code
  );
  return currency ? currency.symbol : "";
});
</script>

<template>
  <Card
    class="flex flex-col py-0 rounded-lg shadow-md group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
  >
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="banner_url"
        alt="service"
        class="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
      />
      <div class="flex items-center gap-3">
        <img
          :src="logo_url"
          :alt="service_name"
          class="w-12 h-12 rounded-lg absolute top-4 left-4 object-cover border border-border/50"
        />
        <Badge
          v-if="free_consultation"
          class="absolute top-4 right-4 bg-white text-black font-semibold rounded-2xl"
          ><Icon name="CircleCheckBig" /> Free Consultation</Badge
        >
      </div>
    </div>

    <CardContent class="flex flex-row items-start gap-3 pr-4 pl-4">
      <div class="flex-1 min-w-0">
        <h3
          class="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1"
        >
          {{ service_name }}
        </h3>
        <p class="text-sm text-muted-foreground mt-1 line-clamp-2">
          {{ service_tagline }}
        </p>
      </div>
      <div class="flex items-center gap-1 text-sm font-medium">
        <Star class="w-4 h-4 fill-primary text-primary" />
        <span class="text-foreground">{{ rating }}</span>
      </div>
    </CardContent>

    <CardContent>
      <div class="flex flex-wrap gap-1 mt-3">
        <Badge
          v-for="service in service_categories"
          :key="service"
          class="rounded-full font-semibold"
          variant="outline"
          >{{ service.categories.name }}</Badge
        >
        <Badge
          v-for="service in service_sub_categories"
          :key="service"
          class="rounded-full font-semibold"
          variant="outline"
          >{{ service.sub_categories.name }}</Badge
        >
      </div>

      <div class="py-6 pt-4 space-y-4">
        <div
          class="flex items-center justify-between text-xs text-muted-foreground"
        >
          <div class="flex items-center gap-1">
            <Icon name="Clock" class="w-3 h-3" />
            <span class="font-semibold">{{ turnaroundTime }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="MapPin" class="w-3 h-3" />

            <span class="font-semibold">{{ regions }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1">
          <Badge v-for="type in businessTypes" :key="type.value" class="rounded-full font-semibold" variant="secondary">
            {{ type.label }}
          </Badge>
        </div>
      </div>
    </CardContent>
    <Separator class="p-0 m-0"/>
    <CardFooter class="flex justify-between items-center pb-4">
      <div>
        <div class="text-sm font-semibold text-gray-900">
          <span class="text-xs text-gray-500">From</span>
          {{ currency_code }} {{ symbol }}{{ pricing }}
        </div>
        <div class="text-xs text-gray-500">{{ ServiceType }}</div>
      </div>
      <Button
        class="bg-orange-500 hover:bg-orange-600 text-white w-28 h-10 px-2"
        ><NuxtLink :to="`/services/${slug}`"> More Details </NuxtLink>
      </Button>
    </CardFooter>
  </Card>
</template>
