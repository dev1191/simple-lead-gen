<script setup lang="ts">
import { currencyOptions } from "~/shared/constants";
import ServiceHeader from "./ServiceHeader.vue";
import type { Service } from "~/shared/types/service";
import ServiceCard from "../ServiceCard.vue";
import ServiceModal from "./ServiceModal.vue";

const props = defineProps({
  service: Object as () => Service,
});


const modalOpen = ref(false)
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
  if (!props.service.servers) return "";

  const matched = regionOptions
    .filter((reg) => props.service.servers.includes(reg.value))
    .map((reg) => reg.label);

  return matched.join(", ");
});

const types = [
  { value: "one-time", label: "One-time" },
  { value: "retainer-monthly", label: "Retainer / Monthly" },
  { value: "project-based", label: "Project-based" },
  { value: "custom-varies", label: "Custom / Varies" },
];

const ServiceType = computed(() => {
  const type = types.find(
    (type) => type.value === props.service.type_of_service
  );
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
  const option = options.find(
    (opt) => opt.value === props.service.turnaround_time
  );
  return option ? option.label : "";
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
    props.service.business_types?.includes(opt.value)
  );
});

const symbol = computed(() => {
  const currency = currencyOptions.find(
    (opt) => opt.value === props.service.currency_code
  );
  return currency ? currency.symbol : "";
});

const externalLink = (url: string) => {
  navigateTo(url);
};
</script>

<template>
  <ServiceHeader
    :logo_url="service.logo_url"
    :service_name="service.service_name"
  />
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-start gap-6 mb-8">
      <img
        class="w-20 h-20 rounded-xl object-cover border border-border shadow-lg"
        :src="service.logo_url"
        :alt="service.service_name"
      />
      <div class="flex-1">
        <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {{ service.service_name }}
        </h1>
        <p class="text-lg text-muted-foreground mb-4 max-w-2xl">
          {{ service.service_tagline }}
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <div class="flex" items-center gap-2>
            <div class="font-semibold text-foreground">
              {{ service.rating }}
            </div>
            <Icon name="Star" class="w-5 h-5 fill-primary text-primary" />
            <span class="text-muted-foreground"></span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <Icon name="Clock" class="w-4 h-4" />
            <span>{{ turnaroundTime }}</span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <Icon name="MapPin" class="w-4 h-4" />
            <span>{{ regions }}</span>
          </div>
          <div
            v-if="service.free_consultation"
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary-foreground hover:bg-secondary/80 bg-accent/90"
          >
            <Badge class="font-semibold rounded-2xl" variant="secondary"
              ><Icon name="CircleCheckBig" /> Free Consultation</Badge
            >
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <img
        :src="service.banner_url"
        alt="Service Banner"
        class="w-full h-64 md:h-80 object-cover rounded-lg border border-border"
      />
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <Card>
            <CardContent>
              <h2 class="text-xl font-semibold text-foreground mb-4">
                About This Service
              </h2>
              <p class="text-muted-foreground leading-relaxed mb-6">
                {{ service.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="service in service.service_categories"
                  :key="service"
                  class="rounded-full font-semibold"
                  variant="outline"
                  >{{ service.categories.name }}</Badge
                >
                <Badge
                  v-for="service in service.service_sub_categories"
                  :key="service"
                  class="rounded-full font-semibold"
                  variant="outline"
                  >{{ service.sub_categories.name }}</Badge
                >
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 class="text-xl font-semibold text-foreground mb-4">
                Highlights
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <template v-for="highlight in service.highlights">
                  <div class="flex items-start gap-3">
                    <Icon
                      name="Check"
                      class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                    />
                    <span class="text-muted-foreground">{{ highlight }}</span>
                  </div>
                </template>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 class="text-xl font-semibold text-foreground mb-4">
                What's Included
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <template v-for="include in service.included">
                  <div class="flex items-start gap-3">
                    <Icon
                      name="CircleCheckBig"
                      class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                    />
                    <span class="text-muted-foreground">{{ include }}</span>
                  </div>
                </template>
              </div>
            </CardContent>
          </Card>

          <Card v-if="service.url">
            <CardContent>
              <h2 class="text-xl font-semibold text-foreground mb-4">
                Portfolio & Case Studies
              </h2>

              <Button variant="outline" @click="externalLink(service.url)">
                <Icon name="ExternalLink" class="w-4 h-4 mr-2" /> View Our Work
              </Button>
            </CardContent>
          </Card>
        </div>
        <div class="space-y-6">
          <Card>
            <CardContent>
              <div class="text-center mb-6">
                <div>
                  <div class="text-3xl font-bold text-foreground">
                    {{ service?.currency_code }} {{ symbol
                    }}{{ service?.pricing }}
                  </div>
                  <div class="text-sm text-muted-foreground mt-1">
                    Starting price • {{ ServiceType }}
                  </div>
                </div>
              </div>
              <Button class="w-full h-11" @click="modalOpen = true"
                ><Icon name="Mail" /> More Details</Button
              >
              <ServiceModal
                v-model:open="modalOpen"
                :service="service"
              />
              <Separator class="my-6" />
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Clock" class="w-4 h-4" />
                    <span class="text-sm">Delivery</span>
                  </div>
                  <div class="text-sm font-medium text-foreground">
                    {{ turnaroundTime }}
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Users" class="w-4 h-4" />
                    <span class="text-sm">Best For</span>
                  </div>
                  <div class="text-sm font-medium text-foreground">
                    {{ businessTypes.map((type) => type.label).join(", ") }}
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Icon name="MapPin" class="w-4 h-4" />
                    <span class="text-sm">Regions</span>
                  </div>
                  <div class="text-sm font-medium text-foreground">
                    {{ regions }}
                  </div>
                </div>
                <div
                  v-if="service?.free_consultation"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Calendar" class="w-4 h-4" />
                    <span class="text-sm">Consultation</span>
                  </div>
                  <div class="text-sm font-medium text-foreground">
                    <Badge
                      variant="secondary"
                      class="rounded-full font-semibold"
                      >Free</Badge
                    >
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="mt-16" v-if="service.similar.length > 0">
        <h2 class="text-2xl font-bold text-foreground mb-8">
          Similar Services
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            v-for="service in service.similar"
            :key="service.id"
            v-bind="service"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
