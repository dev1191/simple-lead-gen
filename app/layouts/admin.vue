<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

</script>

<template>
  <div>
    <SidebarProvider>
      <LayoutSidebar />
      <SidebarInset>
        <LayoutHeader />
        <Separator />
         <div class="min-w-0 w-full flex-1 overflow-x-auto p-4 lg:p-6">
          <slot />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

<style scoped></style>
