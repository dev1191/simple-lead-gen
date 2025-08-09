<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  GalleryVerticalEnd,
  Settings,
  FileText,
  UserPlus,
  PenTool,
  Globe,
  Wrench,
  Briefcase,
} from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/shared/types/user";

const appConfig = useAppConfig();
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();

const user = computed(() => authStore.user || ({} as User));

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    to: "/admin/dashboard",
    tooltip: "Dashboard",
  },
  { title: "Leads", icon: FileText, to: "/admin/leads", tooltip: "Leads" },
  {
    title: "Vendors",
    icon: UserPlus,
    to: "/admin/vendors",
    tooltip: "Vendors",
  },
  {
    title: "Services",
    icon: Briefcase,
    to: "/admin/services",
    tooltip: "Services",
  },
  { title: "Tools", icon: Wrench, to: "/admin/tools", tooltip: "Tools" },
  {
    title: "Insights(Blogs)",
    icon: PenTool,
    to: "/admin/insights",
    tooltip: "Insights(Blogs)",
  },
  {
    title: "Frontend Pages",
    icon: Globe,
    to: "/admin/pages",
    tooltip: "Frontend Pages",
  },
  {
    title: "Settings",
    icon: Settings,
    to: "/admin/settings",
    tooltip: "Settings",
  },
];

/**
 * ✅ Improved active check:
 * - Matches exact path
 * - Matches subpaths for section highlighting
 */
function isActive(menu: any): boolean {
  const path = route.path;
  if (menu.to) {
    return path === menu.to || path.startsWith(menu.to + "/");
  }
  return (
    menu.items?.some(
      (item: any) => path === item.to || path.startsWith(item.to + "/")
    ) || false
  );
}

const handleLogout = async () => {
  await authStore.logout();
  navigateTo("/auth/login");
};
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Documentation</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <!-- ✅ Dynamic loop with improved active highlight -->
          <SidebarMenuItem v-for="link in sidebarLinks" :key="link.title">
            <SidebarMenuButton
              :tooltip="link.tooltip"
              :is-active="isActive(link)"
              as-child
            >
              <NuxtLink :to="link.to" class="flex items-center">
                <component :is="link.icon" class="size-4 mr-2" />
                <span class="text-sm font-semibold">{{ link.title }}</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage :src="user.user_metadata?.avatar_url || '#'" :alt="user.user_metadata?.display_name || ''" />
                  <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ user.user_metadata?.display_name || '' }}</span>
                  <span class="truncate text-xs">{{ user.email }}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div
                  class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                >

                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage :src="user.user_metadata?.avatar_url || '#'" :alt="user.user_metadata?.display_name || ''" />
                    <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ user.user_metadata?.display_name || '' }}</span>
                    <span class="truncate text-xs">{{ user.email }}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <template
                  v-for="userLinks in appConfig.application.siderbarUserLinks"
                  :key="userLinks.title"
                >
                  <NuxtLink
                    v-if="userLinks.action !== 'logout'"
                    :to="userLinks.to"
                  >
                    <DropdownMenuSeparator v-if="userLinks.separator" />
                    <DropdownMenuItem class="cursor-pointer">
                      <component v-if="userLinks.icon" :is="userLinks.icon" />
                      {{ userLinks.title }}
                    </DropdownMenuItem>
                  </NuxtLink>

                  <DropdownMenuItem
                    v-else
                    class="cursor-pointer"
                    @click="handleLogout"
                  >
                    <component v-if="userLinks.icon" :is="userLinks.icon" />
                    {{ userLinks.title }}
                  </DropdownMenuItem>
                </template>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
