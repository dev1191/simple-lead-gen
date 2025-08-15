<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-vue-next";

const route = useRoute();

function setLinks() {
  if (route.fullPath === "/admin/dashboard") {
    return [{ title: "Dashboard", href: "/admin/dashboard" }];
  }

  const segments = route.fullPath.split("/").filter((item) => item !== "");

  const breadcrumbs = segments.map((item, index) => {
    const str = item.replace(/-/g, " ");
    const title = str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return {
      title,
      href: `/${segments.slice(0, index + 1).join("/")}`,
    };
  });

  return [{ title: "Dashboard", href: "/admin/dashboard" }, ...breadcrumbs];
}

const links = ref<
  {
    title: string;
    href: string;
  }[]
>(setLinks());

watch(
  () => route.fullPath,
  (val) => {
    if (val) {
      links.value = setLinks();
    }
  }
);
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center justify-between w-full px-4">
      <div class="w-full flex items-center gap-2">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <LayoutBreadcrumb :links="links" />
      </div>
      <div class="flex items-center gap-2">
        <ThemeToggleNav />
      </div>
    </div>
  </header>
</template>
