<script lang="ts" setup>
import { ref } from "vue";
import Icon from "~/components/Icon.vue";
import { type Row } from "@tanstack/vue-table";

import ViewModal from "./LeadView.vue";
import type { Lead } from "~/shared/types/leads";
import ForwardModal from "./ForwardModal.vue";

const props = defineProps<{ row: Row<Lead> }>();

// Track which modal type is open (null = none)
const currentComponent = ref<keyof typeof componentsMap | null>(null);

// Control dialog open state
const isDialogOpen = ref(false);


// Map action types to components
const componentsMap = {
  view: ViewModal,
  send: ForwardModal,
};

function handleAction(type: keyof typeof componentsMap) {
  currentComponent.value = type;
  isDialogOpen.value = true;
}


function closeModal() {
  isDialogOpen.value = false;
  // Optionally clear currentComponent after dialog fully closed
  currentComponent.value = null;
}
</script>

<template>
  <div class="flex items-center gap-4">
  
    <Button
      size="icon"
      class="w-24 h-7"
      :disabled="props.row.original.services.service_details.length === 0"
      @click="handleAction('send')"
    >
      <Icon name="Send" :size="20" />
      Forward
    </Button>
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
