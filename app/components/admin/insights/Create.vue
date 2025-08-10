<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
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

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(50),
    category: z.string().min(1, "Please select a category"),
    content: z.string().min(1, "Content is required"),
  })
);

const { isFieldDirty, handleSubmit, values } = useForm({
  validationSchema: formSchema,
});

const categories = ref(BlogCategories);

const onSubmit = handleSubmit((values) => {
  console.log("Form submitted:", values);
  // Handle form submission here
});
</script>

<template>
  <form class="w-2/3 space-y-6" @submit="onSubmit">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Title Field -->
      <FormField
        v-slot="{ componentField }"
        name="title"
        :validate-on-blur="!isFieldDirty"
      >
        <FormItem>
          <FormLabel>Title <span class="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Enter blog title"
              v-bind="componentField"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Category Field -->
      <FormField
        v-slot="{ componentField }"
        name="category"
        :validate-on-blur="!isFieldDirty"
      >
        <FormItem>
          <FormLabel>Category <span class="text-red-500">*</span></FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <template
                    v-for="category in categories"
                    :key="category.value"
                  >
                    <SelectItem :value="category.value">
                      {{ category.label }}
                    </SelectItem>
                  </template>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Content Field -->
    <FormField
      v-slot="{ componentField }"
      name="content"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Content</FormLabel>
        <FormControl>
          <EditorTextEditor
            id="content"
            v-bind="componentField"
            placeholder="Write your blog content here..."
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">Submit</Button>
  </form>
</template>
