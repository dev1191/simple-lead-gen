<script setup lang="ts">
import { BlogCategories } from "~/shared/constants";

const { label } = defineProps<{
  label: string;
}>();

const isSheetModal = ref<boolean>(false);
const closeSheetModal = () => {
  isSheetModal.value = false;
};

const categories = ref({ ...BlogCategories });

const form = ref({
  title: "",
  slug: "",
  content: "",
  category: "",
  tags: [],
  seo_title: "",
  seo_description: "",
  status: "Draft",
});

const submit = () => {};
</script>

<template>
  <Button class="space-x-1" @click="isSheetModal = true">
    <Icon name="Plus" :size="20" />
    <span>New {{ label }}</span>
  </Button>

  <BaseDialog
    :open="isSheetModal"
    mode="create"
    title="Create New Article"
    description=""
    @update:open="closeSheetModal"
    size="five"
  >
    <template #default>
      <form @submit.prevent="submit" class="space-y-6">
        <div class="grid grid-cols-2 gap-4 md:grid-cols-2">
          <div class="grid gap-2">
            <TextInput
              id="name"
              v-model="form.title"
              required
              autocomplete="name"
              placeholder="Enter title"
              label="Title"
            />
          </div>
          <div class="grid gap-2">
            <SelectInput
              id="category"
              v-model="form.category"
              :options="categories"
              placeholder="Choose a category"
              label="Category"
              required
            />
          </div>
          <div class="grid gap-2">
            <ToggleInput
              label="Status"
              id="status"
              type="single"
              v-model="form.status"
              :options="[
                { value: 'Draft', label: 'Draft' },
                { value: 'Published', label: 'Published' },
              ]"
            />
          </div>
        </div>

        <Separator />
        <h2 class="text-xl font-bold space-x-2">SEO Settings</h2>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-1">
          <div class="grid gap-2">
            <TextInput
              id="seo_title"
              v-model="form.seo_title"
              required
              autocomplete="seo_title"
              placeholder="Enter seo title"
              label="Seo Title"
            />
          </div>
          <div class="grid gap-2">
            <TextAreaInput
              id="seo_description"
              v-model="form.seo_description"
              required
              autocomplete="seo_description"
              placeholder="Enter seo description"
              label="Seo Description"
            />
          </div>
        </div>
      </form>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
