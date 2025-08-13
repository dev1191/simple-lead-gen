<script setup lang="ts">
import EditModal from "./FaqEdit.vue";
import type { Faq } from "~/shared/types";
import DeleteModal from "./FaqDelete.vue";

// Track which modal type is open (null = none)
const currentComponent = ref<keyof typeof componentsMap | null>(null);

// Control dialog open state
const isDialogOpen = ref(false);
const faqItem = ref();

// Map action types to components
const componentsMap = {
  edit: EditModal,
  delete: DeleteModal,
};

function handleAction(type: keyof typeof componentsMap, faq: Faq) {
  currentComponent.value = type;
  isDialogOpen.value = true;
  faqItem.value = faq;
}

function closeModal() {
  isDialogOpen.value = false;
  // Optionally clear currentComponent after dialog fully closed
  currentComponent.value = null;
}

const { fetchFaqs, faqs } = useFaqs();

onMounted(() => {
  fetchFaqs("Provider");
});
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-3 rounded-sm mt-2" v-if="faqs.length > 0">
      <Card v-for="faq in faqs" :key="faq.id">
        <CardContent class="h-6" >
          <div class="flex justify-between">
            <div class="text-md font-semibold">{{ faq.question }}</div>

            <div>
              <Button
                variant="ghost"
                size="icon"
                @click="handleAction('edit', faq)"
              >
                <Icon name="Edit" :size="20" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                @click="handleAction('delete', faq)"
              >
                <Icon name="Trash2" :size="20" class="text-red-800" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-else>
      <div class="flex flex-col items-center justify-center h-full py-8">
        <div class="text-sm text-accent-foreground">No FAQs found</div>
      </div>
    </div>

    <component
      v-if="currentComponent"
      :is="componentsMap[currentComponent]"
      :faq="faqItem"
      :modelValue="isDialogOpen"
      @update:modelValue="isDialogOpen = $event"
      @close="closeModal"
    />
  </div>
</template>

<style scoped></style>
