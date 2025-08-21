<script setup lang="ts">
import ContactForm from "~/components/frontend/contact/ContactForm.vue";
import ContactHelp from "~/components/frontend/contact/ContactHelp.vue";
import HeroSection from "~/components/frontend/contact/HeroSection.vue";

const { data: pageData } = await useFetch("/api/pages/contact");


useSeo(
  pageData.value ? pageData.value.title : "Contact",
  pageData.value
    ? pageData.value.content
    : "Get in touch with Yotta for inquiries and support.",
  "/images/contact-og.png",
  ["Yotta", "Contact Yotta", "Tech company", "Support"]
);
</script>

<template>
  <div>
    <HeroSection v-if="pageData" :page="pageData" />
    <ContactForm />
    <ContactHelp />
  </div>
</template>

<style scoped></style>
