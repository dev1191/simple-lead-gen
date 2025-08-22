<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const props = defineProps({
  modelValue: {
    type: String, // single select; can change to Array for multi-select
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const selected = ref(props.modelValue);

// Emit changes to parent
watch(selected, (val) => emit("update:modelValue", val));

// Update internal value if parent changes it
watch(
  () => props.modelValue,
  (val) => {
    selected.value = val;
  }
);

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
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Region Served
    </h3>
    <div
      v-for="r in regions"
      :key="r.value"
      class="flex items-center text-sm space-x-2"
    >
      <Checkbox
        :id="r.value"
        class="h-4 w-4"
        :checked="selected === r.value"
        @update:model-value="selected = $event ? r.value : ''"
      />
      <label :for="r.value">{{ r.label }}</label>
    </div>
  </FilterSection>
</template>
