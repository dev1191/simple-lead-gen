<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const props = defineProps({
  modelValue: {
    option: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const options = [
  { value: "within-24-hours", label: "Within 24 hours" },
  { value: "within-48-hours", label: "Within 48 hours" },
  { value: "3-5-business-days", label: "3–5 Business Days" },
  { value: "1-2-weeks", label: "1–2 Weeks" },
  { value: "1-month", label: "1 Month" },
  { value: "custom-varies", label: "Custom / Varies" },
];

const handleChange = (val: string, checked: boolean) => {
  const current = [...props.modelValue];
  if (checked) {
    if (!current.includes(val)) {
      emit("update:modelValue", [...current, val]);
    }
  } else {
    emit(
      "update:modelValue",
      current.filter((item) => item !== val)
    );
  }
};
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Turnaround Time
    </h3>
   <div
      v-for="option in options"
      :key="option.value"
      class="flex items-center text-sm space-x-2"
    >
      <Checkbox
        :id="option.value"
        :model-value="props.modelValue.includes(option.value)"
        @update:model-value="(checked) => handleChange(option.value, checked)"
        class="h-5 w-5"
      />
      <label
        :for="option.value"
        class="text-sm font-medium leading-none cursor-pointer"
      >
        {{ option.label }}
      </label>
    </div>
  </FilterSection>
</template>
