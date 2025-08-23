<script setup lang="ts">
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";
import Icon from "~/components/Icon.vue";
import { toolCategories } from "~/shared/constants";

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const categories = toolCategories;

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
      <Icon name="Funnel" /> Categories
    </h3>

    <div class="space-y-2">
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
    </div>
  </FilterSection>
</template>
