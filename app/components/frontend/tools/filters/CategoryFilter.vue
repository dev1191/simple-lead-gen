<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";
import Icon from "~/components/Icon.vue";
import { toolCategories } from "~/shared/constants";

const props = defineProps({
  modelValue: {
    type: String, // for single select; use Array for multi-select
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const selected = ref(props.modelValue);

// Watch internal value and emit changes to parent
watch(selected, (val) => emit("update:modelValue", val));

// Update internal value if parent changes it
watch(
  () => props.modelValue,
  (val) => {
    selected.value = val;
  }
);

const categories = toolCategories;
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      <Icon name="Funnel" /> Categories
    </h3>

    <div v-for="c in categories" :key="c.value" class="flex items-center text-sm space-x-2">
      <Checkbox
        :id="c.value"
        class="h-4 w-4"
        :checked="selected === c.value"
        @update:model-value="selected = $event ? c.value : ''"
      />
      <label :for="c.value">{{ c.label }}</label>
    </div>
  </FilterSection>
</template>
