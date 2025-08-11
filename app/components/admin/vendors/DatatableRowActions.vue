<script lang="ts" setup>
import { ref } from "vue";
import Icon from "~/components/Icon.vue";
import { type Row } from "@tanstack/vue-table";
import type { BlogPost } from "~/shared/types/blogPost";

import ViewModal from "./VendorView.vue";
import EditModal from "./VendorEdit.vue";
// import DeleteModal from "../BlogDelete.vue";

const props = defineProps<{ row: Row<BlogPost> }>();

// Track which modal type is open (null = none)
const currentComponent = ref<keyof typeof componentsMap | null>(null);

// Control dialog open state
const isDialogOpen = ref(false);

// Map action types to components
const componentsMap = {
  view: ViewModal,
  edit: EditModal,
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
    <Button variant="ghost" size="icon" @click="handleAction('edit')">
      <Icon name="Edit" :size="20" />
    </Button>
    <!-- <Button variant="ghost" size="icon" @click="handleAction('delete')">
      <Icon name="Trash2" :size="20" class="text-red-800" />
    </Button> -->
  </div>

  <component
    v-if="currentComponent"
    :is="componentsMap[currentComponent]"
    :vendor="props.row.original"
    :modelValue="isDialogOpen"
    @update:modelValue="isDialogOpen = $event"
    @close="closeModal"
  />
</template>
