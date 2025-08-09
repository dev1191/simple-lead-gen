

<script setup lang="ts">

definePageMeta({
    layout:'admin',
    middleware:['auth']
})

useHead({
  title: 'Dashboard',
})
</script>

<template>
    <div>
     <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2>
    </div>
</template>

<style scoped>

</style>