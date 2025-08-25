<script setup lang="ts">
import type { Service } from "~/shared/types/service";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "@steveyuowo/vue-hot-toast";
import { useForm } from "vee-validate";
import * as z from "zod";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(["update:open"]);

const isOpen = ref(props.open);
const isLoading = ref(false);

watch(
  () => props.open,
  (val) => {
    isOpen.value = val;
  }
);

const close = () => {
  isOpen.value = false;
  emit("update:open", false);
};

const title = computed(() => {
  return `List your service on Yotta`;
});

const formSchema = toTypedSchema(
  z.object({
    business_name: z.string().min(2).max(200),
    email: z.email("Invalid email address"),
    phone_number: z.string().max(20),
    category: z.string(),
    country: z.string(),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      business_name: "",
      email: "",
      phone_number: "",
      category: "",
      country: "",
    },
  });

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    const result = await $fetch("/api/list-services", {
      method: "POST",
      body: {
        data: values, // sending form values
      },
    });
    toast.success(result.message);
    isLoading.value = false;
    close();
  } catch (error) {
    toast.error(error?.data?.statusMessage || "Failed to submit form.");
    isLoading.value = false;
  }
});
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="create"
    :title="title"
    description=""
    @update:open="close"
    size="md"
    :isFooter="false"
  >
    <template #default>
      <form @submit.prevent="onSubmit" id="service-details-form">
        <!-- first row -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormField
            v-slot="{ componentField }"
            name="business_name"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel>
                Business Name <span class="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="content"
                  v-bind="componentField"
                  placeholder="Enter your business name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="email"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> Email <span class="text-red-500">*</span> </FormLabel>
              <FormControl>
                <Input
                  id="email"
                  v-bind="componentField"
                  placeholder="Enter email address..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <FormField
            v-slot="{ componentField }"
            name="phone_number"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> Phone Number </FormLabel>
              <FormControl>
                <Input
                  id="phone_number"
                  v-bind="componentField"
                  placeholder="Enter phone number..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- third row -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>Business Category</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select business category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="within-1-week">Within 1 Week</SelectItem>
                    <SelectItem value="within-1-month"
                      >Within 1 Month</SelectItem
                    >
                    <SelectItem value="within-3-months"
                      >Within 3 Months</SelectItem
                    >
                    <SelectItem value="just-planning-ahead"
                      >Just planning ahead</SelectItem
                    >
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="country">
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="malaysia">Malaysia </SelectItem>

                    <SelectItem value="singapore">Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex gap-3 pt-4">
          <Button
            type="submit"
            class="flex-1 h-10 w-full"
            :disabled="isLoading"
          >
            <Icon
              name="Loader2"
              v-if="isLoading"
              :size="18"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Submit Application
          </Button>
        </div>
        <span class="text-xs font-semibold py-2 text-muted-foreground"
          >We'll review your application and send your detailed from to complete
          your listing.</span
        >
      </form>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
