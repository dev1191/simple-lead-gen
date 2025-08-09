<!-- components/BaseCard.vue -->
<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const { title, description, className,height } = defineProps<{
  title?: string;
  description?: string;
  className?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  height?: string
}>();

const maxWidthClass = computed(() => {
  return ` max-w-${className || "xl"} ${height || ''}`;
});
</script>

<template>
  <Card :class="maxWidthClass">
    <CardHeader v-if="title || description">
      <CardTitle >{{ title }}</CardTitle>
      <CardDescription >{{ description }}</CardDescription>
    </CardHeader>

    <CardContent>
      <slot />
    </CardContent>

    <CardFooter class="flex justify-end gap-2">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>
