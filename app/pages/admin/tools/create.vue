
<script setup lang="ts">
import ToolForm from '~/components/admin/tools/ToolForm.vue';


definePageMeta({
    layout:'admin',
    middleware:['auth']
})

useHead({
  title: "Creat Tools Management",
});


const tool = ref({

})
</script>

<template>
    <AdminLayoutPage
    title="Create Tools Management"
    description="Create tool management"
    sticky
  >


    <div class="overflow-x-auto">
       <ToolForm :tool="tool" :isEditable=false />
    </div>
  </AdminLayoutPage>
</template>


<style scoped>

</style>