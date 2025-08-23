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

const {
  data: categories,
  pending,
  error,
} = await useFetch<[]>("/api/categories");


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
      :key="category.id"
      class="flex items-center text-sm space-x-2"
    >
      <Checkbox
        :id="category.id"
        :model-value="props.modelValue.includes(category.id)"
        @update:model-value="(checked) => handleChange(category.id, checked)"
        class="h-5 w-5"
      />
      <label
        :for="category.id"
        class="text-sm font-medium leading-none cursor-pointer"
      >
        {{ category.name }}
      </label>
    </div>
  </FilterSection>
</template>
