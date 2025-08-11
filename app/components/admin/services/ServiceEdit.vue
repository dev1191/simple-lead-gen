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
import { BlogCategories } from "~/shared/constants";
import type { Vendor } from "~/shared/types/vendor";

const props = defineProps<{ vendor: Vendor; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const { updateVendor, fetchVendors } = useVendors();

const isOpen = ref<boolean>(props.modelValue);
const vendor = ref(props.vendor);
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    email: z.email(),
    status: z.enum(["Active", "Inactive"]),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      status: vendor.value.status,
      name: vendor.value.name,
      email: vendor.value.email,
    },
  });

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};

const onSubmit = async () => {
  isLoading.value = true;
  try {
    const response = await updateVendor(vendor.value.id, values);

    // Show success message
    toast.success("Vendor updated successfully!");

    // Reset form and close modal
    resetForm();
    handleCancel();
    fetchVendors();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create vendor. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="edit"
    title="Edit Vendor"
    description="Update vendor details"
    @update:open="handleCancel"
    size="md"
  >
    <template #default>
      <form
        @submit.prevent="onSubmit"
        class="grid grid-cols-1 gap-6"
        id="blog-form"
      >
        <!-- Name -->
        <FormField
          v-slot="{ componentField }"
          name="name"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel> Name <span class="text-red-500">*</span> </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter name"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Email -->
        <FormField
          v-slot="{ componentField }"
          name="email"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel>Email <span class="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter email"
                v-bind="componentField"
              />
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </template>

    <template #footer>
      <Button type="button" @click="onSubmit" :disabled="isLoading">
        <Icon
          name="Loader2"
          v-if="isLoading"
          :size="18"
          class="mr-2 h-4 w-4 animate-spin"
        />
        Update Vendor
      </Button>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
