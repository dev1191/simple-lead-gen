<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const props = defineProps({
  modelValue: {
    type: String, // single select
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

const options = ["Yes", "No"];
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Free Trial Available
    </h3>

    <div
      v-for="o in options"
      :key="o"
      class="flex items-center text-sm space-x-2"
    >
      <Checkbox
        :id="o"
        class="h-4 w-4"
        :checked="selected === o"
        @update:model-value="selected = $event ? o : ''"
      />
      <label :for="o">{{ o }}</label>
    </div>
  </FilterSection>
</template>
