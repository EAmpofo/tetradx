<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Card from 'primevue/card'

const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleChangePassword = async () => {
  errorMessage.value = ''
  
  // Validation
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'All fields are required'
    return
  }
  
  if (newPassword.value.length < 6) {
    errorMessage.value = 'New password must be at least 6 characters'
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'New passwords do not match'
    return
  }
  
  try {
    loading.value = true
    await authStore.changePassword({
      current_password: currentPassword.value,
      new_password: newPassword.value,
      confirm_new_password: confirmPassword.value
    })
  } catch (error) {
    console.error('Password change failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="p-6 rounded-t-lg border-b border-gray-200 bg-white">
          <h2 class="text-2xl font-bold mb-2">Change Password Required</h2>
          <p class=" text-sm">
            As a new user, you must change your password before continuing.
          </p>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ errorMessage }}</p>
          </div>
          
          <div class="flex flex-col gap-2">
            <label for="currentPassword" class="font-semibold text-gray-700">
              Current Password
            </label>
            <Password
              id="currentPassword"
              v-model="currentPassword"
              placeholder="Enter current password"
              :feedback="false"
              toggleMask
              required
              fluid
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="newPassword" class="font-semibold text-gray-700">
              New Password
            </label>
            <Password
              id="newPassword"
              v-model="newPassword"
              placeholder="Enter new password"
              toggleMask
              required
              fluid
              :weakLabel="'Weak'"
              :mediumLabel="'Medium'"
              :strongLabel="'Strong'"
            />
            <small class="text-gray-500">Must be at least 6 characters</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-semibold text-gray-700">
              Confirm New Password
            </label>
            <Password
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Confirm new password"
              :feedback="false"
              toggleMask
              required
              fluid
            />
          </div>

          <Button
            type="submit"
            label="Change Password"
            class="w-full mt-6"
            size="large"
            :loading="loading"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
:deep(.p-card) {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.p-card-body) {
  padding: 2rem;
}
</style>
