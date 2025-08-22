<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

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
  <div class="relative w-full max-w-md">
    <Search class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <Input
      type="text"
      placeholder="Search tools, features, or use cases..."
      class="pl-8"
      v-model="internalValue"
    />
  </div>
</template>
