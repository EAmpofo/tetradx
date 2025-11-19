<script setup lang="ts">
import Toast from 'primevue/toast';
import {onMounted} from "vue";
import {useReferralStore} from "./stores/referrals.ts";


const referralStore = useReferralStore()

onMounted(() => {
  referralStore.getAllFacilities();
})
</script>

<template>
  <Toast position="top-center" />
  <router-view />
</template>

<style scoped>
</style>
