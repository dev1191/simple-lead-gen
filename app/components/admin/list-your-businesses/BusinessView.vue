<script setup lang="ts">
import type { Business } from "~/shared/types/Business";
import { format } from "date-fns";

const props = defineProps<{ business: Business; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const business = ref(props.business);

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
    title="View Business Query Details"
    @update:open="handleCancel"
    size="lg"
    :isFooter="false"
  >
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold text-gray-700">Business Name:</h3>
          <p>{{ business.business_name || "—" }}</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-700">Contact Name:</h3>
          <p>{{ business.name || "—" }}</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-700">Email:</h3>
          <p>{{ business.email || "—" }}</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-700">Phone:</h3>
          <p>{{ business.phone || "—" }}</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-700">Country:</h3>
          <p>{{ business.country || "—" }}</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-700">Category:</h3>
          <p>{{ business.category || "—" }}</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-700">Website:</h3>
          <p>{{ business.website || "—" }}</p>
        </div>
        <div class="md:col-span-2">
          <h3 class="font-semibold text-gray-700">Description:</h3>
          <p>{{ business.description || "—" }}</p>
        </div>
        <div class="md:col-span-2">
          <h3 class="font-semibold text-gray-700">Created At:</h3>
          <p>{{ formatDate(business.created_at) }}</p>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
