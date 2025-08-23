<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";
import Icon from "~/components/Icon.vue";

const props = defineProps({
  modelValue: {
    type: Array as () => string[], // Changed to Array for multi-select
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const regions = [
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

// Handle region toggle - same pattern as other filters
const handleChange = (regionValue: string, checked: boolean) => {
  const current = [...props.modelValue];
  if (checked) {
    if (!current.includes(regionValue)) {
      emit("update:modelValue", [...current, regionValue]);
    }
  } else {
    emit(
      "update:modelValue",
      current.filter((item) => item !== regionValue)
    );
  }
};
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Region Served
    </h3>
    <div class="space-y-2">
      <div
        v-for="region in regions"
        :key="region.value"
        class="flex items-center text-sm space-x-2"
      >
        <Checkbox
          :id="region.value"
          :model-value="props.modelValue.includes(region.value)"
          @update:model-value="(checked) => handleChange(region.value, checked)"
          class="h-5 w-5"
        />
        <label
          :for="region.value"
          class="text-sm font-medium leading-none cursor-pointer"
        >
          {{ region.label }}
        </label>
      </div>
    </div>
  </FilterSection>
</template>