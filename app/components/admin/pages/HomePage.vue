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
import { Eye, Save } from "lucide-vue-next";
import Icon from "~/components/Icon.vue";

const imageFile = ref<File>(null);
const isLoading = ref<boolean>(false);
const status = ref("");

const { getPage, upsertPage } = usePages();
const { uploadFile } = useUpload();
const route = useRoute();

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(200),
    sub_title: z.string().min(2).max(200),
    name: z.string().optional(),
    image_url: z.string().optional(),
    seo_title: z.string().min(1, "SEO Title is required"),
    seo_description: z.string().min(1, "SEO Description is required"),
    status: z.enum(["Draft", "Published"]),
    featured_services: z
      .array(z.string())
      .min(1, "Please select at least one featured services"),
    featured_tools: z
      .array(z.string())
      .min(1, "Please select at least one featured tools"),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      status: "Published",
      name: "homepage",
      featured_services: [],
      featured_tools: [],
      title: "",
      sub_title: "",
      image_url: "",
      seo_title: "",
      seo_description: "",
    },
  });

const onSubmit = handleSubmit(async (formValues) => {
  isLoading.value = true;

  try {
    let imageUrl = formValues.image_url;

    // Upload image if file selected
    if (imageFile.value) {
      imageUrl = await uploadFile(imageFile.value, "uploads", "pages");
      setFieldValue("image_url", imageUrl);
    }

    // Prepare page data to save
    const pageData = {
      title: formValues.title,
      status: formValues.status,
      name: formValues.name,
      seo_title: formValues.seo_title,
      seo_description: formValues.seo_description,
      meta_data: {
        sub_title: formValues.sub_title,
        featured_services: formValues.featured_services,
        featured_tools: formValues.featured_tools,
      },
      image_url: imageUrl,
    };

    const result = await upsertPage(pageData);
    toast.success(`Page ${result.action} successfully!`);
    // Optionally reset form or keep values
    // resetForm();
  } catch (error: any) {
    toast.error(error.message || "Failed to save page");
  } finally {
    isLoading.value = false;
  }
});

onMounted(async () => {
  const pathSegments = route.path.split("/").filter(Boolean);
  let slug = pathSegments[pathSegments.length - 1] || "aboutus";
  slug = slug.replace(/-/g, "");

  try {
    const page = await getPage(slug);
    if (page) {
      status.value = page.status;
      resetForm({
        values: {
          title: page.title,
          status: page.status,
          name: page.name,
          seo_title: page.seo_title,
          seo_description: page.seo_description,
          sub_title: page.meta_data.sub_title,
          featured_services: page.meta_data.featured_services,
          featured_tools: page.meta_data.featured_tools,
          imageFile: null,
        },
      });
    }
  } catch (error) {
    toast.error("Failed to load page data");
  }
});
</script>

<template>
  <AdminLayoutPage title="Editing: Home Page" description="" sticky>
    <template #actions>
      <Badge
        v-if="status"
        variant="secondary"
        :class="
          status === 'Published'
            ? 'bg-green-200 text-green-700 font-semibold'
            : 'bg-yellow-200 text-yellow-700 font-semibold'
        "
        >{{ status }}</Badge
      >
      <Button variant="outline"> <Eye class="w-4 h-4 mr-2" /> Preview</Button>
      <Button type="button" @click="onSubmit" :disabled="isLoading">
        <Icon
          name="Loader2"
          v-if="isLoading"
          :size="18"
          class="mr-2 h-4 w-4 animate-spin"
        />
        <Save v-else class="w-4 h-4 mr-2" /> Save Changes</Button
      >
    </template>
    <form
      @submit.prevent="onSubmit"
      id="abouts-form"
      class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6"
    >
      <!-- Left Column -->
      <div class="flex flex-col space-y-6 flex-1">
        <!-- Title -->
        <FormField
          v-slot="{ componentField }"
          name="title"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel
              >Hero Title <span class="text-red-500">*</span></FormLabel
            >
            <FormControl>
              <Input
                type="text"
                placeholder="Enter title"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ componentField }"
          name="sub_title"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel
              >Hero SubTitle <span class="text-red-500">*</span></FormLabel
            >
            <FormControl>
              <Textarea placeholder="Enter sub title" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- featured services -->
        <FormField
          v-slot="{ componentField }"
          name="featured_services"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel
              >Featured Services (Type and press Enter)
              <span class="text-red-500">*</span></FormLabel
            >
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
                <TagsInputInput placeholder="Featured services" />
              </TagsInput>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- featured services -->
        <FormField
          v-slot="{ componentField }"
          name="featured_tools"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel
              >Featured Tools (Type and press Enter)
              <span class="text-red-500">*</span></FormLabel
            >
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
                <TagsInputInput placeholder="Featured tools" />
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
      </div>

      <!-- Right Column -->
      <div class="flex flex-col space-y-6 flex-1">
        <!-- Images -->
        <FormField name="imageFile">
          <FormItem>
            <FormLabel>Hero Image </FormLabel>
            <FormControl>
              <FileUploader
                v-model="imageFile"
                :previewUrl="values.image_url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

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
    </form>
  </AdminLayoutPage>
</template>
<style scoped></style>
