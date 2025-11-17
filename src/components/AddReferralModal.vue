<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Dialog, Button, Select, InputText, Textarea } from "primevue";
import { useReferralStore } from "../stores/referrals.ts";
import AppMultiSelect from "./AppMultiSelect.vue";

interface AddReferralModalProps {
  visible: boolean;
}

interface AddReferralModalEmits {
  (e: "update:visible", value: boolean): void;
  (e: "updateDone"): void;
}

interface ReferralFormData {
  facility_id: string | null;
  test_type_id: string | null;
  patient: string;
  clinical_notes?: string;
  test_ids: number[];
}

const props = defineProps<AddReferralModalProps>();
const emit = defineEmits<AddReferralModalEmits>();

const referralStore = useReferralStore();

const formData = ref<ReferralFormData>({
  facility_id: null,
  test_type_id: null,
  patient: "",
  clinical_notes: "",
  test_ids: [],
});
const loading = ref(false);

const isFormValid = computed(
  () =>
    formData.value.facility_id &&
    formData.value.test_type_id &&
    formData.value.patient.trim().length > 0 &&
    formData.value.test_ids.length > 0
);

const handleClose = () => {
  emit("update:visible", false);
};

const handleSubmit = async () => {
  // Basic validation
  if (!isFormValid.value) {
    return;
  }

  try {
    loading.value = true;
     const payload: {
        tests: number[];
        test_type_id?: number;
        facility_id: number;
        clinical_notes?: string;
        patient_full_name_or_id?: string;
        patient_id?: string;
      } = {
        facility_id: Number(formData.value.facility_id),
        tests: formData.value.test_ids,  
      };
      if (formData.value.clinical_notes) {
        payload.clinical_notes = formData.value.clinical_notes;
      }

      //check if patient value contains number
      if (formData.value.patient.match(/\d/)) {
        payload.patient_id = formData.value.patient;
      } else {
        payload.patient_full_name_or_id = formData.value.patient;
      }

      await  referralStore.addReferral(payload);

    formData.value.patient = "";
    formData.value.clinical_notes = "";
    formData.value.facility_id = null;
    formData.value.test_type_id = null;
    formData.value.test_ids = [];
    emit("updateDone");
    emit("update:visible", false);
  } catch (error) {
    console.error("Error adding referral:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => formData.value.facility_id,
  (newFacilityId) => {
    if (newFacilityId) {
      referralStore.getAllTestTypes(Number(newFacilityId));
    }
  }
);
watch(
  () => formData.value.test_type_id,
  (newTestTypeId) => {
    if (newTestTypeId) {
      referralStore.getAllTestForTestTypes(Number(newTestTypeId));
    }
  }
);

onMounted(() => {
  // referralStore.getAllTestTypes();
});
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    header="Add Referral"
    :style="{ width: '500px' }"
    @update:visible="handleClose"
  >
    <div class="space-y-3">
      <!-- Laboratory Select -->
      <div class="flex flex-col gap-2">
        <label for="laboratory" class="font-semibold text-gray-700"
          >Laboratory</label
        >
        <Select
          id="laboratory"
          v-model="formData.facility_id"
          :options="referralStore.facilities"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a laboratory"
          class="w-full"
        />
      </div>

      <!-- Test Type Select -->
      <div class="flex flex-col gap-2">
        <label for="testType" class="font-semibold text-gray-700"
          >Test Type</label
        >
        <Select
          id="testType"
          v-model="formData.test_type_id"
          :options="referralStore.testTypes"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a test type"
          class="w-full"
        />
      </div>

      <!-- Test Multi-Select -->
      <AppMultiSelect
        v-model="formData.test_ids"
        :options="referralStore.tests"
        label="Tests"
        placeholder="Select tests"
        optionLabel="name"
        optionValue="id"
        :show-chips="true"
        :disabled="!formData.test_type_id"
      />

      <!-- Patient Name Input -->
      <div class="flex flex-col gap-2">
        <label for="patientName" class="font-semibold text-gray-700"
          >Patient Name/ID</label
        >
        <InputText
          id="patientName"
          v-model.trim="formData.patient"
          placeholder="Enter patient name"
          class="w-full"
        />
      </div>

      <!-- Clinical Note Textarea -->
      <div class="flex flex-col gap-2">
        <label for="clinicalNote" class="font-semibold text-gray-700"
          >Clinical Notes (optional)</label
        >
        <Textarea
          id="clinicalNote"
          v-model="formData.clinical_notes"
          rows="4"
          placeholder="Enter clinical notes"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" @click="handleClose" />
        <Button
          label="Submit"
          severity="success"
          :disabled="!isFormValid"
          @click="handleSubmit"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
