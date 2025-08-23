<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";
import Icon from "~/components/Icon.vue";
import { toolTypes } from "~/shared/constants"; // Import tool types from your constants

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const types = toolTypes; // Or define your tool types array here if not in constants

// Handle tool type toggle - same pattern as CategoryFilter
const handleChange = (typeValue: string, checked: boolean) => {
  const current = [...props.modelValue];
  if (checked) {
    if (!current.includes(typeValue)) {
      emit("update:modelValue", [...current, typeValue]);
    }
  } else {
    emit(
      "update:modelValue",
      current.filter((item) => item !== typeValue)
    );
  }
};
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Pricing Model
    </h3>
    <div class="space-y-2">
      <div
        v-for="type in types"
        :key="type.value"
        class="flex items-center text-sm space-x-2"
      >
        <Checkbox
          :id="type.value"
          :model-value="props.modelValue.includes(type.value)"
          @update:model-value="(checked) => handleChange(type.value, checked)"
          class="h-5 w-5"
        />
        <label
          :for="type.value"
          class="text-sm font-medium leading-none cursor-pointer"
        >
          {{ type.label }}
        </label>
      </div>
    </div>
  </FilterSection>
</template>
