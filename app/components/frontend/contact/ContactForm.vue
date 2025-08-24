<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "@steveyuowo/vue-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Icon from "~/components/Icon.vue";

// ✅ Validation schema with Zod
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  category: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be at most 500 characters"),
});

const isLoading = ref(false);

const form = useForm({
  validationSchema: toTypedSchema(contactSchema),
  initialValues: {
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    const res = await $fetch("/api/contacts", {
      method: "POST",
      body: { data: values },
    });

    toast.success(res.message);

    // ✅ Reset form including select
    form.resetForm({
      values: {
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      },
    });
  } catch (err: any) {
    toast.error(err?.statusMessage || "Unexpected error");
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-8">
    <h2 class="text-2xl font-bold text-center mb-6">Get in Touch!</h2>

    <!-- ✅ vee-validate works fine with native <form> -->
    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Row 1 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="name" v-slot="{ field }">
          <FormItem>
            <FormLabel>Your Name *</FormLabel>
            <FormControl>
              <Input v-bind="field" placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="email" v-slot="{ field }">
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                placeholder="john@example.com"
                type="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Row 2 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="subject" v-slot="{ field }">
          <FormItem>
            <FormLabel>Subject *</FormLabel>
            <FormControl>
              <Input v-bind="field" placeholder="How can we help?" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="category" v-slot="{ field }">
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Select v-bind="field">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Message -->
      <FormField name="message" v-slot="{ field }">
        <FormItem>
          <FormLabel>Message *</FormLabel>
          <FormControl>
            <Textarea
              v-bind="field"
              placeholder="Please describe your inquiry in detail..."
              rows="4"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Submit Button -->
      <div class="pt-4">
        <Button
          type="submit"
          :disabled="isLoading"
          class="w-full h-10 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
        >
          <span class="mr-2">
            <Icon name="Loader2" class="animate-spin" v-if="isLoading" />
            <Icon name="Send" v-else />
          </span>
          {{ isLoading ? "Sending..." : "Send Message" }}
        </Button>
      </div>
    </form>
  </div>
</template>
