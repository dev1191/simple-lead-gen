<script setup lang="ts">
import { format } from "date-fns";
import type { Vendor } from "~/shared/types/vendor";
const props = defineProps<{ vendor: Vendor; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const vendor = ref(props.vendor);

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};

const formatDate = (date: string | null) => {
  return date ? format(new Date(date), "PPpp") : "—";
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="view"
    title="View Vendor"
    @update:open="handleCancel"
    size="two"
  >
    <template #default>
      <div class="space-y-4">
        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Vendor Name</p>
            <p class="text-base font-semibold text-gray-900">
              {{ vendor.name }}
            </p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Contact Email</p>
            <p class="text-base text-gray-900">{{ vendor.email }}</p>
          </div>
        </div>

        <Separator class="space-y-10" />
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <Card class="text-center">
            <CardHeader>
              <CardTitle class="text-md font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-0">
              <p class="text-xl font-bold">{{ vendor.total_leads }}</p>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader >
              <CardTitle class="text-md font-medium text-muted-foreground">
                Monthly Leads
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-0">
              <p class="text-xl font-bold">{{ vendor.monthly_leads }}</p>
            </CardContent>
          </Card>

          <Card class="text-center">
            <CardHeader>
              <CardTitle class="text-md font-medium text-muted-foreground">
                Services Listed
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-0">
              <p class="text-xl font-bold">{{ vendor.service_listed }}</p>
            </CardContent>
          </Card>
        </div>

        <Separator class="space-y-10" />
        <!-- Status + Created -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold"
              :class="
                vendor.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              {{ vendor.status }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Created At</p>
            <p class="text-base text-gray-900">
              {{ formatDate(vendor.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
