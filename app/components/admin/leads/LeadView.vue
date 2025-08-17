
<script setup lang="ts">
import type { Lead } from '~/shared/types/leads';

const props = defineProps<{ lead: Lead; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);



const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};


const isLoading = ref(false)


const onSubmit = () =>{


}
</script>


<template>
  <BaseDialog
    :open="isOpen"
    mode="view"
    :title="`Lead Details - L00${lead.id}`"
    @update:open="handleCancel"
    size="lg"
  >

     <template #default>
        {{ lead }}
    </template>

 </BaseDialog>
</template>


<style scoped>

</style>