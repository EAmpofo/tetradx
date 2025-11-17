<script setup lang="ts">
import { Dialog, Button, Checkbox } from 'primevue';
import type { Referral, Test } from '../types';
import { useReferralStore } from '../stores/referrals';
import { ref } from 'vue';

interface ReferralViewModalProps {
  visible: boolean;
  referral: Referral | null;
}

interface ReferralViewModalEmits {
  (e: 'update:visible', value: boolean): void;
  (e: 'testUpdated'): void;
}

const props = defineProps<ReferralViewModalProps>();
const emit = defineEmits<ReferralViewModalEmits>();

const referralStore = useReferralStore();
const updatingTests = ref<Set<number>>(new Set());

const handleClose = () => {
  emit('update:visible', false);
};

const handleTestStatusChange = async (test: Test, isCompleted: boolean) => {
  try {
    const testId = test.id || test.test_id;
    
    if (!testId) {
      console.error('Test ID is missing:', test);
      return;
    }
    
    updatingTests.value.add(testId);
    const newStatus = isCompleted ? 'Completed' : 'Pending';
    await referralStore.updateTestStatus(testId, newStatus);
    emit('testUpdated');
    setTimeout(() => {
      updatingTests.value.delete(testId);
      handleClose();
    }, 1000);
  } catch (error) {
    console.error('Error updating test status:', error);
  } finally {
    const testId = test.id || test.test_id;
    if (testId) {
      updatingTests.value.delete(testId);
    }
  }
};

const isTestCompleted = (test: Test) => {
  return test.status?.toLowerCase() === 'completed';
};

const isTestUpdating = (testId: number) => {
  return updatingTests.value.has(testId);
};

const getTestId = (test: Test) => {
  return test.id || test.test_id;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase();
  if (statusLower === 'pending') return 'bg-yellow-500';
  if (statusLower === 'completed') return 'bg-green-500';
  if (statusLower === 'received') return 'bg-blue-500';
  return 'bg-gray-500';
};
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    header="Referral Details"
    :style="{ width: '600px' }"
    @update:visible="handleClose"
  >
    <div v-if="props.referral" class="space-y-4 grid grid-cols-2">
      <!-- Referral ID -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Referral ID</label>
        <p class="text-gray-900">{{ props.referral.referral_id }}</p>
      </div>

      <!-- Patient Name/ID -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Patient Name/ID</label>
        <p class="text-gray-900">{{ props.referral.patient_name_or_id }}</p>
      </div>

      <!-- Patient Unique ID -->
<!--      <div class="flex flex-col gap-1">-->
<!--        <label class="font-semibold text-gray-700">Patient Unique ID</label>-->
<!--        <p class="text-gray-900">{{ props.referral.patient_unique_id }}</p>-->
<!--      </div>-->

      <!-- Test Type -->
      <div class="flex flex-col gap-1 col-span-2">
        <label class="font-semibold text-gray-700">Tests</label>
        <div class="space-y-2">
          <div 
            v-for="test in props.referral.tests" 
            :key="getTestId(test)" 
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="flex items-center gap-3 flex-1">
              <Checkbox
                :modelValue="isTestCompleted(test)"
                :binary="true"
                :disabled="isTestUpdating(getTestId(test))"
                @update:modelValue="handleTestStatusChange(test, $event)"
              />
              <span class="text-gray-900 font-medium">{{ test.test_name }}</span>
            </div>
            <span 
              :class="[
                'px-3 py-1 rounded-md text-white text-sm font-medium',
                getStatusColor(test.status)
              ]"
            >
              {{ test.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Facility -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Facility</label>
        <p class="text-gray-900">{{ props.referral.facility_name }}</p>
      </div>

      <!-- Clinical Notes -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Clinical Notes</label>
        <p class="text-gray-900 whitespace-pre-wrap">{{ props.referral.clinical_notes || 'No clinical notes provided' }}</p>
      </div>

      <!-- Referred At -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Referred At</label>
        <p class="text-gray-900">{{ formatDate(props.referral.referred_at) }}</p>
      </div>

      <!-- Status -->
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Status</label>
        <div>
          <span :class="['px-3 py-1 rounded-md text-white inline-block', getStatusColor(props.referral.status)]">
            {{ props.referral.status }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <Button
          label="Close"
          severity="secondary"
          @click="handleClose"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
</style>
