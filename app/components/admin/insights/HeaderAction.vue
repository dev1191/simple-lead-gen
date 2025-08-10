<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
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
import { BlogCategories } from "~/shared/constants";
import { slugify } from "~/shared/utils";

const { label } = defineProps<{
  label: string;
}>();

const isSheetModal = ref<boolean>(false);
const closeSheetModal = () => {
  isSheetModal.value = false;
};

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(50),
    slug: z.string().optional(),
    category: z.string().min(1, "Please select a category"),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).min(1, "Please select at least one tag"),
    seo_title: z.string(),
    seo_description: z.string(),
    status: z.enum(["Draft", "Published"]),
  })
);

const { isFieldDirty, handleSubmit, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    status: "Draft",
    tags: [],
    slug: "",
  },
});

const categories = ref(BlogCategories);
const isLoading = ref(false);

watch(
  () => values.title,
  (newTitle) => {
    if (newTitle) {
      values.slug = slugify(newTitle);
    } else {
      values.slug = "";
    }
  }
);

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  console.log("Form submitted:", values);
  // Handle form submission here
});
</script>

<template>
  <Button class="space-x-1" @click="isSheetModal = true">
    <Icon name="Plus" :size="20" />
    <span>New {{ label }}</span>
  </Button>

  <BaseDialog
    :open="isSheetModal"
    mode="create"
    title="Create New Article"
    description=""
    @update:open="closeSheetModal"
    size="seven"
  >
    <template #default>
      <form
        @submit="onSubmit"
        class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6"
      >
        <!-- Left Column: Title, Category, Content -->
        <div class="flex flex-col space-y-6">
          <!-- Title -->
          <FormField
            v-slot="{ componentField }"
            name="title"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> Title <span class="text-red-500">*</span> </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter blog title"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Category -->
          <FormField
            v-slot="{ componentField }"
            name="category"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Category <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <template
                        v-for="category in categories"
                        :key="category.value"
                      >
                        <SelectItem :value="category.value">
                          {{ category.label }}
                        </SelectItem>
                      </template>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Content -->
          <FormField
            v-slot="{ componentField }"
            name="content"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <EditorTextEditor
                  id="content"
                  v-bind="componentField"
                  placeholder="Write your blog content here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Right Column: Tags, Status, SEO -->
        <div class="flex flex-col space-y-6">
          <!-- Tags -->
          <FormField
            v-slot="{ componentField }"
            name="tags"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Tags (Type and press Enter) <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <TagsInput
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField['onUpdate:modelValue']"
                >
                  <TagsInputItem
                    v-for="item in componentField.modelValue"
                    :key="item"
                    :value="item"
                  >
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                  <TagsInputInput placeholder="tags..." />
                </TagsInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Status -->
          <FormField v-slot="{ componentField }" name="status">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- SEO Settings -->
          <div class="mt-6 space-y-6">
            <Separator />
            <h2 class="text-2xl font-bold">SEO Settings</h2>

            <FormField
              v-slot="{ componentField }"
              name="seo_title"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>
                  Seo Title <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter seo title"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="seo_description"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>
                  Seo Description <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    type="text"
                    placeholder="Enter seo description"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button @click="onSubmit" :disabled="isLoading">
        <Icon
          name="Loader2"
          v-if="isLoading"
          :size="18"
          class="mr-2 h-4 w-4 animate-spin"
        />
        Save changes
      </Button>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
