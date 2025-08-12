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

const logo = ref<File>(null);
const banner = ref<File>(null);
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(150),
    tagline: z.string().min(2).max(150),
    categories: z.array(),
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
      name: "",
      tagline: "",
      categories: [],
      logo: "",
      banner: "",
      seo_title: "",
      seo_description: "",
    },
  });

const categories = [
  {
    id: "cat1",
    name: "Category A",
    subcategories: [
      { id: "sub1", name: "Sub A1" },
      { id: "sub2", name: "Sub A2" },
    ],
  },
  {
    id: "cat2",
    name: "Category B",
    subcategories: [{ id: "sub3", name: "Sub B1" }],
  },
];

const selected = ref<string[]>([]);

const onSubmit = () => {};
</script>

<template>
  <form @submit.prevent="onSubmit" id="service-form">
    <BaseCard className="5xl" title="Section 1: Basic Information">
      <template #default>
        <!-- Left Column: Title, Category, Content -->
        <div class="grid grid-cols-2 gap-8 w-full m-4">
          <!-- Name -->
          <FormField
            v-slot="{ componentField }"
            name="name"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Service/Business Name <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter service/business Name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Name -->
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
                  placeholder="Enter tagline"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-1 gap-8 w-full m-4">
          <!-- Categories -->
          <FormField
            v-slot="{ componentField }"
            name="categories"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Select Categories<span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <MultiSelectSubSelect
                  v-bind="componentField"
                  :categories="categories"
                  placeholder="Choose categories & subs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-8 w-full m-4">
          <FormField name="logo">
            <FormItem>
              <FormLabel>Company Logo (1:1)<span class="text-red-500">*</span></FormLabel>
              <FormControl>
                <FileUploader v-model="logo"  />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="banner">
            <FormItem>
              <FormLabel>Cover Banner (16:9) <span class="text-red-500">*</span></FormLabel>
              <FormControl>
                <FileUploader v-model="banner"  />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </template>
    </BaseCard>
  </form>
</template>

<style scoped></style>
