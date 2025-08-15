<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-vue-next";

interface Props {
  modelValue: string[] | null | undefined;
  placeholder?: string;
  maxItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Enter a key feature",
  maxItems: 6,
});

const items = ref<string[]>(
  Array.isArray(props.modelValue) ? [...props.modelValue] : []
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const update = () => {
  emit("update:modelValue", items.value);
};

const updateItem = (index: number, value: string) => {
  items.value[index] = value;
  update();
};

const addItem = () => {
  if (items.value.length < props.maxItems) {
    items.value.push("");
    update();
  }
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
  update();
};

watch(
  () => props.modelValue,
  (newVal) => {
    items.value = Array.isArray(newVal) ? [...newVal] : [];
    if (items.value.length === 0) {
      items.value.push("");
    }
  }
);

const canAdd = computed(() => items.value.length < props.maxItems);

onMounted(() => {
  if (items.value.length === 0) {
    items.value.push("");
    update();
  }
});
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center gap-2"
    >
      <Input
        :model-value="items[index]"
        :placeholder="props.placeholder"
        @update:model-value="(value) => updateItem(index, value)"
        class="flex-1"
      />
      <!-- Show remove button if there is more than 1 item -->
      <Button
        type="button"
        v-if="items.length > 1"
        variant="outline"
        size="icon"
        @click="removeItem(index)"
      >
        <X class="w-4 h-4" />
      </Button>
    </div>
    <Button
      type="button"
      v-if="canAdd"
      variant="outline"
      @click="addItem"
      class="flex items-center gap-1"
    >
      <Plus class="w-4 h-4" />
      Add Item
    </Button>
  </div>
</template>
