<template>
  <div class="bg-white py-16">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Section Header -->
      <div class="animate-fade-in-up">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">For Service Providers</h2>
          <div class="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <Collapsible
          v-for="(faq, index) in faqs"
          :key="index"
          v-model:open="faq.isOpen"
          class="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md"
        >
          <CollapsibleTrigger
            class="w-full px-5 py-4 text-left bg-white hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset transition-colors [&[data-state=open]>div>svg]:rotate-180"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 pr-4">
                {{ faq.question }}
              </h3>
              <ChevronDownIcon
                class="w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0"
              />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent
            class="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
          >
            <div class="px-6 py-5 bg-white border-t border-gray-100">
              <div
                class="text-gray-600 leading-relaxed"
                v-html="faq.answer"
              ></div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-vue-next";

// Types
interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

// FAQ data based on your screenshot
const faqs = ref<FAQ[]>([
  {
    question: "How does Yotta work?",
    answer: `
      <p class="mb-4">Yotta is a comprehensive business services platform that connects you with verified service providers across various business needs. Here's how it works:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Browse Services:</strong> Explore our curated marketplace of business services including company registration, accounting, legal compliance, and more.</li>
        <li><strong>Get Matched:</strong> Our intelligent matching system connects you with the most suitable service providers based on your specific requirements.</li>
        <li><strong>Compare & Choose:</strong> Review profiles, ratings, and pricing from multiple providers to make an informed decision.</li>
        <li><strong>Secure Booking:</strong> Book services through our secure platform with transparent pricing and clear timelines.</li>
        <li><strong>Project Management:</strong> Track progress, communicate with providers, and manage all your business services from one dashboard.</li>
      </ul>
    `,
    isOpen: false,
  },
  {
    question: "Is Yotta free to use?",
    answer: `
      <p class="mb-4">Yes, Yotta is free for businesses to use! Here's our pricing structure:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Free Registration:</strong> Creating an account and browsing services is completely free.</li>
        <li><strong>No Platform Fees:</strong> We don't charge additional fees on top of service provider rates.</li>
        <li><strong>Transparent Pricing:</strong> You only pay the service providers directly for their services.</li>
        <li><strong>No Hidden Costs:</strong> All prices are clearly displayed upfront with no surprise charges.</li>
      </ul>
      <p class="mt-4">Our business model is based on partnerships with service providers, allowing us to keep the platform free for businesses while maintaining high-quality standards.</p>
    `,
    isOpen: false,
  },
  {
    question: "How do I get started?",
    answer: `
      <p class="mb-4">Getting started with Yotta is simple and takes just a few minutes:</p>
      <ol class="list-decimal pl-6 space-y-2">
        <li><strong>Sign Up:</strong> Create your free account using your email address or social login.</li>
        <li><strong>Complete Your Profile:</strong> Add your business information and requirements to help us match you with the right providers.</li>
        <li><strong>Browse Services:</strong> Explore our categories or use the search function to find specific services you need.</li>
        <li><strong>Post Requirements:</strong> Describe your project requirements and receive customized proposals from verified providers.</li>
        <li><strong>Start Working:</strong> Choose your preferred provider and begin your project with full platform support.</li>
      </ol>
      <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p class="text-orange-800"><strong>Pro Tip:</strong> Complete your business profile to receive better matches and faster responses from service providers.</p>
      </div>
    `,
    isOpen: false,
  },
  {
    question: "Can I trust the service providers on Yotta?",
    answer: `
      <p class="mb-4">Absolutely! We have a rigorous vetting process to ensure you work with only the most reliable and qualified service providers:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Verification Process:</strong> All service providers undergo thorough background checks, credential verification, and professional assessment.</li>
        <li><strong>Licensed Professionals:</strong> We only work with licensed and certified professionals in their respective fields.</li>
        <li><strong>Client Reviews:</strong> Access genuine reviews and ratings from previous clients to make informed decisions.</li>
        <li><strong>Secure Payments:</strong> All payments are processed through our secure escrow system, protecting both parties.</li>
        <li><strong>Quality Guarantee:</strong> We provide dispute resolution and quality assurance to ensure satisfactory service delivery.</li>
        <li><strong>Continuous Monitoring:</strong> Provider performance is continuously monitored to maintain high standards.</li>
      </ul>
      <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-blue-800"><strong>Security:</strong> Your data and transactions are protected with enterprise-level security measures and compliance with industry standards.</p>
      </div>
    `,
    isOpen: false,
  },
]);

// Methods
const openAllFaqs = () => {
  faqs.value.forEach((faq) => {
    faq.isOpen = true;
  });
};

const closeAllFaqs = () => {
  faqs.value.forEach((faq) => {
    faq.isOpen = false;
  });
};

// Lifecycle
onMounted(() => {
  // Optional: Open the first FAQ by default
  // faqs.value[0].isOpen = true
});

// Expose methods for parent component if needed
defineExpose({
  openAllFaqs,
  closeAllFaqs,
  faqs,
});
</script>

<style scoped></style>
