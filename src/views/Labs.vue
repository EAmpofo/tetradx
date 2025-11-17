<script setup lang="ts">
// @ts-ignore - AppTable.vue is a JavaScript file
import AppDataTable from "../components/AppTable.vue";
import ReferralViewModal from "../components/ReferralViewModal.vue";
import { Select, Avatar, InputText, IconField, InputIcon } from "primevue";
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "../stores/auth.ts";
import { useReferralStore } from "../stores/referrals.ts";
import type { Referral } from "../types";

const headers = [
  { key: "referral_id", label: "Referral ID" },
  { key: "patient_name_or_id", label: "Patient Name/ID" },
  { key: "tests", label: "Test", type: "list" },
  { key: "facility_name", label: "Facility" },
  { key: "referral_doctor", label: "Referral Doctor" },
  { key: "referred_at", label: "Referred At", type: "date" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const randomColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
];

const getStatusOptions = (referral: any) => {
  const baseOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Received", value: "Received" },
  ];

  // Check if all tests in the referral are completed
  const allTestsCompleted = referral?.testsData?.every(
    (test: any) => test.status?.toLowerCase() === "completed"
  );

  // Only show "Completed" option if all tests are completed
  if (allTestsCompleted && referral?.testsData?.length > 0) {
    baseOptions.push({ label: "Completed", value: "Completed" });
  }

  return baseOptions;
};

const sortOptions = [
  { label: "Sort by time created", value: "time" },
  { label: "Sort by doctor", value: "name" },
  // { label: "Sort by test type", value: "test_type" },
];

const sortTypeOptions = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const authStore = useAuthStore();
const referralStore = useReferralStore();

const sortKey = ref("time");
const sortType = ref("desc");
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref("");
const viewModalVisible = ref(false);
const selectedReferral = ref<Referral | null>(null);

const user = computed(() => authStore.user);

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const getRandomColor = () => {
  const index = Math.floor(Math.random() * randomColors.length);
  return randomColors[index];
};

const getReferrals = async () => {
  try {
    await referralStore.getLabTechReferrals(
      currentPage.value,
      pageSize.value,
      sortKey.value,
      sortType.value,
      searchQuery.value
    );
  } catch (e) {
    console.error("error::::", e);
  }
};

const updateStatus = async (referral: any) => {
  try {
    await referralStore.updateReferralStatus(
      referral.referral_id,
      referral.status
    );
    await getReferrals();
  } catch (e) {
    console.error("error::::", e);
  }
};

const viewReferralDetails = (referral: any) => {
  // Find the original referral data with full test objects
  const originalReferral = referralStore.labTechReferrals?.referrals?.find(
    (r) => r.referral_id === referral.referral_id
  );
  selectedReferral.value = originalReferral || referral;
  viewModalVisible.value = true;
};

const handleTestUpdated = async () => {
  await getReferrals();
};

watch([sortKey, currentPage, sortType, searchQuery], () => {
  // Reset to page 1 when search query changes
  if (searchQuery.value !== undefined) {
    currentPage.value = 1;
  }
  getReferrals();
});

const tableItems = computed(() => {
  return (
    referralStore.labTechReferrals?.referrals?.map((referral) => ({
      ...referral,
      tests: referral.tests?.map((test: any) => test.test_name) || [],
      testsData: referral.tests || [], // Keep original test data with status
    })) ?? []
  );
});

onMounted(() => {
  getReferrals();
});
</script>

<template>
  <section>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Welcome back, {{ user?.full_name }}!
        </h2>
        <p class="text-gray-600">
          Here's what's happening with your account today.
        </p>
      </div>
    </div>

    <app-data-table
      title="Lab Tech Referrals"
      :headers="headers"
      :items="tableItems"
      show-pagination
      :total-items="
        referralStore.labTechReferrals?.pagination?.total_referrals ?? 0
      "
      :page-size="pageSize"
      :current-page="currentPage"
      @page-changed="currentPage = $event"
    >
      <template #action-button>
        <div class="flex items-center gap-2">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText 
              v-model="searchQuery" 
              placeholder="Search referrals..." 
              class="w-[250px]"
            />
          </IconField>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <p>Pending</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <p>Received</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <p>Completed</p>
            </div>
          </div>
          <Select
            class="w-[200px]"
            v-model="sortKey"
            :options="sortOptions"
            placeholder="Select sort key"
            optionLabel="label"
            optionValue="value"
          ></Select>
          <Select
            class="w-[150px]"
            v-model="sortType"
            :options="sortTypeOptions"
            placeholder="Select sort type"
            optionLabel="label"
            optionValue="value"
          ></Select>
        </div>
      </template>

      <template #test_type_name="{ item }">
        <p
          :class="[
            'px-3 py-1 rounded-md text-white',
            {
              'bg-yellow-500 ': item.item?.status?.toLowerCase() === 'pending',
              'bg-green-500 ': item.item?.status?.toLowerCase() === 'completed',
              'bg-blue-500 ': item.item?.status?.toLowerCase() === 'received',
            },
          ]"
        >
          {{ item.item?.test_type_name }}
        </p>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center gap-2">
          <i
            v-if="item.item?.status?.toLowerCase() === 'pending'"
            class="pi pi-phone p-3 bg-green-500 rounded-md text-white"
          ></i>
          <i
            v-if="item.item?.status?.toLowerCase() === 'received'"
            class="pi pi-check p-3 bg-green-500 rounded-md text-white"
          ></i>
          <i
            v-if="
              item.item?.status?.toLowerCase() === 'pending' ||
              item.item?.status?.toLowerCase() === 'received'
            "
            class="pi pi-eye p-3 bg-blue-500 rounded-md text-white cursor-pointer"
            @click="viewReferralDetails(item.item)"
          ></i>
          <i
            v-if="item.item?.status?.toLowerCase() === 'completed'"
            class="pi pi-angle-double-down p-3 bg-green-500 rounded-md text-white"
          ></i>
          <i
            v-if="item.item?.status?.toLowerCase() === 'completed'"
            class="pi pi-download p-3 bg-blue-500 rounded-md text-white"
          ></i>
        </div>
      </template>
      <template #patient_name_or_id="{ item }">
        <div class="flex items-center gap-2">
          <Avatar
            :label="getInitials(item?.item?.patient_name_or_id)"
            shape="circle"
            :style="{ backgroundColor: getRandomColor() }"
          ></Avatar>
          <p>{{ item?.item?.patient_name_or_id }}</p>
        </div>
      </template>
      <template #status="{ item }">
        <Select
          v-model="item.item.status"
          :options="getStatusOptions(item.item)"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          :disabled="item.item.status?.toLowerCase() === 'completed'"
          @update:modelValue="updateStatus(item.item)"
        />
      </template>
    </app-data-table>

    <ReferralViewModal
      v-model:visible="viewModalVisible"
      :referral="selectedReferral"
      @test-updated="handleTestUpdated"
    />
  </section>
</template>

<style scoped></style>
