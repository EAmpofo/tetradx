<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Card from "primevue/card";
import { useAuthStore } from "../stores/auth.ts";
import backgroundImage from "../assets/bg.jpg";

const router = useRouter();
const authStore = useAuthStore();

const phoneNumber = ref("");
const password = ref("");
const isError = ref(false);
const loading = ref(false);

const handleLogin = async () => {
  try {
    if (!phoneNumber.value) {
      isError.value = true;
      return;
    }
    loading.value = true;

    await authStore.login({
      phone_number: phoneNumber.value,
      password: password.value,
    });
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<template>
  <div
    class="medical-background min-h-screen flex items-center justify-center p-4"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <Card class="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/95">
      <template #title>
        <div class="text-center text-2xl font-bold text-gray-800">
          Welcome Back
        </div>
      </template>
      <template #subtitle>
        <div class="text-center text-gray-600">
          Please login to your account
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="flex flex-col gap-2">
            <label for="phone" class="font-semibold text-gray-700"
              >Phone Number</label
            >
            <InputText
              id="phone"
              v-model="phoneNumber"
              placeholder="Enter your phone number"
              type="tel"
              class="w-full"
              required
              :invalid="isError"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-gray-700"
              >Password</label
            >
            <Password
              id="password"
              v-model="password"
              placeholder="Enter your password"
              :feedback="false"
              toggleMask
              class="w-full"
              required
              :invalid="isError"
              fluid
            />
          </div>

          <Button
            type="submit"
            label="Login"
            class="w-full"
            size="large"
            :loading="loading"
          />
        </form>

        <div class="text-center mt-4">
          <span class="text-gray-600">Don't have an account? </span>
          <button
            @click="goToRegister"
            class="text-blue-400 hover:text-blue-800 font-semibold cursor-pointer"
          >
            Register
          </button>
        </div>

        <div class="mt-10 flex items-center justify-center">
          <a 
            href="https://drive.google.com/file/d/1vfD1lTaOFkP6tKC7dn8w5K4onf3A4R8T/view" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-blue-400 hover:text-blue-800 font-semibold flex items-center gap-2"
          >
            <i class="pi pi-play-circle"></i>
            Take a tour
          </a>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.medical-background {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

/* Dark overlay for better text readability */
.medical-background::before {
  content: "";
  position: absolute;
  inset: 0;
  /* background: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%); */
  z-index: 0;
}

/* Animated pattern overlay */
.medical-background::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 35px,
      rgba(255, 255, 255, 0.03) 35px,
      rgba(255, 255, 255, 0.03) 70px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 35px,
      rgba(255, 255, 255, 0.03) 35px,
      rgba(255, 255, 255, 0.03) 70px
    );
  animation: float 20s ease-in-out infinite;
  z-index: 1;
}

@keyframes float {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

/* Ensure card is above overlays */
:deep(.p-card) {
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
