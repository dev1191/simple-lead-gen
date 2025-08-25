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
import { slugify } from "~/shared/utils";
import { Eye, Save } from "lucide-vue-next";
import Icon from "~/components/Icon.vue";

const isLoading = ref<boolean>(false);
const status = ref("");

const { getPage, upsertPage } = usePages();
const route = useRoute();

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(200),
    slug: z.string().min(2).max(200),
    name: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    seo_title: z.string().min(1, "Meta Title is required"),
    seo_description: z.string().min(1, "Meta Description is required"),
    seo_keyword: z.string().min(1, "Meta Keywords is required"),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "contact",
      slug: "",
      title: "",
      content: "",
      seo_title: "",
      seo_description: "",
      seo_keyword: "",
    },
  });

watch(
  () => values.title,
  (newTitle) => {
    const slug = slugify(newTitle ?? "");
    setFieldValue("slug", slug);
  }
);

const onSubmit = handleSubmit(async (formValues) => {
  isLoading.value = true;

  try {
    // Prepare page data to save
    const pageData = {
      ...formValues,
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

const preview = () => {
  navigateTo(`/contact`);
};

const activeTab = ref("content");

const fetchData = async () => {
  const pathSegments = route.path.split("/").filter(Boolean);
  let slug = pathSegments[pathSegments.length - 1] || "contact";
  slug = slug.replace(/-/g, "");

  try {
    const page = await getPage(slug);
    if (page) {
      resetForm({
        values: {
          ...page,
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
  <AdminLayoutPage title="Editing: Contact" description="" sticky>
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
      <Button variant="outline" @click="preview">
        <Eye class="w-4 h-4 mr-2" /> Preview</Button
      >
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
    <form @submit.prevent="onSubmit" id="abouts-form" class="w-full">
      <Tabs v-model="activeTab" defaultValue="content" class="w-full">
        <!-- Tabs List -->
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO Metadata</TabsTrigger>
        </TabsList>

        <!-- Content Tab -->
        <TabsContent value="content" force-render>
          <div class="flex flex-col space-y-6">
            <!-- Page Title -->
            <FormField
              v-slot="{ componentField }"
              name="title"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Page Title <span class="text-red-500">*</span></FormLabel
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

            <!-- Page Slug -->
            <FormField
              v-slot="{ componentField }"
              name="slug"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Page Slug <span class="text-red-500">*</span></FormLabel
                >
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter slug"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Page Content -->
            <FormField
              v-slot="{ componentField }"
              name="content"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel
                  >Page Content <span class="text-red-500">*</span></FormLabel
                >
                <FormControl>
                  <Textarea
                    placeholder="Enter content"
                    rows="10"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </TabsContent>

        <!-- SEO Metadata Tab -->
        <TabsContent value="seo" force-render>
          <div class="flex flex-col space-y-6">
            <Separator />
            <h2 class="text-2xl font-bold">SEO Metadata</h2>

            <!-- SEO Title -->
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
                    type="text"
                    placeholder="Enter meta title"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- SEO Description -->
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

            <!-- SEO Keywords -->
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
