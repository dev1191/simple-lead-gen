<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "@steveyuowo/vue-hot-toast";
import { useForm } from "vee-validate";
import * as z from "zod";
import {
  FormControl,
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
    logo_url: fileWithAspectRatio(1, 1), // File or URL
    banner_url: fileWithAspectRatio(16, 9), // 16:9 aspect ratio
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
    currency_code: z.string().optional(),
    pricing: z.number().optional(),
    integrations: z.string().optional(),
    affiliate_url: z.string().optional(),
    cta_label: z.string().optional(),
    free_trail: z.boolean().optional(),
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

const bestForOptions = [
  {
    value: "solopreneurs",
    label: "Solopreneurs",
  },
  {
    value: "startups",
    label: "Startups",
  },
  {
    value: "smes",
    label: "SMEs",
  },
  {
    value: "agencies",
    label: "Agencies",
  },
  {
    value: "remote_teams",
    label: "Remote Teams",
  },
  {
    value: "product-base-brands",
    label: "Product-Based Brands",
  },
];

const pricingOptions = [
  { value: "free_forever", label: "Free Forever" },
  { value: "free_trial", label: "Free Trial Available" },
  { value: "freemium", label: "Freemium" },
  { value: "monthly_subscription", label: "Monthly Subscription" },
  { value: "pay_as_you_go", label: "Pay-as-you-go" },
  { value: "custom_varies", label: "Custom / Varies" },
];

const platformOptions = [
  { value: "web", label: "Web" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "chrome_extension", label: "Chrome Extension" },
  { value: "api", label: "API" },
];

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue, errors } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      sub_categories: [],
      best_for: [],
      core_features: [],
      pros: [],
      cons: [],
      integrations: "",
      operate: [],
      platforms: [],
      currency_code: "USD",
      cta_label: "Try Now",
      free_trail: false,
    },
  });

// Computed property to get subcategories for selected category
const availableSubcategories = computed(() => {
  const category = toolCategories.find((cat) => cat.value === values.category);
  return category ? category.subcategories : [];
});

const handelOperateChange = (
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

watch(
  () => values.category,
  () => setFieldValue("sub_categories",  values.sub_categories)
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

const handleBestForChange = (
  checked: any,
  bestForValue: any,
  currentValue: any,
  handleChange: any
) => {
  const newValue = currentValue || [];
  if (checked) {
    handleChange([...newValue, bestForValue]);
  } else {
    handleChange(newValue.filter((item) => item !== bestForValue));
  }
};

const handlePlatformChange = (
  checked: any,
  platformValue: any,
  currentValue: any,
  handleChange: any
) => {
  const newValue = currentValue || [];
  if (checked) {
    handleChange([...newValue, platformValue]);
  } else {
    handleChange(newValue.filter((item) => item !== platformValue));
  }
};


const  { uploadFile } = useUpload();
const { createTool,updateTool } = useTools()
const router = useRouter();

// Proper form submission handler
const onSubmit = handleSubmit(
  async (formData) => {
    try {
      isLoading.value = true;

      let logoUrl = "";
      let bannerUrl = "";

        // Upload image if file selected
      if (formData.logo_url && formData.logo_url instanceof File) {
        logoUrl = await uploadFile(formData.logo_url, "uploads", "tools");
        setFieldValue("logo_url", logoUrl);
      } else {
        logoUrl = formData.logo_url;
      }

      // Upload image if file selected
      if (formData.banner_url && formData.banner_url instanceof File) {
        bannerUrl = await uploadFile(
          formData.banner_url,
          "uploads",
          "tools"
        );
        setFieldValue("banner_url", bannerUrl);
      } else {
        bannerUrl = formData.banner_url;
      }


      // Add file uploads to form data if needed
      const submitData = {
        ...formData,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        operate:
          Array.isArray(formData.operate) && formData.operate.includes("global")
            ? ["malaysia", "singapore"]
            : formData.operate,
      };
      
      // call composable useTool
      if (props.isEditable) {
        await updateTool(props.tool.id, submitData);
      } else {
        await createTool(submitData);
      }

      toast.success("Tool created successfully!");
     resetForm();
     router.push("/admin/tools");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create tool. Please try again.");
    } finally {
      isLoading.value = false;
    }
  },
  (errors) => {
    // This callback runs when validation fails
    console.log("Validation errors:", errors);
    toast.error("Please fix the errors in the form");
  }
);
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
                              : (value || []).filter(
                                  (v) => v !== subcategory.value
                                )
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

        <div class="grid grid-cols-2 gap-6 w-full mb-6">
          <FormField name="logo_url" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel
                >Logo Upload (1:1)<span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <FileUploader
                  :model-value="value"
                  @update:model-value="handleChange"
                  placeholder="Upload 1:1 ratio logo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="banner_url" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel>Screenshot / Banner (Optional)</FormLabel>
              <FormControl>
                <FileUploader
                  :model-value="value"
                  @update:model-value="handleChange"
                  placeholder="Upload promo banner"
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
      title="Section 2: Tool Details"
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
                Product Description <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  type="text"
                  rows="6"
                  placeholder="Provide a detailed description of your tool..."
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="problem_solved"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Main Problem Solved <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  type="text"
                  rows="4"
                  placeholder="What primary problem does your tool solve?"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="best_for" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel class="text-base"
                >Best for<span class="text-red-500">*</span>
              </FormLabel>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                <FormItem
                  v-for="businessType in bestForOptions"
                  :key="businessType.value"
                  class="flex flex-row items-start gap-x-3 space-y-0 p-2"
                >
                  <FormControl>
                    <Checkbox
                      class="h-5 w-5"
                      :model-value="value?.includes(businessType.value)"
                      @update:model-value="
                        (val) =>
                          handleBestForChange(
                            val,
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
        </div>
      </template>
    </BaseCard>

    <BaseCard
      class="mt-4"
      className="5xl"
      title="Section 3: Display Information"
      :isFooter="false"
    >
      <template #default>
        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <FormField v-slot="{ value, handleChange }" name="core_features">
            <FormItem>
              <FormLabel
                >Core Features (3-5)
                <span class="text-red-500">*</span></FormLabel
              >
              <FormControl>
                <DynamicInputList
                  :model-value="value"
                  @update:model-value="handleChange"
                  :max-items="5"
                  placeholder="Enter a key feature"
                  label="Core"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <FormField v-slot="{ value, handleChange }" name="pros">
            <FormItem>
              <FormLabel>Pros</FormLabel>
              <FormControl>
                <DynamicInputList
                  :model-value="value"
                  @update:model-value="handleChange"
                  :max-items="5"
                  placeholder="Enter a key feature"
                  label="Pros"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="cons">
            <FormItem>
              <FormLabel>Cons</FormLabel>
              <FormControl>
                <DynamicInputList
                  :model-value="value"
                  @update:model-value="handleChange"
                  :max-items="5"
                  placeholder="Enter a key feature"
                  label="Cons"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <FormField v-slot="{ componentField }" name="pricing_model">
            <FormItem>
              <FormLabel>
                Pricing Model <span class="text-red-500">*</span>
              </FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a pricing model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="pricing in pricingOptions"
                      :key="pricing.value"
                      :value="pricing.value"
                    >
                      {{ pricing.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="pricing">
            <FormItem>
              <FormLabel>Starting Price (Optional)</FormLabel>
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
                          type="number"
                          :min="0"
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
        </div>

        <div class="grid grid-cols-2 gap-8 w-full mb-6">
          <FormField
            v-slot="{ componentField }"
            name="affiliate_url"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> Affiliate / Redirect Link </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter affiliate / redirect link"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="cta_label"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> CTA Label for Button </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter CTA label for button"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ value, handleChange }"
            type="checkbox"
            name="free_trail"
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
                <FormLabel>Free Trial Available? </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="integrations">
            <FormItem>
              <FormLabel>Integrations (optional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter comma-separated input"
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
      title="Section 4: Region Operated/ Supported"
      :isFooter="false"
    >
      <template #default>
        <div class="grid grid-cols-1 gap-8 w-full mb-6">
          <FormField v-slot="{ value, handleChange }" name="operate">
            <FormItem>
              <FormLabel class="text-base"
                >Where Does This Tool Operate or Offer Support?
                <span class="text-red-500">*</span></FormLabel
              >
              <div
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 mt-4"
              >
                <FormItem
                  v-for="server in serverOptions"
                  :key="server.value"
                  class="flex flex-row gap-x-2 space-y-0 p-1"
                >
                  <FormControl>
                    <Checkbox
                      class="h-5 w-5"
                      :model-value="value?.includes(server.value)"
                      @update:model-value="
                        (checked) =>
                          handelOperateChange(
                            checked,
                            server.value,
                            value,
                            handleChange
                          )
                      "
                    />
                  </FormControl>
                  <div class="flex flex-row gap-8 leading-none">
                    <FormLabel>{{ server.label }}</FormLabel>
                  </div>
                </FormItem>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="platforms" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel class="text-base">Platforms Supported </FormLabel>
              <div
                class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4"
              >
                <FormItem
                  v-for="platform in platformOptions"
                  :key="platform.value"
                  class="flex flex-row items-start gap-x-3 space-y-0 p-2"
                >
                  <FormControl>
                    <Checkbox
                      class="h-5 w-5"
                      :model-value="value?.includes(platform.value)"
                      @update:model-value="
                        (val) =>
                          handlePlatformChange(
                            val,
                            platform.value,
                            value,
                            handleChange
                          )
                      "
                    />
                  </FormControl>
                  <FormLabel class="flex items-center gap-2">
                    {{ platform.label }}
                  </FormLabel>
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
        {{ isEditable ? "Update" : "Create" }} Tool for Review
      </Button>
    </div>
  </form>
</template>

<style scoped></style>
