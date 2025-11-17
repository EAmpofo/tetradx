<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useAuthStore} from "../stores/auth.ts";
import {Button, Paginator, InputText, IconField, InputIcon} from "primevue";
import AddReferralModal from "../components/AddReferralModal.vue";
import {useReferralStore} from "../stores/referrals.ts";
import {formatDate} from "../utils/helpers.ts";

const authStore = useAuthStore()
const referralStore = useReferralStore()

const user = computed(() => authStore.user)
const showAddReferralModal = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref("")

const handleAddReferral = () => {
  showAddReferralModal.value = true
}

const handlePageChange = (event: any) => {
  currentPage.value = event.page + 1
}

const getReferrals = async () => {
  try {
    console.log('Search Query:', searchQuery.value); // Debug log
    const query = searchQuery.value.trim() || undefined;
    await referralStore.getPractitionerReferrals(currentPage.value, pageSize.value, query);
  } catch (e) {
    console.error("error::::",e)
  }
}

const handleReferralSubmit = (data: any) => {
  console.log('Referral submitted:', data)
  // TODO: Add API call to submit referral
}

watch([currentPage, pageSize], () => {
  getReferrals()
})

watch(searchQuery, () => {
  currentPage.value = 1;
  getReferrals()
})

onMounted(() => {
  getReferrals()
  
})
</script>

<template>
  <section>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome back, {{ user?.full_name }}!</h2>
        <p class="text-gray-600">Here's what's happening with your account today.</p>
      </div>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText 
          v-model="searchQuery" 
          placeholder="Search referrals..." 
          class="w-[550px]"
        />
      </IconField>
      <div class="flex items-center gap-3">
        <Button label="Add Referral" severity="success" @click="handleAddReferral" />
      </div>
    </div>

    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Total Referrals</h3>
          <i class="pi pi-address-book text-orange-500 text-xl"></i>
        </div>
        <div class="space-y-2">
          <p class="text-2xl font-bold text-gray-800">{{referralStore.practitionerReferrals?.data_summary?.total_referrals ?? 0}}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Completed</h3>
          <i class="pi pi-check-circle text-green-500 text-xl"></i>
        </div>
        <div class="space-y-2">
          <p class="text-2xl font-bold text-gray-800">{{referralStore.practitionerReferrals?.data_summary?.total_completed ?? 0}}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Pending</h3>
          <i class="pi pi-calendar-clock text-yellow-500 text-xl"></i>
        </div>
        <div class="space-y-2">
          <p class="text-2xl font-bold text-gray-800">{{referralStore.practitionerReferrals?.data_summary?.total_pending ?? 0}}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Received</h3>
          <i class="pi pi-receipt text-blue-500 text-xl"></i>
        </div>
        <div class="space-y-2">
          <p class="text-2xl font-bold text-gray-800">{{referralStore.practitionerReferrals?.data_summary?.total_received ?? 0}}</p>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div v-if="!!referralStore.practitionerReferrals?.referrals?.length" class="flex flex-col gap-4 text-gray-700">
        <div
            v-for="referral in referralStore.practitionerReferrals.referrals"
            :key="referral.referral_id"
            class="p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm"
        >
          <div class="flex items-center justify-between">
            <p class="font-semibold">{{referral.referral_id}} - {{referral?.patient_name_or_id ?? "N/A"}}</p>
            <p :class="['px-4 py-1 rounded-lg text-white', {
        'bg-yellow-500 ': referral?.status?.toLowerCase() === 'pending',
        'bg-green-500 ': referral?.status?.toLowerCase() === 'completed',
        'bg-blue-500 ': referral?.status?.toLowerCase() === 'received',
        }]">{{referral.status}}</p>
          </div>

          <div class="flex items-center gap-2 mt-2">
            <p>{{referral.test_type_name}}</p>
            <div class="w-[3px] h-[3px] bg-gray-700 rounded-full"></div>
            <p>{{referral.facility_name}}</p>
            <div class="w-[3px] h-[3px] bg-gray-700 rounded-full"></div>
            <p>{{formatDate(referral.referred_at)}}</p>
          </div>
        </div>
        <Paginator
            v-if="referralStore.practitionerReferrals?.pagination?.total_referrals > 10"
            :rows="referralStore.practitionerReferrals?.pagination?.page_size ?? 10"
            :totalRecords="referralStore.practitionerReferrals?.pagination?.total_referrals ?? 0"
            :rowsPerPageOptions="[10, 20, 30]"
            @page="handlePageChange"
        ></Paginator>
      </div>
      <div v-else>
        <div class="flex items-center justify-center h-96">
          <div class="text-center">
            <i class="pi pi-address-book text-blue-500 text-6xl mb-4"></i>
            <h3 class="text-2xl font-semibold text-gray-800 mb-2">No Referrals Found</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Referral Modal -->
    <AddReferralModal
      :visible="showAddReferralModal"
      @update:visible="showAddReferralModal = $event"
      @submit="handleReferralSubmit"
      @update-done="getReferrals"
    />
  </section>
</template>

<style scoped>

</style>