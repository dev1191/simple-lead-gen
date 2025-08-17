<script lang="ts" setup>
import { ref } from "vue";
import Icon from "~/components/Icon.vue";
import { type Row } from "@tanstack/vue-table";

import ViewModal from "./LeadView.vue";
import type { Lead } from "~/shared/types/leads";

const props = defineProps<{ row: Row<Lead> }>();

// Track which modal type is open (null = none)
const currentComponent = ref<keyof typeof componentsMap | null>(null);

// Control dialog open state
const isDialogOpen = ref(false);

const { sendEmail } = useLeads();
// Map action types to components
const componentsMap = {
  view: ViewModal,
};

function handleAction(type: keyof typeof componentsMap) {
  currentComponent.value = type;
  isDialogOpen.value = true;
}

async function handleForward() {
  await sendEmail({
    email: "devrajthapa1191@gmail.com",
    subject: "New Enquiry",
    message: "dev hello dev",
  });
}

function closeModal() {
  isDialogOpen.value = false;
  // Optionally clear currentComponent after dialog fully closed
  currentComponent.value = null;
}
</script>

<template>
  <div class="flex items-center gap-4">
    <AlertDialog>
      <AlertDialogTrigger as-child>
        <Button variant="outline" size="sm"> Forward </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forward this enquiry?</AlertDialogTitle>
          <AlertDialogDescription>
            The enquiry details will be sent to the provider's registered email
            address. Please confirm before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleForward">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Button variant="ghost" size="icon" @click="handleAction('view')">
      <Icon name="Eye" :size="20" class="text-red-800" />
    </Button>
  </div>

  <component
    v-if="currentComponent"
    :is="componentsMap[currentComponent]"
    :lead="props.row.original"
    :modelValue="isDialogOpen"
    @update:modelValue="isDialogOpen = $event"
    @close="closeModal"
  />
</template>
