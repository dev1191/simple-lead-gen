<script setup lang="ts">
import type { Lead } from "~/shared/types/leads";

const props = defineProps<{ lead: Lead; modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const isOpen = ref<boolean>(props.modelValue);
const lead = ref(props.lead);
const { sendEmail } = useLeads();

const handleCancel = () => {
  emit("close");
  isOpen.value = false;
};

const serviceDetails = ref(lead.value.services.service_details || []);
const sortedServiceDetails = computed(() => {
  return [...serviceDetails.value].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

const latestServiceDetail = ref(sortedServiceDetails.value[0].id || null);
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;

  const serviceDetail = serviceDetails.value.find(
    (detail : { id: string }) => detail.id === latestServiceDetail.value
  );

  const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    Hello ${lead.value.vendors.name},<br><br>

    You have received a new lead for ${
      lead.value.type === "Service" ? lead.value.services.service_name : ""
    }.<br><br>
    

    <strong>Company:</strong> ${serviceDetail.company_name}<br>
    <strong>Contact:</strong> ${serviceDetail.name}<br>
    <strong>Email:</strong> ${serviceDetail.email}<br><br>

    Best regards,<br>
    Lead Gen Team
</div>`;

  await sendEmail({
    email: "devrajthapa1191@gmail.com", //"venturenexthq@gmail.com",
    subject: "New Leads",
    message,
  });

  isLoading.value = false;
};
</script>

<template>
  <BaseDialog
    :open="isOpen"
    mode="view"
    title="Forward this enquiry?"
    description="The enquiry details will be sent to the provider's registered email address. Please confirm before proceeding."
    @update:open="handleCancel"
    size="lg"
    :is-footer="true"
  >
    <template #default>
      <Select v-model="latestServiceDetail">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select Requester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="detail in sortedServiceDetails"
            :key="detail.id"
            :value="detail.id"
          >
            {{ detail.company_name }} - {{ detail.name }}({{ detail.email }})
          </SelectItem>
        </SelectContent>
      </Select>
    </template>

    <template #footer>
      <Button type="button" @click="onSubmit" :disabled="isLoading">
        <Icon
          name="Loader2"
          v-if="isLoading"
          :size="18"
          class="mr-2 h-4 w-4 animate-spin"
        />
        Forward
      </Button>
    </template>
  </BaseDialog>
</template>

<style scoped></style>
