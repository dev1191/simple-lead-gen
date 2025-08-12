<script setup lang="ts">
import { ref } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-vue-next";

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories?: SubCategory[];
}

interface Props {
  modelValue: string[];
  categories: Category[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

// Track expanded/collapsed categories using a Set inside a ref
const expanded = ref(new Set<string>());

const isSelected = (id: string) => props.modelValue.includes(id);

const toggleSelect = (id: string, children: string[] = []) => {
  let updated = [...props.modelValue];
  if (isSelected(id)) {
    updated = updated.filter((v) => v !== id && !children.includes(v));
  } else {
    updated.push(id, ...children.filter((c) => !updated.includes(c)));
  }
  emit("update:modelValue", updated);
};

const toggleChild = (id: string) => {
  let updated = [...props.modelValue];
  if (isSelected(id)) {
    updated = updated.filter((v) => v !== id);
  } else {
    updated.push(id);
  }
  emit("update:modelValue", updated);
};

const toggleExpand = (catId: string) => {
  if (expanded.value.has(catId)) {
    expanded.value.delete(catId);
  } else {
    expanded.value.add(catId);
  }
};
</script>

<template>
  <div class="border rounded-md p-2 space-y-1">
    <template v-for="cat in props.categories" :key="cat.id">
      <!-- Category row -->
      <div class="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
        <div @click="toggleExpand(cat.id)" class="flex items-center gap-2 flex-1">
          <Checkbox
            :checked="isSelected(cat.id)"
            @update:checked="() =>
              toggleSelect(cat.id, cat.subcategories?.map((s) => s.id) || [])"
          />
          <span class="font-semibold" >{{ cat.name }}</span>
        </div>
        <div v-if="cat.subcategories?.length" @click="toggleExpand(cat.id)">
          <ChevronDown
            v-if="expanded.has(cat.id)"
            class="h-4 w-4"
          />
          <ChevronRight
            v-else
            class="h-4 w-4"
          />
        </div>
      </div>
      <!-- Subcategories -->
      <div v-if="expanded.has(cat.id)" class="pl-8 space-y-1">
        <div
          v-for="sub in cat.subcategories"
          :key="sub.id"
          class="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded"
        >
          <Checkbox
            :checked="isSelected(sub.id)"
            @update:checked="() => toggleChild(sub.id)"
          />
          <span>{{ sub.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>