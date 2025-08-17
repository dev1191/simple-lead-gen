<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const {
  title,
  description,
  className = "full",
  height,
  isFooter,
} = defineProps<{
  title?: string;
  description?: string;
  icon?: string;
  className?:
    | "full"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl";
  height?: string;
  isFooter: boolean;
}>();

const maxWidthMap: Record<string, string> = {
  full: "w-full",
  sm: "max-w-sm mx-auto",
  md: "max-w-md mx-auto",
  lg: "max-w-lg mx-auto",
  xl: "max-w-xl mx-auto",
  "2xl": "max-w-2xl mx-auto",
  "3xl": "max-w-3xl mx-auto",
  "4xl": "max-w-4xl mx-auto",
  "5xl": "max-w-5xl mx-auto",
};

const maxWidthClass = computed(() => {
  const baseClass = maxWidthMap[className] || maxWidthMap["full"];
  return `${baseClass} ${height || ""}`;
});
</script>

<template>
  <Card :class="maxWidthClass">
    <CardHeader v-if="title || description">
      <CardTitle class="text-2xl font-semibold text-primary">
        <div class="flex flex-row gap-1">
          <Icon v-if="icon" :name="icon" class="w-5 h-5" />
          <div class="text=xl font-semibold">{{ title }}</div>
        </div>
      </CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>

    <CardContent>
      <slot />
    </CardContent>

    <CardFooter v-if="isFooter" class="flex justify-end gap-2">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>
