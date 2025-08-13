<script setup lang="ts">
import type { Faq } from "~/shared/types";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "@steveyuowo/vue-hot-toast";
import { useForm } from "vee-validate";
import * as z from "zod";


const props = defineProps<{ faq: Faq; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);


const faqs = useFaqs()

const isOpen = ref<boolean>(props.modelValue);
const isLoading = ref<boolean>(false);



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
    initialValues: { ...props.faq},
  });


const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};


const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    const response = await faqs.updateFaq(props.faq.id,values);

    // Show success message
    toast.success("Faq update successfully!");

    // Reset form and close modal
    resetForm();
    handleCancel();
  } catch (error) {
    console.error(error);
    toast.error("Failed to update faq. Please try again.");
  } finally {
    isLoading.value = false;
  }
});

const handleFormSubmit = () => {
  onSubmit();
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="edit"
    title="Edit Faq"
    @update:open="handleCancel"
    size="two"
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
        Update Faq
      </Button>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
