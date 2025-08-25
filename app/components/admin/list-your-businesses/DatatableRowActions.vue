<script lang="ts" setup>
import { ref } from "vue";
import Icon from "~/components/Icon.vue";
import { type Row } from "@tanstack/vue-table";
import type { BlogBusiness } from "~/shared/types/blogBusiness";

import ViewModal from "./BusinessView.vue";

const props = defineProps<{ row: Row<BlogBusiness> }>();

// Track which modal type is open (null = none)
const currentComponent = ref<keyof typeof componentsMap | null>(null);

// Control dialog open state
const isDialogOpen = ref(false);

// Map action types to components
const componentsMap = {
  view: ViewModal,
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
  <div class="flex items-center gap-2">
    <Button variant="ghost" size="icon" @click="handleAction('view')">
      <Icon name="Eye" :size="20" />
    </Button>
  </div>

  <component
    v-if="currentComponent"
    :is="componentsMap[currentComponent]"
    :business="props.row.original"
    :modelValue="isDialogOpen"
    @update:modelValue="isDialogOpen = $event"
    @close="closeModal"
  />
</template>
