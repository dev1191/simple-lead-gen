<script setup lang="ts">
import type { NavItem } from "~/shared/types";

const sidebarNavItems: NavItem[] = [
  {
    title: "Home Page",
    href: "/admin/pages/home-page",
  },
  {
    title: "About Us",
    href: "/admin/pages/about-us",
  },
  {
    title: "FAQ",
    href: "/admin/pages/faq",
  },
  {
    title: "Insights(Blog)",
    href: "/admin/pages/insights",
  },
  {
    title: "List your Business",
    href: "/admin/pages/list-your-business",
  },
  {
    title: "Contact",
    href: "/admin/pages/contact",
  },
  {
    title: "Terms Of Service",
    href: "/admin/pages/terms-of-service",
  },
  {
    title: "Privacy Policy",
    href: "/admin/pages/privacy-policy",
  },
];

const route = useRoute();

const currentPath = route.path ? route.path : "";
</script>

<template>
  <AdminLayoutPage
    title="Frontend Pages Management"
    description="Manage Frontend Pages Management"
    sticky
  >
    <div class="flex flex-col lg:flex-row lg:space-x-12 min-h-screen">
      <!-- Sidebar -->
      <aside
        class="w-full lg:w-68 max-w-xl border-2 rounded-md flex flex-col lg:sticky lg:top-0 self-start min-h-screen"
      >
        <!-- Title -->
        <div class="flex items-center justify-center py-2">
          <h2 class="text-xl font-semibold text-center">Pages</h2>
        </div>

        <!-- Nav -->
        <nav class="flex flex-col space-y-4 p-4 flex-1">
          <Button
            v-for="item in sidebarNavItems"
            :key="item.href"
            variant="ghost"
            :class="[
              'w-full justify-start',
              { 'bg-muted': currentPath === item.href },
            ]"
            as-child
          >
            <NuxtLink :href="item.href">
              {{ item.title }}
            </NuxtLink>
          </Button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        <section class="w-full space-y-5">
          <slot />
        </section>
      </div>
    </div>
  </AdminLayoutPage>
</template>
