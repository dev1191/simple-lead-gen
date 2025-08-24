<script setup lang="ts">
defineProps<{
  logo_url?: string;
  service_name: string;
}>();
</script>

<template>
  <div
    class="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-10"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-start">
        <Button variant="ghost"
          ><Icon name="ArrowLeft" /><NuxtLink to="/services"
            >Back to Services</NuxtLink
          ></Button
        >

        <Separator orientation="vertical" />

        <div class="flex items-center gap-3">
          <img
            class="w-8 h-8 rounded object-cover"
            :src="logo_url"
            :alt="service_name"
          />
          <div class="font-medium text-foreground">{{ service_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
