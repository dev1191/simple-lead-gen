<script setup lang="ts">
import { toast } from "@steveyuowo/vue-hot-toast";
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
import { slugify } from "~/shared/utils";
import { Eye, Save } from "lucide-vue-next";

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
    status: z.enum(["Draft", "Published"]),
    meta_data: z
      .object({
        cta_text: z.string().optional(),
        cta_link: z.string().optional(),
        stats: z
          .array(
            z.object({
              label: z.string(),
              value: z.string(),
            })
          )
          .optional(),
      })
      .optional(),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      status: "Draft",
      name: "listyourbusiness",
      slug: "",
      title: "",
      content: "",
      seo_title: "",
      seo_description: "",
      seo_keyword: "",
      meta_data: {
        cta_text: "",
        cta_link: "",
        stats: [],
      },
    },
  });

// Create a reactive reference to stats for easier manipulation
const stats = computed({
  get: () => values.meta_data?.stats || [],
  set: (newStats) => {
    setFieldValue("meta_data.stats", newStats);
  },
});

const addStat = () => {
  const currentStats = [...(values.meta_data?.stats || [])];
  currentStats.push({ label: "", value: "" });
  setFieldValue("meta_data.stats", currentStats);
};

const removeStat = (index: number) => {
  const currentStats = [...(values.meta_data?.stats || [])];
  currentStats.splice(index, 1);
  setFieldValue("meta_data.stats", currentStats);
};

const updateStat = (
  index: number,
  field: "label" | "value",
  newValue: string
) => {
  const currentStats = [...(values.meta_data?.stats || [])];
  if (currentStats[index]) {
    currentStats[index][field] = newValue;
    setFieldValue("meta_data.stats", currentStats);
  }
};

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
    const pageData = {
      ...formValues,
      meta_data: {
        cta_text: formValues.meta_data?.cta_text || "",
        cta_link: formValues.meta_data?.cta_link || "",
        stats: formValues.meta_data?.stats || [],
      },
    };

    const result = await upsertPage(pageData);
    toast.success(`Page ${result.action} successfully!`);
  } catch (error: any) {
    toast.error(error.message || "Failed to save page");
  } finally {
    isLoading.value = false;
  }
});

const activeTab = ref("content");
const fetchData = async () => {
  const pathSegments = route.path.split("/").filter(Boolean);
  let slug = pathSegments[pathSegments.length - 1] || "business";
  slug = slug.replace(/-/g, "");

  try {
    const page = await getPage(slug);
    if (page) {
      status.value = page.status;
      resetForm({
        values: {
          ...page,
          meta_data: {
            cta_text: page.meta_data?.cta_text || "",
            cta_link: page.meta_data?.cta_link || "",
            stats: page.meta_data?.stats || [],
          },
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
  <AdminLayoutPage title="Editing: List Your Business" description="" sticky>
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

    <form @submit.prevent="onSubmit" id="abouts-form" class="w-full">
      <Tabs v-model="activeTab" defaultValue="content" class="w-full">
        <!-- Tabs List -->
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="extras">Extra Settings</TabsTrigger>
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
                    id="content"
                    placeholder="Write your content here..."
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </TabsContent>

        <!-- Extra Settings / Stats Tab -->
        <TabsContent value="extras" force-render>
          <div class="flex flex-col space-y-6">
            <Separator />
            <h2 class="text-2xl font-bold">Page Extra Settings</h2>

            <!-- CTA Text -->
            <FormField name="meta_data.cta_text" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>CTA Button Text</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Start Your Application →"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- CTA Link -->
            <FormField name="meta_data.cta_link" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>CTA Button Link</FormLabel>
                <FormControl>
                  <Input placeholder="/apply" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Stats (dynamic array) -->
            <div>
              <Label class="text-base font-semibold mb-2 block">Stats</Label>
              <div
                v-for="(stat, i) in stats"
                :key="`stat-${i}`"
                class="flex gap-2 mb-2 p-2 border rounded-lg bg-gray-50"
              >
                <div class="flex-1">
                  <Label class="text-sm text-gray-600 mb-1 block">Value</Label>
                  <Input
                    :model-value="stat.value"
                    @update:model-value="
                      updateStat(
                        i,
                        'value',
                        ($event.target as HTMLInputElement).value
                      )
                    "
                    placeholder="50K+"
                  />
                </div>
                <div class="flex-1">
                  <Label class="text-sm text-gray-600 mb-1 block">Label</Label>
                  <Input
                    :model-value="stat.label"
                    @update:model-value="
                      updateStat(
                        i,
                        'label',
                        ($event.target as HTMLInputElement).value
                      )
                    "
                    placeholder="Monthly Visitors"
                  />
                </div>
                <div class="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    @click="removeStat(i)"
                  >
                    <Icon name="Trash2" class="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                class="mt-2"
                @click="addStat"
              >
                + Add Stat
              </Button>
            </div>
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
