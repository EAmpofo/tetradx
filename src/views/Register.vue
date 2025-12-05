<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Select from "primevue/select";
import Button from "primevue/button";
import Card from "primevue/card";
import { useAuthStore } from "../stores/auth.ts";
import { useReferralStore } from "../stores/referrals.ts";
import backgroundImage from "../assets/bg.jpg";

const userTypes = [
  { label: "Medical Practitioner", value: "Medical Practitioner" },
  // { label: "Laboratory", value: "Lab Technician" },
];

const router = useRouter();
const authStore = useAuthStore();
const referralStore = useReferralStore();

const fullname = ref("");
const phoneNumber = ref("");
const password = ref("");
const confirmPassword = ref("");
const facility = ref<number | null>(null);
const userTypeValue = ref("");
const errors = ref<string[]>([]);
const loading = ref(false);
const passwordError = ref("");

const handleRegister = async () => {
  try {
    // Clear previous errors
    errors.value = [];
    passwordError.value = "";

    // Validation
    if (!fullname.value) {
      errors.value.push("fullname");
    }
    if (!phoneNumber.value) {
      errors.value.push("phone");
    }
    if (!password.value) {
      errors.value.push("password");
      passwordError.value = "Password is required";
    } else if (password.value.length < 6) {
      errors.value.push("password");
      passwordError.value = "Password must be at least 6 characters";
    }
    if (!confirmPassword.value) {
      errors.value.push("confirmPassword");
    } else if (password.value !== confirmPassword.value) {
      errors.value.push("confirmPassword");
      passwordError.value = "Passwords do not match";
    }
    if (userTypeValue.value === "Lab Technician" && !facility.value) {
      errors.value.push("facility");
    }

    if (errors.value.length > 0) {
      return;
    }

    loading.value = true;

    const payload = {
      full_name: fullname.value,
      phone_number: phoneNumber.value,
      password: password.value,
      confirm_password: confirmPassword.value,
      user_type: userTypeValue.value,
      ...(userTypeValue.value === "Lab Technician" && { facility_id: facility.value as number }),
    };

    await authStore.register(payload);
  } catch (error) {
    console.error("Registration failed:", error);
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
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
          Create Account
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="space-y-3">
          <div class="flex flex-col gap-2">
            <label for="fullname" class="font-semibold text-gray-700"
              >Full Name</label
            >
            <InputText
              id="fullname"
              v-model="fullname"
              placeholder="Enter your full name"
              class="w-full"
              required
              :invalid="errors.includes('fullname')"
            />
          </div>

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
              :invalid="errors.includes('phone')"
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
              toggleMask
              :feedback="true"
              class="w-full"
              :inputClass="'w-full'"
              required
              :invalid="errors.includes('password')"
            />
            <small v-if="errors.includes('password')" class="text-red-500">
              {{ passwordError }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-semibold text-gray-700"
              >Confirm Password</label
            >
            <Password
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Confirm your password"
              toggleMask
              :feedback="false"
              class="w-full"
              :inputClass="'w-full'"
              required
              :invalid="errors.includes('confirmPassword')"
            />
            <small v-if="errors.includes('confirmPassword') && passwordError === 'Passwords do not match'" class="text-red-500">
              Passwords do not match
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="userType" class="font-semibold text-gray-700"
              >User Type</label
            >
            <Select
              id="userType"
              v-model="userTypeValue"
              :options="userTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Select your user type"
              class="w-full"
              required
              :invalid="errors.includes('userType')"
            />
          </div>
          <div
            class="flex flex-col gap-2"
            v-if="userTypeValue === 'Lab Technician'"
          >
            <label for="facility" class="font-semibold text-gray-700"
              >Facility</label
            >
            <Select
              id="facility"
              v-model="facility"
              :options="referralStore.facilities"
              optionLabel="name"
              optionValue="id"
              placeholder="Select your facility"
              class="w-full"
              required
              :invalid="errors.includes('facility')"
            />
          </div>

          <Button
            type="submit"
            label="Register"
            class="w-full"
            size="large"
            :loading="loading"
          />
        </form>

        <div class="text-center mt-4">
          <span class="text-gray-600">Already have an account? </span>
          <button
            @click="goToLogin"
            class="text-blue-400 hover:text-blue-800 font-semibold cursor-pointer"
          >
            Login
          </button>
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
  content: '';
  position: absolute;
  inset: 0;
  /* background: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%); */
  z-index: 0;
}

/* Animated pattern overlay */
.medical-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
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
  0%, 100% {
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

