<script setup lang="ts"></script>

<template>
  <div
    class="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-10"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <Button variant="ghost"><Icon name="ArrowLeft" /><NuxtLink to="/tools">Back to Tools</NuxtLink></Button>
        <div class="flex items-center gap-3">
          <Button variant="ghost"><Icon name="Share" />Share</Button>
          <Button class="w-30 h-8">Start Free Trial</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
