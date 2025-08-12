<script setup lang="ts">
import type { BlogPost } from "~/shared/types/blogPost";
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
import { BlogCategories } from "~/shared/constants";

const props = defineProps<{ post: BlogPost; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const { updatePost, fetchPosts } = useBlogPosts();

const isOpen = ref<boolean>(props.modelValue);
const post = ref(props.post);
const isLoading = ref(false);
const categories = ref(BlogCategories);
const imageFile = ref<File | undefined>(undefined);

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(50),
    slug: z.string().optional(),
    category: z.string().min(1, "Please select a category"),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).min(1, "Please select at least one tag"),
    seo_title: z.string().min(1, "SEO Title is required"),
    seo_description: z.string().min(1, "SEO Description is required"),
    status: z.enum(["Draft", "Published"]),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      status: post.value.status,
      tags: post.value.tags,
      slug: post.value.slug,
      title: post.value.title,
      category: post.value.category,
      content: post.value.content,
      seo_title: post.value.seo_title,
      seo_description: post.value.seo_description,
    },
  });

// Handle file upload
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files[0];
  if (file) {
    // You can store the file object or just the filename
    imageFile.value = file;
    // If you need the actual file object for upload, store it separately:
    // selectedFile.value = file;
  } else {
    imageFile.value = undefined;
  }
};

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};

const onSubmit = async () => {
  isLoading.value = true;
  try {
    const response = await updatePost(post.value.id, values, imageFile.value);

    // Show success message
    toast.success("Post updated successfully!");

    // Reset form and close modal
    resetForm();
    handleCancel();
    fetchPosts();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create post. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="edit"
    title="Edit Article"
    @update:open="handleCancel"
    size="six"
  >
    <template #default>
      <form
        @submit.prevent="onSubmit"
        class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6"
        id="blog-form"
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
              <FormLabel>Content <span class="text-red-500">*</span></FormLabel>
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

          <!-- Image -->
          <FormField name="imageFile">
            <FormItem>
              <FormLabel>Image </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                />
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
                  SEO Title <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter SEO title"
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
                  SEO Description <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter SEO description"
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
      <Button type="button" @click="onSubmit" :disabled="isLoading">
        <Icon
          name="Loader2"
          v-if="isLoading"
          :size="18"
          class="mr-2 h-4 w-4 animate-spin"
        />
        Update Article
      </Button>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
