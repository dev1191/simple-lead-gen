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
  service_sub_categories?: SubCategory[];
}

interface SelectedCategory {
  id: string;
  name: string;
  sub_categories: SubCategory[];
}

interface Props {
  modelValue: SelectedCategory[];
  categories: Category[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: SelectedCategory[]]
}>();

// Track expansion state
const expanded = ref<Record<string, boolean>>({});

// Check if a category or subcategory is selected
const isItemSelected = (id: string): boolean => {
  return props.modelValue.some(cat => {
    if (cat.id === id) return true;
    return cat.sub_categories.some(sub => sub.id === id);
  });
};

// Get selected subcategories of a category
const getSelectedSubcategories = (categoryId: string): SubCategory[] => {
  const selectedCat = props.modelValue.find(cat => cat.id === categoryId);
  return selectedCat ? selectedCat.sub_categories : [];
};

// Toggle category selection
const toggleCategory = (category: Category) => {
  const isSelected = isItemSelected(category.id);
  let newModelValue = [...props.modelValue];

  if (isSelected) {
    // Remove category completely
    newModelValue = newModelValue.filter(cat => cat.id !== category.id);
  } else {
    // Add category with all subcategories
    const newCategory: SelectedCategory = {
      id: category.id,
      name: category.name,
      sub_categories: category.service_sub_categories || []
    };
    newModelValue.push(newCategory);
  }

  emit('update:modelValue', newModelValue);
};

// Toggle subcategory selection
const toggleSubcategory = (subcategory: SubCategory, parentCategory: Category) => {
  let newModelValue = [...props.modelValue];
  const existingCategoryIndex = newModelValue.findIndex(cat => cat.id === parentCategory.id);

  if (existingCategoryIndex >= 0) {
    const existingCategory = newModelValue[existingCategoryIndex];
    const subExists = existingCategory.sub_categories.some(sub => sub.id === subcategory.id);

    if (subExists) {
      // Remove subcategory
      existingCategory.sub_categories = existingCategory.sub_categories.filter(sub => sub.id !== subcategory.id);
      if (existingCategory.sub_categories.length === 0) {
        newModelValue.splice(existingCategoryIndex, 1);
      }
    } else {
      // Add subcategory
      existingCategory.sub_categories.push(subcategory);
    }
  } else {
    // Category doesn't exist, create it with this subcategory
    const newCategory: SelectedCategory = {
      id: parentCategory.id,
      name: parentCategory.name,
      sub_categories: [subcategory]
    };
    newModelValue.push(newCategory);
  }

  emit('update:modelValue', newModelValue);
};

// Toggle expansion
const toggleExpand = (catId: string) => {
  expanded.value[catId] = !expanded.value[catId];
};

// Check if expanded
const isExpanded = (catId: string) => {
  return expanded.value[catId] || false;
};

// Get checkbox state for category
const getCategoryCheckboxState = (category: Category) => {
  const selectedSubs = getSelectedSubcategories(category.id);
  const totalSubs = category.service_sub_categories?.length || 0;

  if (totalSubs === 0) return isItemSelected(category.id);

  // ✅ Parent is checked if at least one subcategory is selected
  return selectedSubs.length > 0;
};
</script>

<template>
  <div class="border rounded-md p-2 space-y-1">
    <!-- Debug info -->
    <!-- <div class="text-xs bg-gray-100 p-2 rounded mb-2">
      <div><strong>Current modelValue:</strong></div>
      <pre class="text-xs">{{ JSON.stringify(modelValue, null, 2) }}</pre>
    </div> -->

    <template v-for="cat in categories" :key="cat.id">
      <!-- Category row -->
      <div class="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded">
        <div class="flex items-center gap-2 flex-1">
          <Checkbox
            :checked="getCategoryCheckboxState(cat)"
            @click="toggleCategory(cat)"
          />
          <span
            class="font-semibold cursor-pointer select-none"
            @click="toggleExpand(cat.id)"
          >
            {{ cat.name }}
          </span>
        </div>
        <div
          v-if="cat.service_sub_categories && cat.service_sub_categories.length > 0"
          @click="toggleExpand(cat.id)"
          class="cursor-pointer p-1"
        >
          <ChevronDown v-if="isExpanded(cat.id)" class="h-4 w-4" />
          <ChevronRight v-else class="h-4 w-4" />
        </div>
      </div>

      <!-- Subcategories -->
      <div v-if="isExpanded(cat.id) && cat.service_sub_categories" class="pl-8 space-y-1">
        <div
          v-for="sub in cat.service_sub_categories"
          :key="sub.id"
          class="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded"
        >
          <Checkbox
            :checked="isItemSelected(sub.id)"
            @click="toggleSubcategory(sub, cat)"
          />
          <span class="select-none">{{ sub.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
