<script setup lang="ts">
import { ref, computed } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@steveyuowo/vue-hot-toast";

const email = ref("");

const currentYear = computed(() => new Date().getFullYear());

const subscribe = () => {
  if (!email.value) {
    toast({
      message: "Please enter your email address to subscribe.",
      type: "error",
    });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    toast({
      message: "Please enter a valid email address.",
      type: "error",
    });
    return;
  }

  // Here you would typically call your API to subscribe the user
  console.log("Subscribing email:", email.value);

  toast({
    message: "Thank you for subscribing to our newsletter.",
  });

  // Clear the email input
  email.value = "";
};
</script>

<template>
  <footer class="bg-slate-900 text-white">
    <!-- Newsletter Section -->
    <div class="bg-orange-500 py-12 px-6">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          Stay Updated with Yotta
        </h2>
        <p class="text-lg mb-8 opacity-90">
          Get the latest service provider spotlights, business tips, and
          marketplace updates delivered to your inbox.
        </p>

        <div class="max-w-md mx-auto">
          <div class="flex gap-2">
            <Input
              v-model="email"
              type="email"
              placeholder="Enter your email address"
              class="flex-1 bg-white text-gray-900 border-0"
            />
            <Button
              @click="subscribe"
              class="bg-slate-900 hover:bg-slate-800 text-white px-6"
            >
              Subscribe
            </Button>
          </div>
        </div>

        <p class="text-sm mt-4 opacity-80">
          Join 10,000+ entrepreneurs. Unsubscribe anytime.
        </p>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="bg-slate-900 py-12 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <!-- Company Info -->
          <div class="md:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-orange-500 text-2xl font-bold">Yotta</span>
              <span class="text-lg font-medium">Marketplace</span>
            </div>
            <p class="text-gray-400 mb-6 leading-relaxed">
              The ultimate marketplace for business services, tools and
              expertise.
            </p>

            <!-- Social Links -->
            <div class="flex gap-4">
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.74.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 23.998 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Marketplace -->
          <div>
            <h3 class="font-semibold text-lg mb-4">Marketplace</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/browse"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Browse Services</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/categories"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Categories</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/providers"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Top Providers</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/pricing"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Pricing</NuxtLink
                >
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h3 class="font-semibold text-lg mb-4">Company</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/about"
                  class="text-gray-400 hover:text-white transition-colors"
                  >About Us</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/blog"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Blog</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/careers"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Careers</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Contact</NuxtLink
                >
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="font-semibold text-lg mb-4">Support</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/help"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Help Center</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/privacy"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Privacy Policy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/terms"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Terms of Service</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/trust"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Trust & Safety</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-700 pt-4 text-center">
          <p class="text-gray-400">
            © {{ currentYear }} YottaMarketplace. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
