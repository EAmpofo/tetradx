<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useAuthStore } from '../stores/auth'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: any]
}>()

const authStore = useAuthStore()

const fullName = ref('')
const phoneNumber = ref('')
const branch = ref('')
const password = ref('')

const branches = computed(() => authStore.user?.branches || [])



const resetForm = () => {
  fullName.value = ''
  phoneNumber.value = ''
  branch.value = ''
  password.value = ''
}

const generatePassword = () => {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let generatedPassword = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    generatedPassword += charset[randomIndex]
  }
  password.value = generatedPassword
}

const handleSubmit = () => {
  const userData = {
    full_name: fullName.value,
    phone_number: phoneNumber.value,
    branch_id: branch.value,
    password: password.value
  }
  
  emit('submit', userData)
  resetForm()
  emit('update:visible', false)
}

const handleClose = () => {
  resetForm()
  emit('update:visible', false)
}

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Add New User"
    :style="{ width: '90vw', maxWidth: '500px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
      <div class="flex flex-col gap-2">
        <label for="fullName" class="font-semibold text-gray-700">Full Name</label>
        <InputText
          id="fullName"
          v-model="fullName"
          placeholder="Enter full name"
          required
          class="w-full"
        />
      </div>


      <div class="flex flex-col gap-2">
        <label for="phone" class="font-semibold text-gray-700">Phone Number</label>
        <InputText
          id="phone"
          v-model="phoneNumber"
          type="tel"
          placeholder="Enter phone number"
          required
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="branch" class="font-semibold text-gray-700">Branch</label>
        <Select
          id="branch"
          v-model="branch"
          :options="branches"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a branch"
          required
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-semibold text-gray-700">Password</label>
        <div class="flex gap-2">
          <InputText
            id="password"
            v-model="password"
            type="text"
            placeholder="Enter password"
            required
            class="w-full"
          />
          <Button
            type="button"
            label="Generate"
            severity="secondary"
            @click="generatePassword"
            v-tooltip.top="'Generate Password'"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="handleClose"
        />
        <Button
          type="submit"
          label="Add User"
          severity="success"
        />
      </div>
    </form>
  </Dialog>
</template>
