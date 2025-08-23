<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
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
      Free Trial Available
    </h3>

    <div
      v-for="o in options"
      :key="o.value"
      class="flex items-center text-sm space-x-2"
    >
      <Checkbox
        :id="o.label"
        class="h-5 w-5"
        :model-value="props.modelValue.includes(o.value)"
        @update:model-value="(checked) => handleChange(o.value, checked)"
      />
      <label :for="o.label">{{ o.label }}</label>
    </div>
  </FilterSection>
</template>
