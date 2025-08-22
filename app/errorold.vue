<!-- app/error.vue -->
<script setup lang="ts">
import type { NuxtError } from '#app'
import { clearError } from '#app'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{ error: NuxtError }>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <AlertTriangle class="w-25 h-25 text-red-500 mb-4" />
    <h1 class="text-9xl font-bold mb-2">
      {{ props.error?.statusCode || 500 }}
    </h1>
    <p class="text-muted-foreground mb-6">
      {{ props.error?.statusMessage || 'Something went wrong.' }}
    </p>
    <Button @click="handleError"><Icon name="Home" /> Go Home</Button>
  </div>
</template>
