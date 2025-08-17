<script setup lang="ts">
import type { Lead } from "~/shared/types/leads";
import { toTypedSchema } from "@vee-validate/zod";
import { format } from "date-fns";

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

const props = defineProps<{ lead: Lead; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const lead = ref(props.lead);

const formSchema = toTypedSchema(
  z.object({
    status: z.string().optional(),
    created_at: z.string().optional(),
    message: z.string().optional(),
  })
);

const { isFieldDirty, handleSubmit, values, resetForm, setFieldValue } =
  useForm({
    validationSchema: formSchema,
    initialValues: {
      status: lead.value.status,
      created_at:   format(new Date(lead.value.created_at),"yyyy-MM-dd"),
      message: lead.value.message,
    },
  });

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};

const isLoading = ref(false);

const onSubmit = () => {};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="view"
    :title="`Lead Details - L00${lead.id}`"
    @update:open="handleCancel"
    size="lg"
  >
    <template #default>
      <div class="grid grid-cols-2 gap-2">
        <FormField v-slot="{ componentField }" name="status">
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Responded">Responded</SelectItem>
                  <SelectItem value="No Response">No Response</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="created_at">
          <FormItem>
            <FormLabel>Date Received</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter date recived"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="grid grid-cols-1 gap-2 mt-6">
        <FormField v-slot="{ componentField }" name="message">
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                type="text"
                placeholder="Enter notes"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
