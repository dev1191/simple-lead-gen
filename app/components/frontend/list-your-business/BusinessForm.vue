<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@steveyuowo/vue-hot-toast";

const formSchema = z.object({
  business_name: z.string().min(2, "Business name is required"),
  name: z.string().min(2, "Contact person is required"),
  email: z.email("Invalid email"),
  phone: z.string().min(6, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  category: z.string().min(1, "Service category is required"),
  website: z.string().optional(),
  description: z.string().optional(),
});

const isLoading = ref(false);
const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    const res = await $fetch("/api/businesses", {
      method: "POST",
      body: { data: values },
    });

    toast.success(res.message);

    // ✅ Reset form including select
    resetForm({
      values: {
        business_name: "",
        name: "",
        email: "",
        phone: "",
        country: "",
        category: "",
        website: "",
        description: "",
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
  <div class="max-w-3xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-center mb-2">Get in Touch!</h2>
    <p class="text-center text-gray-600 mb-6">
      Fill out the form below and we'll get back to you with next steps.
    </p>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField name="business_name" v-slot="{ componentField }" >
          <FormItem>
            <FormLabel>Business Name *</FormLabel>
            <FormControl>
              <Input  v-bind="componentField" placeholder="Your Business Name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="name" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Contact Person *</FormLabel>
            <FormControl>
              <Input  v-bind="componentField" placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="email" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="phone" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="+65 1234 5678" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="country" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Country *</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="category" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Service Category *</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormField name="website" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Website URL</FormLabel>
          <FormControl>
            <Input  v-bind="componentField" placeholder="https://yourwebsite.com" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="description" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Service Description </FormLabel>
          <FormControl>
            <Textarea
            v-bind="componentField"
              placeholder="Please describe your services in detail..."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="flex justify-center">
        <Button type="submit" :disabled="isLoading" class="w-full md:w-auto">
          <Icon name="Loader2" class="animate-spin" v-if="isLoading" /> Send
          Message</Button
        >
      </div>
    </form>
  </div>
</template>
