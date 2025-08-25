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
    seo_title: z.string().min(1, "Meta Title is required"),
    seo_description: z.string().min(1, "Meta Description is required"),
    seo_keyword: z.string().min(1, "Meta Keywords is required"),
    status: z.enum(["Draft", "Published"]),
    featured_services: z
      .array(z.string())
      .min(1, "Please select at least one featured services"),
    featured_tools: z
      .array(z.string())
      .min(1, "Please select at least one featured tools"),
    featured_in: z
      .array(z.string())
      .min(1, "Please select at least one featured tools"),
    more_services: z
      .array(z.string())
      .min(1, "Please select at least one more service"),
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
      featured_in: [],
      more_services: [],
      title: "",
      sub_title: "",
      image_url: "",
      seo_title: "",
      seo_description: "",
      seo_keyword: "",
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
      seo_keyword: formValues.seo_keyword,
      meta_data: {
        sub_title: formValues.sub_title,
        featured_services: formValues.featured_services,
        featured_tools: formValues.featured_tools,
        featured_in: formValues.featured_in,
        more_services: formValues.more_services,
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

const activeTab = ref<string>("hero");

const fetchData = async () => {
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
          seo_keyword: page.seo_description,
          sub_title: page.meta_data.sub_title,
          featured_services: page.meta_data.featured_services,
          featured_tools: page.meta_data.featured_tools,
          featured_in: page.meta_data.featured_in,
          more_services: page.meta_data.more_services,
          imageFile: null,
        },
      });
    }
  } catch (error) {
    toast.error("Failed to load page data");
  }
};
watch(activeTab, async (tab) => {
  await fetchData();
});

onMounted(async () => {
  await fetchData();
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
        <Save v-else class="w-4 h-4 mr-2" /> Save Changes
      </Button>
    </template>

    <form
      @submit.prevent="onSubmit"
      id="abouts-form"
      class="grid grid-cols-1 gap-6"
    >
      <Tabs v-model="activeTab" defaultValue="hero" class="w-full">
        <!-- Tabs List -->
        <TabsList class="h-12">
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="featured">Featured Items</TabsTrigger>
          <TabsTrigger value="seo">SEO Metadata</TabsTrigger>
        </TabsList>

        <!-- Hero Content Tab -->
        <TabsContent value="hero" force-render>
          <div class="flex flex-col space-y-6">
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
                  <Input placeholder="Enter title" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- SubTitle -->
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
                  <Textarea
                    placeholder="Enter sub title"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Hero Image -->
            <FormField name="imageFile">
              <FormItem>
                <FormLabel>Hero Image</FormLabel>
                <FormControl>
                  <FileUploader
                    v-model="imageFile"
                    :previewUrl="values.image_url"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </TabsContent>

        <!-- Featured Items Tab -->
        <TabsContent value="featured" force-render>
          <div class="flex flex-col space-y-6">
            <!-- Featured Services -->
            <FormField
              v-slot="{ componentField }"
              name="featured_services"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Featured Services
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

            <!-- Featured Tools -->
            <FormField
              v-slot="{ componentField }"
              name="featured_tools"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Featured Tools <span class="text-red-500">*</span></FormLabel
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

            <!-- Featured In -->
            <FormField
              v-slot="{ componentField }"
              name="featured_in"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Featured In <span class="text-red-500">*</span></FormLabel
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
                    <TagsInputInput placeholder="Featured in" />
                  </TagsInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- More Services -->
            <FormField
              v-slot="{ componentField }"
              name="more_services"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >More Services <span class="text-red-500">*</span></FormLabel
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
                    <TagsInputInput placeholder="More services" />
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
        </TabsContent>

        <!-- SEO Metadata Tab -->
        <TabsContent value="seo" force-render>
          <div class="flex flex-col space-y-6">
            <FormField
              v-slot="{ componentField }"
              name="seo_title"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Meta Title <span class="text-red-500">*</span></FormLabel
                >
                <FormControl>
                  <Input
                    placeholder="Enter meta title"
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
                <FormLabel
                  >Meta Description
                  <span class="text-red-500">*</span></FormLabel
                >
                <FormControl>
                  <Textarea
                    placeholder="Enter meta description"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="seo_keyword"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Meta Keywords <span class="text-red-500">*</span></FormLabel
                >
                <FormControl>
                  <Input
                    placeholder="Enter meta keywords separated by commas"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  </AdminLayoutPage>
</template>
<style scoped></style>
