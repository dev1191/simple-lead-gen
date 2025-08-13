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
    service_categories: z
      .array(z.string())
      .min(1, "Select at least one category"),
    provider_name: z.string().min(1, "Provider name is required"),
    provider_email: z.email("Provider email is required"),
    for: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
    tags: z.array(z.string()).min(1, "Please select at least one tag"),
    seo_title: z.string().min(1, "SEO Title is required"),
    description: z.string().min(1, "SEO Description is required"),
    status: z.enum(["Draft", "Published"]),
  })
);

const { fetchCategories, categories } = useServices();
const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      tagline: "",
      service_categories: [],
      logo: "",
      banner: "",
      provider_name: "",
      provider_email: "",
      seo_title: "",
      seo_description: "",
    },
  });

const forItems = [
  {
    id: "solopreneurs",
    label: "Solopreneurs",
  },
  {
    id: "early-stage-startups",
    label: "Early-stage Startups",
  },
  {
    id: "smes",
    label: "SMEs",
  },
  {
    id: "vc-backed-startups",
    label: "VC-backed Startups",
  },
  {
    id: "remote-teams",
    label: "Remote Teams",
  },
] as const;

const selected = ref<string[]>([]);

const onSubmit = () => {};

onMounted(() => fetchCategories());
</script>

<template>
  <form @submit.prevent="onSubmit" id="service-form">
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

        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <!-- Categories -->
          <FormField
           v-slot="{ value, handleChange }"
            name="service_categories"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Select Categories<span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <MultiSelectSubSelect
                  :model-value="value"
                  @update:model-value="handleChange"
                  :categories="categories"
                  placeholder="Choose categories & subs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <FormField name="logo">
            <FormItem>
              <FormLabel
                >Company Logo (1:1)<span class="text-red-500"
                  >*</span
                ></FormLabel
              >
              <FormControl>
                <FileUploader v-model="logo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="banner">
            <FormItem>
              <FormLabel
                >Cover Banner (16:9)
                <span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <FileUploader v-model="banner" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <!-- Name -->
          <FormField
            v-slot="{ componentField }"
            name="provider_name"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Provider Name <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter provider name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Name -->
          <FormField
            v-slot="{ componentField }"
            name="provider_email"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Provider Email Address
                <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter provider email address"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </template>
    </BaseCard>

    <BaseCard
      class="mt-4"
      className="5xl"
      title="Section 2: Service Details"
      :isFooter="false"
    >
      <template #default>
        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <!-- Name -->
          <FormField
            v-slot="{ componentField }"
            name="description"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Full Service Description <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  type="text"
                  placeholder="Enter full service description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="for"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Who is this for?<span class="text-red-500">*</span>
              </FormLabel>

              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </template>
    </BaseCard>
  </form>
</template>

<style scoped></style>
