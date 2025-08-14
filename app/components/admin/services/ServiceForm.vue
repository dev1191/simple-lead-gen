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
import DynamicInputList from "~/components/DynamicInputList.vue";
import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
import { fileWithAspectRatio } from "../../../shared/utils";

const logo = ref<File>(null);
const banner = ref<File>(null);
const clientLogoFiles = ref<File>(null);
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(150),
    service_tagline: z.string().min(2).max(150),
    service_categories: z
      .array(z.string())
      .min(1, "Select at least one category"),
    highlights: z.array(z.string()).min(3, "Select at least three highlights"),
    included: z.array(z.string()).min(3, "Select at least three highlights"),
    provider_name: z.string().min(1, "Provider name is required"),
    provider_email: z.email("Provider email is required"),
    business_types: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    logo_url: fileWithAspectRatio(1, 1), // 1:1 aspect ratio
    banner_url: fileWithAspectRatio(16, 9), // 16:9 aspect ratio
    type_of_service: z.string(),
    currency_code: z.string().optional(),
    pricing: z.string().optional(),
    turnaround_time: z.string("Typical turnaround time is required"),
    url: z.string().optional(),
    description: z.string().min(1, "SEO Description is required"),
    free_consulatation: z.boolean().optional(),
    client_logos: z.array(z.instanceof(File)).optional(),
    servers: z
      .array(z.enum(["malaysia", "singapore", "global"]))
      .min(1, "Please select at least one country serve"),
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

const { fetchCategories, categories } = useServices();
const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue, errors } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      service_tagline: "",
      service_categories: [],
      type_of_service: "",
      business_types: [],
      highlights: [],
      included: [],
      currency_code: "MYR",
      pricing: "",
      turnaround_time: "within-48-hours",
      free_consulatation: false,
      client_logos: [],
      servers: [],
      url: "",
      banner_url: undefined,
      logo_url: undefined,
      provider_name: "",
      provider_email: "",
      description: "",
    },
  });

const businessTypeOptions = [
  {
    value: "solopreneurs",
    label: "Solopreneurs",
  },
  {
    value: "early_stage_startups",
    label: "Early-stage Startups",
  },
  {
    value: "smes",
    label: "SMEs",
  },
  {
    value: "vc_backed_startups",
    label: "VC-backed Startups",
  },
  {
    value: "remote_teams",
    label: "Remote Teams",
  },
];

const handleServerChange = (
  checked: any,
  serverValue: any,
  currentValue: any,
  handleChange: any
) => {
  const newValue = currentValue || [];
  if (checked) {
    handleChange([...newValue, serverValue]);
  } else {
    handleChange(newValue.filter((item) => item !== serverValue));
  }
};

const handleBusinessTypeChange = (
  checked: any,
  businessValue: any,
  currentValue: any,
  handleChange: any
) => {
  const newValue = currentValue || [];
  if (checked) {
    handleChange([...newValue, businessValue]);
  } else {
    handleChange(newValue.filter((item) => item !== businessValue));
  }
};

// Function to scroll to first error
const scrollToFirstError = () => {
  nextTick(() => {
    const firstErrorElement =
      document.querySelector('[data-error="true"]') ||
      document.querySelector(".text-red-500:not(.text-red-500 span)") ||
      document.querySelector('[role="alert"]');

    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      // Fallback: scroll to top of form
      document.getElementById("service-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
};

// Proper form submission handler
const onSubmit = handleSubmit(
  async (formData) => {
    try {
      isLoading.value = true;

      // Add file uploads to form data if needed
      const submitData = {
        ...formData,
        logo: logo.value,
        banner: banner.value,
        client_logo_files: clientLogoFiles.value,
      };

      console.log("Form submitted with data:", submitData);

      // Your API call here
      // await submitService(submitData);

      toast.success("Service listing created successfully!");
      // resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      isLoading.value = false;
    }
  },
  (errors) => {
    // This callback runs when validation fails
    console.log("Validation errors:", errors);
    toast.error("Please fix the errors in the form");
    scrollToFirstError();
  }
);

// Alternative submit handler for the button click
const handleButtonSubmit = () => {
  onSubmit();
};

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

          <!-- Tagline -->
          <FormField
            v-slot="{ componentField }"
            name="service_tagline"
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
                  placeholder="Describe your service in one line..."
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
          <FormField name="logo_url" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel
                >Company Logo (1:1)<span class="text-red-500"
                  >*</span
                ></FormLabel
              >
              <FormControl>
                <FileUploader
                  :model-value="value"
                  @update:model-value="handleChange"
                  placeholder="Upload your logo (square format)"
                />
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
                <FileUploader
                  v-model="banner"
                  placeholder="Upload your banner (landscape format)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <!-- Provider Name -->
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

          <!-- Provider Email -->
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
                  type="email"
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
          <!-- Description -->
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
                  placeholder="Provide a detailed description of your service..."
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="business_types">
            <FormItem>
              <FormLabel class="text-base"
                >Who is this for?<span class="text-red-500">*</span>
              </FormLabel>
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
              >
                <FormItem
                  v-for="businessType in businessTypeOptions"
                  :key="businessType.value"
                  class="flex flex-row items-start gap-x-3 space-y-0 p-2"
                >
                  <FormControl>
                    <Checkbox
                      class="h-5 w-5"
                      :checked="value?.includes(businessType.value)"
                      @update:checked="
                        (checked) =>
                          handleBusinessTypeChange(
                            checked,
                            businessType.value,
                            value,
                            handleChange
                          )
                      "
                    />
                  </FormControl>
                  <FormLabel class="flex items-center gap-2">
                    {{ businessType.label }}
                  </FormLabel>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="type_of_service">
            <FormItem>
              <FormLabel
                >Type of Service<span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select type of services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="retainer-montly"
                      >Retainer / Monthly</SelectItem
                    >
                    <SelectItem value="project-based">Project-based</SelectItem>
                    <SelectItem value="custom-varies"
                      >Custom / Varies</SelectItem
                    >
                  </SelectContent>
                </Select>
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
      title="Section 3: Display Details"
      :isFooter="false"
    >
      <template #default>
        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <FormField v-slot="{ value, handleChange }" name="highlights">
            <FormItem>
              <FormLabel
                >Key Features / Highlights (3-6 points)
                <span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <DynamicInputList
                  :model-value="value"
                  @update:model-value="handleChange"
                  :max-items="6"
                  placeholder="Enter a key feature"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="included">
            <FormItem>
              <FormLabel>
                What's Included (3-6 points)
                <span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <DynamicInputList
                  :model-value="value"
                  @update:model-value="handleChange"
                  :max-items="6"
                  placeholder="Enter a key feature"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <FormField v-slot="{ componentField }" name="pricing">
            <FormItem>
              <FormLabel>Pricing</FormLabel>
              <FormControl>
                <div class="flex gap-2">
                  <!-- Currency Select -->
                  <FormField
                    v-slot="{ componentField: currencyField }"
                    name="currency_code"
                  >
                    <FormItem class="flex-shrink-0">
                      <FormControl>
                        <Select v-bind="currencyField">
                          <SelectTrigger class="w-24">
                            <SelectValue placeholder="USD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MYR">MYR</SelectItem>
                            <SelectItem value="SGD">SGD</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>

                  <!-- Price Input -->
                  <FormField
                    v-slot="{ componentField: priceField }"
                    name="pricing"
                  >
                    <FormItem class="flex-1">
                      <FormControl>
                        <Input
                          v-bind="priceField"
                          placeholder="Enter starting price"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="turnaround_time">
            <FormItem>
              <FormLabel
                >Typical Turnaround Time
                <span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select typical turnaround time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="within-24-hours">
                      Within 24 hours</SelectItem
                    >
                    <SelectItem value="within-48-hours">
                      Within 48 hours</SelectItem
                    >
                    <SelectItem value="3-5-business-days"
                      >3–5 Business Days</SelectItem
                    >
                    <SelectItem value="1-2-weeks">1–2 Weeks</SelectItem>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="custom-varies"
                      >Custom / Varies</SelectItem
                    >
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <FormField
            v-slot="{ value, handleChange }"
            type="checkbox"
            name="free_consulatation"
          >
            <FormItem class="flex flex-row items-start gap-x-3 space-y-0 p-4">
              <FormControl>
                <Checkbox
                  class="h-5 w-5"
                  :model-value="value"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <div class="space-y-1 leading-none">
                <FormLabel>Free Consultation Offered</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <FormField
            v-slot="{ componentField }"
            name="url"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>Portfolio / Case Study URL (optional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="https://your-portfolio.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="client_logos" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel>Client Logos (optional)</FormLabel>
              <FormControl>
                <FileUploader
                  v-model="value"
                  @update:model-value="handleChange"
                  :previewUrl="values.client_logos"
                  multiple
                  placeholder="Upload client logos to showcase your work"
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
      title="Section 4: Region Serviced"
      :isFooter="false"
    >
      <template #default>
        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <FormField v-slot="{ value, handleChange }" name="servers">
            <FormItem>
              <FormLabel class="text-base"
                >Which Countries Do You Serve?
                <span class="text-red-500">*</span></FormLabel
              >
              <div class="flex flex-row gap-4">
                <FormItem
                  v-for="server in serverOptions"
                  :key="server.value"
                  class="flex flex-row gap-x-3 space-y-0 p-2"
                >
                  <FormControl>
                    <Checkbox
                      class="h-5 w-5"
                      :checked="value?.includes(server.value)"
                      @update:checked="
                        (checked) =>
                          handleServerChange(
                            checked,
                            server.value,
                            value,
                            handleChange
                          )
                      "
                    />
                  </FormControl>
                  <div class="space-y-1 leading-none flex-1">
                    <FormLabel>{{ server.label }}</FormLabel>
                  </div>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </template>
    </BaseCard>

    <div class="flex flex-center gap-4 mt-6 justify-center">
      <Button type="submit" class="w-50 h-12" :disabled="isLoading">
        <Icon
          name="Loader2"
          v-if="isLoading"
          :size="18"
          class="mr-2 h-4 w-4 animate-spin"
        />
        Create Listing
      </Button>
    </div>
  </form>
</template>

<style scoped></style>
