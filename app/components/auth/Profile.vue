<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";
import { ref, computed, watch } from "vue";
import { toast } from "@steveyuowo/vue-hot-toast";

import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Loader2 } from "lucide-vue-next";

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);

// Validation schema with Zod
const schema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
});

const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: email, errorMessage: emailError } = useField<string>("email");

const avatarUrl = ref<string | null>(null);
const isLoading = ref(false);
const uploading = computed(() => authStore.uploading);
const fileInput = ref<HTMLInputElement | null>(null);

// Initialize form fields and avatarUrl when user changes
watch(
  currentUser,
  (user) => {
    if (user) {
      setValues({
        name: user.user_metadata?.display_name || "",
        email: user.email || "",
      });
      avatarUrl.value = user.user_metadata?.avatar_url || null;
    }
  },
  { immediate: true }
);

function triggerFileInput() {
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    authStore.uploadAvatar(target.files[0]).then(() => {
      avatarUrl.value = authStore.user?.user_metadata?.avatar_url || null;
    });
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    await authStore.updateUser({
      email: values.email,
      data: {
        display_name: values.name,
        avatar_url: avatarUrl.value,
      },
    });
    isLoading.value = false;
  } catch (error) {
    toast.error("Failed to update profile.");
    isLoading.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-10">
    <div class="flex flex-col items-center space-y-4">
      <Avatar class="w-22 h-22 cursor-pointer" @click="triggerFileInput">
        <AvatarImage :src="avatarUrl" alt="User Avatar" />
        <AvatarFallback>{{ name ? name.charAt(0) : "U" }}</AvatarFallback>
      </Avatar>
      <input
        type="file"
        accept="image/*"
        class="hidden"
        ref="fileInput"
        @change="onFileChange"
      />
      <Button
        variant="outline"
        size="sm"
        :disabled="uploading"
        @click.prevent="triggerFileInput"
      >
        {{ uploading ? "Uploading..." : "Change Avatar" }}
      </Button>
    </div>

    <div class="grid gap-2">
      <Label for="name">Full Name *</Label>
      <Input id="name" v-model="name" placeholder="Your full name" />
      <p v-if="nameError" class="text-sm text-red-500">{{ nameError }}</p>
    </div>

    <div class="grid gap-2">
      <Label for="email">Email Address *</Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="Your email address"
      />
      <p v-if="emailError" class="text-sm text-red-500">{{ emailError }}</p>
    </div>

    <div class="flex justify-center">
      <Button type="submit" :disabled="isLoading">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Save Changes</Button
      >
    </div>
  </form>
</template>
