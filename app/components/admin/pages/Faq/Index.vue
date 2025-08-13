<script setup lang="ts">
import { columns } from "~/components/admin/pages/Faq/Columns";
import DataTable from "~/components/admin/pages/Faq/DataTable.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import BrandTab from "./BrandTab.vue";
import ProviderTab from "./ProviderTab.vue";

const faqs = useFaqs();

const isSheetModal = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const closeSheetModal = () => {
  isSheetModal.value = false;
};

const formSchema = toTypedSchema(
  z.object({
    question: z.string().min(2).max(200),
    answer: z.string().min(2),
    category: z.string(),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      question: "",
      answer: "",
      category: "Brand",
    },
  });

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    const response = await faqs.createFaq(values);

    // Show success message
    toast.success("Faq created successfully!");

    // Reset form and close modal
    resetForm();
    closeSheetModal();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create post. Please try again.");
  } finally {
    isLoading.value = false;
  }
});

const handleFormSubmit = () => {
  onSubmit();
};
</script>

<template>
  <AdminLayoutPage title="Manage FAQ" description="" sticky>
    <template #actions>
      <Button class="space-x-1" @click="isSheetModal = true">
        <Icon name="Plus" :size="20" />
        <span>New Faq</span>
      </Button>
    </template>

    <div class="overflow-x-auto">
      <Tabs default-value="Brand" >
        <TabsList class="grid grid-cols-2 w-[300px]">
          <TabsTrigger value="Brand"> Brand Faqs </TabsTrigger>
          <TabsTrigger value="Provider"> Provider Faqs </TabsTrigger>
        </TabsList>
        <TabsContent value="Brand">
          <BrandTab />
        </TabsContent>
        <TabsContent value="Provider">
          <ProviderTab />
        </TabsContent>
      </Tabs>
    </div>
    <BaseDialog
      :open="isSheetModal"
      mode="create"
      title="Create New Faq"
      description=""
      @update:open="closeSheetModal"
      size="xl"
    >
      <template #default>
        <form @submit.prevent="onSubmit" id="faq-form">
          <!-- Left Column: Title, Category, Content -->
          <div class="flex flex-col space-y-6">
            <FormField v-slot="{ componentField }" name="category">
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand">Brand Faq</SelectItem>
                      <SelectItem value="Partner">Partner Faq</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Title -->
            <FormField
              v-slot="{ componentField }"
              name="question"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>
                  Question <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter question"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="answer"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>
                  Answer <span class="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    type="text"
                    placeholder="Enter answer"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </form>
      </template>

      <template #footer>
        <Button type="button" @click="handleFormSubmit" :disabled="isLoading">
          <Icon
            name="Loader2"
            v-if="isLoading"
            :size="18"
            class="mr-2 h-4 w-4 animate-spin"
          />
          Save changes
        </Button>
      </template>
    </BaseDialog>
  </AdminLayoutPage>
</template>

<style scoped></style>
