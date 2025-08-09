<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/PasswordInput.vue"; // your custom password input
import { toast } from "@steveyuowo/vue-hot-toast";
import { useAuthStore } from "@/stores/auth";

// Validation schema
const schema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required and must be at least 8 characters"),
    newPassword: z.string().min(6, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [currentPassword, currentPasswordAttrs] = defineField("currentPassword");
const [newPassword, newPasswordAttrs] = defineField("newPassword");
const [confirmNewPassword, confirmNewPasswordAttrs] = defineField("confirmNewPassword");

const isLoading = ref(false);
const authStore = useAuthStore();

const onSubmit = handleSubmit(async (values) => {
   isLoading.value = true;
  try {
    await authStore.updateUser({ password: values.newPassword });
    toast.success("Password updated successfully!");
  } catch (error) {
    toast.error("Failed to update password");
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <form @submit="onSubmit" class="">
    <div class="grid gap-6">
      <div class="grid gap-2">
        <Label for="currentPassword">Current Password</Label>
        <PasswordInput id="currentPassword" v-model="currentPassword" v-bind="currentPasswordAttrs" />
        <p v-if="errors.currentPassword" class="text-sm text-red-500">{{ errors.currentPassword }}</p>
      </div>

      <div class="grid gap-2">
        <Label for="newPassword">New Password</Label>
        <PasswordInput id="newPassword" v-model="newPassword" v-bind="newPasswordAttrs" />
        <p v-if="errors.newPassword" class="text-sm text-red-500">{{ errors.newPassword }}</p>
      </div>

      <div class="grid gap-2">
        <Label for="confirmNewPassword">Confirm New Password</Label>
        <PasswordInput id="confirmNewPassword" v-model="confirmNewPassword" v-bind="confirmNewPasswordAttrs" />
        <p v-if="errors.confirmNewPassword" class="text-sm text-red-500">{{ errors.confirmNewPassword }}</p>
      </div>

      <Button type="submit" :disabled="isLoading" class="w-full">
        <template v-if="isLoading">Updating...</template>
        <template v-else>Change Password</template>
      </Button>
    </div>
  </form>
</template>
