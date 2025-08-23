<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";
import Icon from "~/components/Icon.vue";

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const categories = [
  { value: "start-your-business", label: "Start Your Business" },
  { value: "run-operate-smoothly", label: "Run & Operate Smoothly" },
  { value: "manage-your-money", label: "Manage Your Money" },
  { value: "hire-build-your-team", label: "Hire & Build Your Team" },
  { value: "get-customers-grow", label: "Get Customers & Grow" },
  {
    value: "build-tech-digital-presence",
    label: "Build Tech & Digital Presence",
  },
  { value: "ship-products", label: "Ship Products" },
  { value: "stay-compliant-protected", label: "Stay Compliant & Protected" },
  { value: "level-up-as-founder", label: "Level Up as a Founder" },
  { value: "expand-internationally", label: "Expand Internationally" },
];

// toggle category when checkbox changes
const handleChange = (categoryValue: string, checked: boolean) => {
  const current = [...props.modelValue];
  if (checked) {
    if (!current.includes(categoryValue)) {
      emit("update:modelValue", [...current, categoryValue]);
    }
  } else {
    emit(
      "update:modelValue",
      current.filter((item) => item !== categoryValue)
    );
  }
};
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      <Icon name="Funnel" /> Service Categories
    </h3>
    <div
      v-for="category in categories"
      :key="category.value"
      class="flex items-center text-sm space-x-2"
    >
      <Checkbox
        :id="category.value"
        :model-value="props.modelValue.includes(category.value)"
        @update:model-value="(checked) => handleChange(category.value, checked)"
        class="h-5 w-5"
      />
      <label
        :for="category.value"
        class="text-sm font-medium leading-none cursor-pointer"
      >
        {{ category.label }}
      </label>
    </div>
  </FilterSection>
</template>
