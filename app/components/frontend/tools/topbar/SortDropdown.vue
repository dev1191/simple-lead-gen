<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const options = [
  { value: 'mostPopular', label: 'Most Popular' },
  { value: 'highestRated', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceLowToHigh', label: 'Price: Low to High' },
  { value: 'priceHighToLow', label: 'Price: High to Low' },
];

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// Watch internal value and emit to parent
watch(internalValue, (val) => {
  emit("update:modelValue", val);
});

// Update internal value if parent changes it
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);
</script>

<template>
  <Select v-model="internalValue">
    <SelectTrigger class="w-44">
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</SelectItem>
    </SelectContent>
  </Select>
</template>
