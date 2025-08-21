<script setup lang="ts">
import { Facebook, Twitter, Linkedin, Link } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

interface ShareSectionProps {
  title: string;
  url?: string;
  description?: string;
  twitterHandle?: string;
  showCopyLink?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<ShareSectionProps>(), {
  url: "",
  description: "",
  twitterHandle: "",
  showCopyLink: true,
  className: "",
});

const emit = defineEmits<{
  linkCopied: [];
  shareClicked: [platform: string];
}>();

const getCurrentUrl = () => {
  if (props.url) return props.url;
  if (typeof window !== "undefined") return window.location.href;
  return "";
};

const shareOnFacebook = () => {
  const url = encodeURIComponent(getCurrentUrl());
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    "_blank",
    "width=600,height=400"
  );
  emit("shareClicked", "facebook");
};

const shareOnTwitter = () => {
  const url = encodeURIComponent(getCurrentUrl());
  const title = encodeURIComponent(props.title);
  const via = props.twitterHandle ? `&via=${props.twitterHandle}` : "";
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${title}${via}`,
    "_blank",
    "width=600,height=400"
  );
  emit("shareClicked", "twitter");
};

const shareOnLinkedIn = () => {
  const url = encodeURIComponent(getCurrentUrl());
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    "_blank",
    "width=600,height=400"
  );
  emit("shareClicked", "linkedin");
};

const copyLink = async () => {
  try {
    const url = getCurrentUrl();
    await navigator.clipboard.writeText(url);
    emit("linkCopied");
    console.log("Link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy link:", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = getCurrentUrl();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    emit("linkCopied");
  }
};
</script>

<template>
  <div class="border-t pt-8 mt-12">
    <div class="bg-gray-50 p-6 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
        Share
      </h3>
      <div class="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          @click="shareOnFacebook"
          class="w-12 h-12 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
          title="Share on Facebook"
        >
          <Facebook class="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          @click="shareOnTwitter"
          class="w-12 h-12 rounded-full hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 transition-colors"
          title="Share on Twitter"
        >
          <Twitter class="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          @click="shareOnLinkedIn"
          class="w-12 h-12 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin class="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          @click="copyLink"
          class="w-12 h-12 rounded-full hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 transition-colors"
          title="Copy Link"
        >
          <Link class="w-5 h-5" />
        </Button>
      </div>
    </div>
  </div>
</template>
