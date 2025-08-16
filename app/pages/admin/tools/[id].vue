
<script setup lang="ts">
import type { Tool } from '~/shared/types/tools';
import ToolForm from '~/components/admin/tools/ToolForm.vue';



definePageMeta({
    layout:'admin',
    middleware:['auth']
})

useHead({
  title: "Edit Tools Management",
});


const route = useRoute();

const { getTool } = useTools();
const tool = ref<Tool>({});

onMounted(async () => {
  tool.value = await getTool(route.params.id);
});
</script>

<template>
      <AdminLayoutPage
    title="Edit Tools Management"
    description="Edit tool management"
    sticky
  >


    <div >
        <ToolForm :tool="tool" :isEditable="true" />
    </div>
  </AdminLayoutPage>
</template>


<style scoped>

</style>