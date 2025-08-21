
<script setup lang="ts">
import HeroSection from '~/components/frontend/faq/HeroSection.vue';
import HowItWork from '~/components/frontend/faq/HowItWork.vue';
import ServiceProvider from '~/components/frontend/faq/ServiceProvider.vue';

useSeo(
  "Faq",
  "Welcome to Yotta, your partner in technology solutions.",
  "/images/home-og.png",
  ["Yotta", "Faq", "Tech company", "Solutions"]
);



</script>

<template>
    <div>
          <HeroSection />
          <HowItWork/>
          <ServiceProvider/>
    </div>
</template>


<style scoped>

</style>