<script lang="ts" setup>
import { ref } from "vue";
import Icon from "~/components/Icon.vue";
import { type Row } from "@tanstack/vue-table";


import DeleteModal from "./ToolDelete.vue";
import type { Tool } from "~/shared/types/tools";

const props = defineProps<{ row: Row<Tool> }>();

// Track which modal type is open (null = none)
const currentComponent = ref<keyof typeof componentsMap | null>(null);

// Control dialog open state
const isDialogOpen = ref(false);
const { updateStatus } = useTools();

// Map action types to components
const componentsMap = {
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
    <NuxtLink :to="`/admin/tools/${props.row.original.id}`">
      <Button variant="ghost" size="icon">
        <Icon name="Edit" :size="20" />
      </Button>
    </NuxtLink>

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
    :tool="props.row.original"
    :modelValue="isDialogOpen"
    @update:modelValue="isDialogOpen = $event"
    @close="closeModal"
  />
</template>
