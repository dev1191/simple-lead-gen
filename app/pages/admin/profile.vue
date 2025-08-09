<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useHead({
  title: 'Profile',
})
</script>

<template>
  <div>
    <div class="flex flex-col space-y-6">
      <HeadingSmall
        title="Profile information"
        description="Update your name and email address"
      />

      <div class="flex justify-center">
        <Card class="w-[550px]">
          <CardContent>
            <AuthProfile />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
