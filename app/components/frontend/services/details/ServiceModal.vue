<script setup lang="ts">
import type { Service } from "~/shared/types/service";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "@steveyuowo/vue-hot-toast";
import { useForm } from "vee-validate";
import * as z from "zod";

const props = defineProps<{
  open: boolean;
  service: Service;
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
  return `Get More Details - ${props.service.service_name}`;
});

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(200),
    email: z.email("Invalid email address"),
    phone_number: z.string().max(20).optional(),
    company_name: z.string().optional(),
    timeline: z.string().optional(),
    budgets: z.string().optional(),
    content: z.string().optional(),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      company_name: "",
      email: "",
      phone_number: "",
      timeline: "",
      budgets: "",
      content: "",
    },
  });

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    values.service_id = props.service.id;
    const result = await $fetch("/api/services/details", {
      method: "POST",
      body: {
        data: values, // sending form values
      },
    });
    toast.success(result.message);
    isLoading.value = false;
    close()
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
    size="lg"
    :isFooter="false"
  >
    <template #default>
      <form @submit.prevent="onSubmit" id="service-details-form">
        <!-- first row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            v-slot="{ componentField }"
            name="name"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> Name <span class="text-red-500">*</span> </FormLabel>
              <FormControl>
                <Input
                  id="content"
                  v-bind="componentField"
                  placeholder="Write your content here..."
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            v-slot="{ componentField }"
            name="company_name"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> Company Name </FormLabel>
              <FormControl>
                <Input
                  id="company_name"
                  v-bind="componentField"
                  placeholder="Enter company name..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField v-slot="{ componentField }" name="timeline">
            <FormItem>
              <FormLabel>How Soon Do You Need This?</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select timeline" />
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

          <FormField v-slot="{ componentField }" name="budgets">
            <FormItem>
              <FormLabel>Budget Range</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000-25000"
                      >$20,000 - $35,000</SelectItem
                    >
                    <SelectItem value="over-25000">Over $25,000+</SelectItem>
                    <SelectItem value="lets-discuss">Let's discuss</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <FormField
            v-slot="{ componentField }"
            name="content"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem>
              <FormLabel> Additional Details</FormLabel>
              <FormControl>
                <Textarea
                  id="content"
                  rows="5"
                  v-bind="componentField"
                  placeholder="Write your content here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex gap-3 pt-4">
          <Button
            type="button"
            @click="close"
            class="flex-1 h-10"
            variant="outline"
            >Cancel</Button
          >
          <Button type="submit" class="flex-1 h-10" :disabled="isLoading">
            <Icon
              name="Loader2"
              v-if="isLoading"
              :size="18"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Send Query
          </Button>
        </div>
      </form>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
