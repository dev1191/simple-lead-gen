<script lang="ts" setup>
import { ref } from "vue";
import Icon from "~/components/Icon.vue";
import { type Row } from "@tanstack/vue-table";

import ViewModal from "./ServiceView.vue";
import EditModal from "./ServiceEdit.vue";
import DeleteModal from "./ServiceDelete.vue";
import { useServices } from "../../../composables/useServices";
import type { Service } from "~/shared/types/service";

const props = defineProps<{ row: Row<Service> }>();

// Track which modal type is open (null = none)
const currentComponent = ref<keyof typeof componentsMap | null>(null);

// Control dialog open state
const isDialogOpen = ref(false);
const { updateStatus } = useServices();

// Map action types to components
const componentsMap = {
  pause: ViewModal,
  edit: EditModal,
  delete: DeleteModal,
};

function handleAction(type: keyof typeof componentsMap) {
  currentComponent.value = type;
  isDialogOpen.value = true;
}

const handleStatus = async () => {
  await updateStatus(
    props.row.original.id,
    props.row.original.status ? false : true
  );
};

function closeModal() {
  isDialogOpen.value = false;
  // Optionally clear currentComponent after dialog fully closed
  currentComponent.value = null;
}
</script>

<template>
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="icon" @click="handleAction('edit')">
      <Icon name="Edit" :size="20" />
    </Button>
    <Button variant="ghost" size="icon" @click="handleStatus">
      <Icon :name="props.row.original.status ? 'Pause' : 'Play'" :size="20" />
    </Button>
    <Button variant="ghost" size="icon" @click="handleAction('delete')">
      <Icon name="Trash2" :size="20" class="text-red-800" />
    </Button>
  </div>

  <component
    v-if="currentComponent"
    :is="componentsMap[currentComponent]"
    :service="props.row.original"
    :modelValue="isDialogOpen"
    @update:modelValue="isDialogOpen = $event"
    @close="closeModal"
  />
</template>
