<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import {useAuthStore} from "../stores/auth.ts"
import {useReferralStore} from "../stores/referrals.ts"
import AddUserModal from "../components/AddUserModal.vue"
import AddBranchModal from "../components/AddBranchModal.vue"
import { useToast } from "primevue";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const referralStore = useReferralStore()

const sidebarVisible = ref(false)
const showAddUserModal = ref(false)
const showAddBranchModal = ref(false)

const user = computed(() => authStore.user)
const toast = useToast();

onMounted(() => {
})

const facilityLabel = computed(() => user.value?.facilities?.[0]?.name || '')

const showAdminActions = computed(() => {
  return route.path === '/dashboard/labs' && user.value?.is_admin === true
})

const menuItems = computed(() =>{
  if(user.value?.user_type?.toLowerCase()?.includes("practitioner")) {
    return [
      { label: 'Referrals', icon: 'pi pi-address-book', route: '/dashboard/referrals' },
    ]
  } else if(user.value?.user_type?.toLowerCase()?.includes("technician")) {
    return [
      { label: 'Lab dashboard', icon: 'pi pi-home', route: '/dashboard/labs' },
    ]
  }
  return []
})

const handleLogout = () => {
  authStore.logout()
}

const goToPage = (route: string) => {
  router.push(route)
}

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const handleAddUser = () => {
  showAddUserModal.value = true
  sidebarVisible.value = false
}

const handleAddBranch = () => {
  showAddBranchModal.value = true
  sidebarVisible.value = false
}

const handleUserSubmit = async (data: any) => {
  try {
    if (typeof referralStore.addNewLabTechnician !== 'function') {
      const api = (await import('../services/api')).default
      const response: any = await api.post('/medics/lab-technicians/add', {
        full_name: data.full_name,
        phone_number: data.phone_number,
        branch_id: Number(data.branch_id),
        password: data.password
      })
      if (response.status === 'success') {
        toast.add({
            severity: "success",
            summary: "Lab Technician Added",
            detail: "The lab technician has been added successfully.",
            life: 3000,
          });
        showAddUserModal.value = false
      }
    } else {
      await referralStore.addNewLabTechnician({
        full_name: data.full_name,
        phone_number: data.phone_number,
        branch_id: Number(data.branch_id),
        password: data.password
      })
      showAddUserModal.value = false
    }
  } catch (error) {
    console.error('Error adding user:', error)
    
  }
}

const handleBranchSubmit = async (data: any) => {
  try {
    if (typeof referralStore.addFacilityBranch !== 'function') {
      const api = (await import('../services/api')).default
      const response: any = await api.post('/medics/branches/add', {
        name: data.name,
      })
      if (response.status === 'success') {
        toast.add({
            severity: "success",
            summary: "Branch Added",
            detail: "The branch has been added successfully.",
            life: 3000,
          });
        showAddBranchModal.value = false
      }
    } else {
      await referralStore.addFacilityBranch({
        name: data.name,
      })
      showAddBranchModal.value = false
    }
  } catch (error) {
    console.error('Error adding branch:', error)
  }
}

</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <Button
            icon="pi pi-bars"
            severity="secondary"
            text
            @click="toggleSidebar"
            class="md:hidden"
          />
          <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden sm:block text-right">
            <p class="text-sm font-semibold text-gray-800">{{ user?.full_name }}</p>
            <p class="text-xs text-gray-500">{{ facilityLabel }}</p>
          </div>
          <Avatar
            :label="user?.full_name?.charAt(0) || 'U'"
            class="bg-blue-300 text-white"
            shape="circle"
          />
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar for desktop -->
      <aside
        :class="[
          'hidden md:flex md:flex-col bg-white border-r border-gray-200 transition-all duration-300',
          sidebarVisible ? 'md:w-64' : 'md:w-0 md:overflow-hidden'
        ]"
      >
        <nav class="flex-1 p-4 space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.label"
            class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
            @click="goToPage(item.route)"
          >
            <i :class="item.icon"></i>
            <span class="font-medium">{{ item.label }}</span>
          </button>

          <!-- Divider -->
          <div v-if="showAdminActions" class="border-t border-gray-200 my-3"></div>

          <!-- Admin Actions -->
          <button
            v-if="showAdminActions"
            class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors cursor-pointer"
            @click="handleAddUser"
          >
            <i class="pi pi-user-plus"></i>
            <span class="font-medium">Add User</span>
          </button>

          <button
            v-if="showAdminActions"
            class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors cursor-pointer"
            @click="handleAddBranch"
          >
            <i class="pi pi-building"></i>
            <span class="font-medium">Add Branch</span>
          </button>
        </nav>

        <div class="p-4 border-t border-gray-200">
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            severity="danger"
            text
            class="w-full"
            @click="handleLogout"
          />
        </div>
      </aside>

      <!-- Mobile Drawer -->
      <Drawer v-model:visible="sidebarVisible" class="md:hidden">
        <template #header>
          <div class="flex items-center gap-3">
            <Avatar
              :label="user?.full_name?.charAt(0) || 'U'"
              class="bg-blue-500 text-white"
              shape="circle"
            />
            <div>
              <p class="font-semibold text-gray-800">{{ user?.full_name }}</p>
              <p class="text-xs text-gray-500">{{ facilityLabel }}</p>
            </div>
          </div>
        </template>

        <nav class="space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.label"
            class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
            @click="goToPage(item.route)"
          >
            <i :class="item.icon"></i>
            <span class="font-medium">{{ item.label }}</span>
          </button>

          <!-- Divider -->
          <div v-if="showAdminActions" class="border-t border-gray-200 my-3"></div>

          <!-- Admin Actions -->
          <button
            v-if="showAdminActions"
            class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors cursor-pointer"
            @click="handleAddUser"
          >
            <i class="pi pi-user-plus"></i>
            <span class="font-medium">Add User</span>
          </button>

          <button
            v-if="showAdminActions"
            class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors cursor-pointer"
            @click="handleAddBranch"
          >
            <i class="pi pi-building"></i>
            <span class="font-medium">Add Branch</span>
          </button>
        </nav>

        <template #footer>
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            severity="danger"
            text
            class="w-full"
            @click="handleLogout"
          />
        </template>
      </Drawer>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <router-view></router-view>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <AddUserModal
      :visible="showAddUserModal"
      @update:visible="showAddUserModal = $event"
      @submit="handleUserSubmit"
    />

    <AddBranchModal
      :visible="showAddBranchModal"
      @update:visible="showAddBranchModal = $event"
      @submit="handleBranchSubmit"
    />
  </div>
</template>

<style scoped>
</style>
