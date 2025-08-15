<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "@steveyuowo/vue-hot-toast";
import { useForm } from "vee-validate";
import * as z from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Tool } from "~/shared/types/tools";
import { fileWithAspectRatio } from "~/shared/utils";
import { toolCategories } from "~/shared/constants";

const isLoading = ref(false);
const props = defineProps<{ tool: Tool; isEditable: boolean }>();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(200),
    tagline: z.string().min(2).max(150),
    category: z.string().min(1, "Select at least one category"),
    sub_categories: z
      .array(z.string())
      .min(1, "Select at least one sub categories"),
    logo_url: fileWithAspectRatio(1, 1), // 1:1 aspect ratio
    banner_url: z.string().optional(), // 16:9 aspect ratio
    description: z
      .string()
      .min(1, "Detailed description of your tool is required"),
    problem_solved: z.string().min(1, "Problem solved of tool is required"),
    best_for: z.array(z.string()).min(1, "Select at least one best for"),
    core_features: z
      .array(z.string())
      .min(3, "Select at least three highlights"),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
    pricing_model: z.string("Pricing model is required"),
    type_of_tool: z.string(),
    currency_code: z.string().optional(),
    pricing: z.string().optional(),
    integrations: z.array(z.string()).optional(),
    affiliate_url: z.string().optional(),
    cta_label: z.string().optional(),
    free_trail: z.boolean().optional(),
    client_logos: z.array(z.string()).optional(),
    operate: z
      .array(z.enum(["malaysia", "singapore", "global"]))
      .min(1, "Tool operate is required"),
    platforms: z.array(z.string()).optional(),
  })
);

const serverOptions = [
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

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue, errors } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      sub_categories: [],
    },
  });

// Computed property to get subcategories for selected category
const availableSubcategories = computed(() => {
  const category = toolCategories.find((cat) => cat.value === values.category);
  return category ? category.subcategories : [];
});

watch(
  () => values.category,
  () => setFieldValue("sub_categories", [])
);

// Watch for props.tool to be loaded and transformed
watch(
  () => props.tool,
  (newTool) => {
    if (newTool) {
      resetForm({
        values: {
          ...newTool, // transformed data
        },
      });
    }
  },
  { immediate: true }
);

const onSubmit = () => {};
</script>

<template>
  <form @submit.prevent="onSubmit" id="tool-form">
    <BaseCard
      className="5xl"
      title="Section 1: Basic Information"
      :isFooter="false"
    >
      <template #default>
        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <!-- Name -->
          <FormField
            v-slot="{ componentField }"
            name="name"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Tool / Software Name <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter tool/software Name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Tagline -->
          <FormField
            v-slot="{ componentField }"
            name="tagline"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Tagline / One-Liner (max 150 characters)
                <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Describe your tool in one line..."
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Category -->
        <div class="grid grid-cols-1 mb-5">
          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>
                Tool Categories <span class="text-red-500">*</span>
              </FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="category in toolCategories"
                      :key="category.value"
                      :value="category.value"
                    >
                      {{ category.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Subcategories -->
        <div
          v-if="values.category && availableSubcategories.length > 0"
          class="grid grid-cols-1 mb-5"
        >
          <!-- IMPORTANT: bring handleChange from the slot -->
          <FormField v-slot="{ value, handleChange }" name="sub_categories">
            <FormItem>
              <FormLabel>Select subcategories:</FormLabel>
              <div class="space-y-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="subcategory in availableSubcategories"
                    :key="subcategory.value"
                    class="flex items-center space-x-2 p-1 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <Checkbox
                    class="w-5 h-5"
                      :model-value="value?.includes(subcategory.value) || false"
                      @update:model-value="
                        (checked) =>
                          handleChange(
                            checked
                              ? [...(value || []), subcategory.value]
                              : (value || []).filter((v) => v !== subcategory.value)
                          )
                      "
                    />
                    <Label class="text-sm cursor-pointer">{{
                      subcategory.label
                    }}</Label>
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </template>
    </BaseCard>
  </form>
</template>

<style scoped></style>
