<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key } from "lucide-vue-next";
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});
</script>

<template>
  <div>
    <div class="flex flex-col space-y-6">
      <HeadingSmall
        title="Settings"
        description="Manage your user and account settings"
      />

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription
              >Deploy your new project in one-click.</CardDescription
            >
          </CardHeader>
          <CardContent>
            <ReusableDialog
              persistent
              title="Change Password"
              description="Ensure your account is using a long, random password to stay secure"
            >
              <template #trigger>
                <Button variant="outline"
                  ><Key class="w-4 h-4 mr-2" /> Change Password</Button
                >
              </template>

              <AuthChangePassword />
            </ReusableDialog>
          </CardContent>
        </Card>
      </div>

      
    </div>
  </div>
</template>

<style scoped></style>
