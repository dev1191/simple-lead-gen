<script lang="ts" setup>
import type { LayoutHeaderProps } from "./types";

defineProps<LayoutHeaderProps>();
</script>

<template>
  <main>
    <AdminLayoutHeader
      :title="title"
      :description="description"
      :sticky="sticky"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </AdminLayoutHeader>

    <div class="py-4">
      <slot name="cardHeader" />
    </div>
    <main class="py-2 w-full space-y-12">
      <slot />
    </main>
  </main>
</template>
