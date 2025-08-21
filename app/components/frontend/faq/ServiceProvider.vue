<template>
  <div class="bg-white py-16">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Section Header -->
      <div class="animate-fade-in-up">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            For Service Providers
          </h2>
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

const { data: providerData } = await useFetch("/api/faqs/Provider");
// FAQ data based on your screenshot
const faqs = ref<FAQ[]>(
  (providerData.value ?? []).map((item: any) => ({
    question: item.question,
    answer: item.answer,
    isOpen: false,
  }))
);
</script>

<style scoped></style>
