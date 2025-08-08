<script setup lang="ts">
import { toast } from "@steveyuowo/vue-hot-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "../PasswordInput.vue";
import { Loader2 } from "lucide-vue-next";

const authStore = useAuthStore();

// 1️⃣ Define the validation schema
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 2️⃣ Loading state for the button
const isLoading = ref(false);

// 3️⃣ Initialize the form
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Bind inputs to form
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

// 4️⃣ Submit handler
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  toast.loading('Loading...')
  await authStore.handleAuth(values.email, values.password);

  isLoading.value = false;
});
</script>

<template>
  <div>
    <form @submit="onSubmit">
      <div class="grid gap-6">
        <!-- Email Field -->
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            v-model="email"
            v-bind="emailAttrs"
          />
          <p v-if="errors.email" class="text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password Field -->
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <!-- <NuxtLink
              to="/auth/forgot-password"
              class="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </NuxtLink> -->
          </div>

          <PasswordInput
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
          />
          <p v-if="errors.password" class="text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>

        <!-- Submit Button -->
        <Button type="submit" class="w-full" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Login
        </Button>
      </div>
    </form>
  </div>
</template>
