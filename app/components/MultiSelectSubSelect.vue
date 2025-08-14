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
  sub_categories?: SubCategory[];
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
  "update:modelValue": [value: SelectedCategory[]];
}>();

const expanded = ref<Record<string, boolean>>({});

// ✅ Check if an item (category or subcategory) is selected
const isItemSelected = (id: string): boolean => {
  return props.modelValue.some((cat) => {
    if (cat.id === id) return true;
    return cat.sub_categories.some((sub) => sub.id === id);
  });
};

// ✅ Get selected subcategories for a category
const getSelectedSubcategories = (categoryId: string): SubCategory[] => {
  const selectedCat = props.modelValue.find((cat) => cat.id === categoryId);
  return selectedCat ? selectedCat.sub_categories : [];
};

// ✅ Get category checkbox state: true | false | "indeterminate"
const getCategoryCheckboxState = (category: Category) => {
  const selectedSubs = getSelectedSubcategories(category.id);
  const totalSubs = category.sub_categories?.length || 0;

  if (totalSubs === 0) {
    return isItemSelected(category.id) ? true : false;
  }

  if (selectedSubs.length === totalSubs) return true;
  if (selectedSubs.length > 0) return "indeterminate";
  return false;
};

// ✅ Toggle category selection
const toggleCategory = (category: Category, checked: boolean) => {
  let newModelValue = [...props.modelValue];

  if (checked) {
    // Select all subcategories
    const newCategory: SelectedCategory = {
      id: category.id,
      name: category.name,
      sub_categories: category.sub_categories || [],
    };
    newModelValue = newModelValue.filter((cat) => cat.id !== category.id);
    newModelValue.push(newCategory);
  } else {
    // Remove category completely
    newModelValue = newModelValue.filter((cat) => cat.id !== category.id);
  }

  emit("update:modelValue", newModelValue);
};

// ✅ Toggle subcategory selection
const toggleSubcategory = (
  subcategory: SubCategory,
  parentCategory: Category,
  checked: boolean
) => {
  let newModelValue = [...props.modelValue];
  const existingCategoryIndex = newModelValue.findIndex(
    (cat) => cat.id === parentCategory.id
  );

  if (checked) {
    // Add subcategory
    if (existingCategoryIndex >= 0) {
      const existingCategory = newModelValue[existingCategoryIndex];
      if (!existingCategory.sub_categories.some((sub) => sub.id === subcategory.id)) {
        existingCategory.sub_categories.push(subcategory);
      }
    } else {
      newModelValue.push({
        id: parentCategory.id,
        name: parentCategory.name,
        sub_categories: [subcategory],
      });
    }
  } else {
    // Remove subcategory
    if (existingCategoryIndex >= 0) {
      const existingCategory = newModelValue[existingCategoryIndex];
      existingCategory.sub_categories = existingCategory.sub_categories.filter(
        (sub) => sub.id !== subcategory.id
      );
      if (existingCategory.sub_categories.length === 0) {
        newModelValue.splice(existingCategoryIndex, 1);
      }
    }
  }

  emit("update:modelValue", newModelValue);
};

// ✅ Expand / collapse
const toggleExpand = (catId: string) => {
  expanded.value[catId] = !expanded.value[catId];
};

const isExpanded = (catId: string) => expanded.value[catId] || false;
</script>

<template>
  <div class="border rounded-md p-2 space-y-1">
    <template v-for="cat in categories" :key="cat.id">
      <!-- Category row -->
      <div
        class="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded"
      >
        <div class="flex items-center gap-2 flex-1">
          <Checkbox
            class="w-5 h-5"
            :model-value="getCategoryCheckboxState(cat)"
            @update:model-value="(val) => toggleCategory(cat, val)"
          />
          <span
            class="font-semibold cursor-pointer select-none"
            @click="toggleExpand(cat.id)"
          >
            {{ cat.name }}
          </span>
        </div>
        <div
          v-if="cat.sub_categories && cat.sub_categories.length > 0"
          @click="toggleExpand(cat.id)"
          class="cursor-pointer p-1"
        >
          <ChevronDown v-if="isExpanded(cat.id)" class="h-4 w-4" />
          <ChevronRight v-else class="h-4 w-4" />
        </div>
      </div>

      <!-- Subcategories -->
      <div
        v-if="isExpanded(cat.id) && cat.sub_categories"
        class="pl-8 space-y-1"
      >
        <div
          v-for="sub in cat.sub_categories"
          :key="sub.id"
          class="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded"
        >
          <Checkbox
            class="w-5 h-5"
            :model-value="isItemSelected(sub.id)"
            @update:model-value="(val) => toggleSubcategory(sub, cat, val)"
          />
          <span class="select-none">{{ sub.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
