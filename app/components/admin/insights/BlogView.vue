<script setup lang="ts">
import type { BlogPost } from "~/shared/types/blogPost";
import { format } from "date-fns";
const props = defineProps<{ post: BlogPost; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const post = ref(props.post);

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};

const formatDate = (date: string | null) => {
  return date ? format(new Date(date), "PPpp") : "—";
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="view"
    title="View Article"
    @update:open="handleCancel"
    size="four"
  >
    <template #default>
      <!-- Header -->
      <div class="flex items-center gap-4 mb-4">
        <Avatar class="h-10 w-10">
          <AvatarImage :src="post.profiles?.avatar_url" />
          <AvatarFallback>
            {{ post.profiles?.display_name?.charAt(0) || "A" }}
          </AvatarFallback>
        </Avatar>
        <div>
          <p class="font-medium">
            {{ post.profiles?.display_name || "Unknown" }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ formatDate(post.created_at) }}
          </p>
        </div>
      </div>

      <!-- Status & Category -->
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge
          variant="secondary"
          :class="
            post.status === 'Published'
              ? 'bg-green-200 text-green-700 font-semibold'
              : 'bg-yellow-200 text-yellow-700 font-semibold'
          "
          >{{ post.status }}</Badge
        >
        <Badge variant="secondary">{{ post.category }}</Badge>
        <Badge variant="outline" v-if="post.featured">Featured</Badge>
      </div>

      <Separator class="my-4" />

      <!-- Cover Image -->
      <div v-if="post.image_url" class="mb-4">
        <img
          :src="post.image_url"
          alt="Cover Image"
          class="rounded-lg border object-cover w-full max-h-60"
        />
      </div>

      <!-- Content -->
      <div class="prose prose-sm max-w-none mb-4" v-html="post.content"></div>

      <Separator class="my-4" />

      <!-- SEO Details -->
      <div class="mb-4">
        <p class="text-sm font-semibold">SEO Title:</p>
        <p class="text-sm text-muted-foreground">{{ post.seo_title }}</p>
      </div>
      <div class="mb-4">
        <p class="text-sm font-semibold">SEO Description:</p>
        <p class="text-sm text-muted-foreground">{{ post.seo_description }}</p>
      </div>

      <!-- Tags -->
      <div v-if="post.tags?.length" class="mt-4">
        <p class="text-sm font-semibold mb-1">Tags:</p>
        <div class="flex flex-wrap gap-2">
          <Badge v-for="tag in post.tags" :key="tag" variant="secondary">
            {{ tag }}
          </Badge>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
