<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import FilterSection from "./FilterSection.vue";

const props = defineProps({
  modelValue: {
    type: String, // single select; use Array for multi-select
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

const pricingOptions = [
  { value: "free_forever", label: "Free Forever" },
  { value: "free_trial", label: "Free Trial Available" },
  { value: "freemium", label: "Freemium" },
  { value: "monthly_subscription", label: "Monthly Subscription" },
  { value: "pay_as_you_go", label: "Pay-as-you-go" },
  { value: "custom_varies", label: "Custom / Varies" },
];
</script>

<template>
  <FilterSection>
    <h3 class="tracking-tight text-sm font-medium flex items-center gap-2">
      Pricing Model
    </h3>
    <div
      v-for="option in pricingOptions"
      :key="option.value"
      class="flex items-center text-sm space-x-2"
    >
      <Checkbox
        :id="option.value"
        class="h-4 w-4"
        :checked="selected === option.value"
        @update:model-value="selected = $event ? option.value : ''"
      />
      <label :for="option.value">{{ option.label }}</label>
    </div>
  </FilterSection>
</template>
