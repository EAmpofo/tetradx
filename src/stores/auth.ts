import {defineStore} from "pinia";
import {ref} from "vue";
import api from "../services/api.ts";
import {useToast} from "primevue";
import type {AxiosError} from "axios";
import {useRouter} from "vue-router";
import Cookies from "js-cookie";
import type {User} from "../types";


export const useAuthStore = defineStore('auth', () => {
    const toast = useToast();
    const router = useRouter();
    const user = ref<User | null>(null);


    const register = async (payload: {full_name: string, phone_number: string, password: string, facility_id?: any, user_type: string}) => {
        try {
            const response = await api.post<{status: string}>("/auth/register", payload);
            if(response.status === "success") {
                toast.add({severity: "success", summary: "Registration Successful", detail: "You have successfully registered. Please login to continue.", life: 3000});
                await router.push('/login')
            }
        } catch (err) {
            const error = err as AxiosError<{detail: string}>;
            console.error("Error registering user:", error);
            toast.add({severity: "error", summary: "Registration Failed", detail: error.response?.data?.detail ?? "An error occurred while registering. Please try again.", life: 3000});
            throw error;
        }
    }

    const login = async (payload: {phone_number: string, password: string}) => {
        try {
            const response: {status: string, data: {access_token: string, refresh_token: string, user_data: User}} = await api.post("/auth/login", payload);
            console.log("Login response:", response);
            if(response.status === "success") {
                toast.add({severity: "success", summary: "Login Successful", detail: "You have successfully logged in.", life: 3000});
                Cookies.set('authToken', response.data?.access_token)
                Cookies.set('refreshToken', response?.data.refresh_token)
                user.value = response.data?.user_data;
                if(user.value?.user_type?.toLowerCase()?.includes("practitioner")) {
                    await router.push('/dashboard/referrals')
                } else if(user.value?.user_type?.toLowerCase()?.includes("technician")) {
                    await router.push('/dashboard/labs')
                }
            }
        } catch (err) {
            const error = err as AxiosError<{detail: string}>;
            console.error("Error logging in user:", error);
            toast.add({severity: "error", summary: "Login Failed", detail: error.response?.data?.detail ?? "An error occurred while logging in. Please try again.", life: 3000});
        }
    }

    const logout = async () => {
        Cookies.remove('authToken')
        Cookies.remove('refreshToken')
        user.value = null;
        await router.push('/login')
    }

    return {
        user,
        register,
        login,
        logout
    }
}, {
    persist: {
        storage: localStorage,
        pick: ["user"]
    }
});