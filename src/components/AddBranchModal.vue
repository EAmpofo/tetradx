<script setup lang="ts">
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  submit: [data: any];
}>();

const branchName = ref("");
const location = ref("");

const resetForm = () => {
  branchName.value = "";
  location.value = "";
};

const handleSubmit = () => {
  const branchData = {
    name: branchName.value,
  };

  emit("submit", branchData);
  resetForm();
  emit("update:visible", false);
};

const handleClose = () => {
  resetForm();
  emit("update:visible", false);
};

watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Add New Branch"
    :style="{ width: '90vw', maxWidth: '500px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
      <div class="flex flex-col gap-2">
        <label for="branchName" class="font-semibold text-gray-700"
          >Branch Name</label
        >
        <InputText
          id="branchName"
          v-model="branchName"
          placeholder="Enter branch name"
          required
          class="w-full"
        />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="handleClose"
        />
        <Button type="submit" label="Add Branch" severity="success" />
      </div>
    </form>
  </Dialog>
</template>
