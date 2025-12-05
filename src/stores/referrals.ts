import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api.ts";
import type { Facility, ReferralResponseData, TestType } from "../types";
import { useToast } from "primevue";
import type { AxiosError, AxiosResponse } from "axios";

export const useReferralStore = defineStore(
  "referrals",
  () => {
    const toast = useToast();

    const testTypes = ref<TestType[]>([]);
    const tests = ref<TestType[]>([]);
    const facilities = ref<Facility[]>([]);
    const practitionerReferrals = ref<ReferralResponseData | null>(null);
    const labTechReferrals = ref<ReferralResponseData | null>(null);

    const getAllTestTypes = async (facilityId: number) => {
      try {
        const response: AxiosResponse = await api.get(
          `/medics/facilities/${facilityId}/test-types`
        );
        testTypes.value = response.data;
      } catch (error) {
        console.error("Error fetching test types:", error);
      }
    };
    const getAllTestForTestTypes = async (testTypeId: number) => {
      try {
        const response: AxiosResponse = await api.get(
          `/medics/test-types/${testTypeId}/tests`
        );
        tests.value = response.data;
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    const getAllFacilities = async () => {
      try {
        const response: AxiosResponse = await api.get("/medics/facilities");
        facilities.value = response.data;
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    const getFacilityBranches = async (facilityId: number) => {
      try {
        const response: AxiosResponse = await api.get(
          `/medics/facilities/${facilityId}/branches`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching facility branches:", error);
        return [];
      }
    };

    const getPractitionerReferrals = async (
      page_number: number,
      page_size: number,
      search_query?: string
    ) => {
      try {
        let endpoint = `/medics/referrals/practitioner?page_number=${page_number}&page_size=${page_size}`;
        console.log("Received search_query:", search_query); // Debug log
        if (search_query) {
          endpoint += `&search_query=${encodeURIComponent(search_query)}`;
          console.log("Updated endpoint:", endpoint); // Debug log
        }
        const response: AxiosResponse = await api.get(endpoint);
        practitionerReferrals.value = response.data;
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    const addReferral = async (payload: {
      test_type_id?: number;
      tests: number[];
      branch_id: number;
      clinical_notes?: string;
      patient_full_name_or_id?: string;
      patient_id?: string;
    }) => {
      try {
        const response = await api.post<{ status: string }>(
          "/medics/referral",
          payload
        );
        if (response.status === "success") {
          toast.add({
            severity: "success",
            summary: "Referral Added",
            detail: "Your referral has been added successfully.",
            life: 3000,
          });
        }
      } catch (err) {
        const error = err as AxiosError<{ detail: string }>;
        console.error("Error adding referral:", error);
        toast.add({
          severity: "error",
          summary: "Referral Failed",
          detail:
            error?.response?.data?.detail ??
            "An error occurred while adding your referral. Please try again.",
          life: 3000,
        });
        throw error;
      }
    };

    const getLabTechReferrals = async (
      page_number: number,
      page_size: number,
      sort_by?: string,
      sort_type?: string,
      search_query?: string
    ) => {
      try {
        let endpoint = `/medics/referrals/technician?page_number=${page_number}&page_size=${page_size}`;
        if (sort_by && sort_type) {
          endpoint += `&sort_by=${sort_by}&sort_type=${sort_type}`;
        }
        if (search_query && search_query.trim()) {
          endpoint += `&search_query=${encodeURIComponent(search_query)}`;
        }
        const response: AxiosResponse = await api.get(endpoint);
        console.log();
        labTechReferrals.value = response.data;
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    const updateReferralStatus = async (id: string, status: string) => {
      try {
        await api.put(`/medics/referral/${id}`, { status });
        toast.add({
          severity: "success",
          summary: "Referral Updated",
          detail: "Your referral has been updated successfully.",
          life: 3000,
        });
      } catch (err) {
        const error = err as AxiosError<{ detail: string }>;
        console.error("Error fetching referrals:", error);
        toast.add({
          severity: "error",
          summary: "Referral Failed",
          detail:
            error?.response?.data?.detail ??
            "An error occurred while updating your referral. Please try again.",
          life: 3000,
        });
        throw error;
      }
    };

    const updateTestStatus = async (id: number, status: string) => {
      try {
        await api.put(`/medics/referral-tests/${id}/status`, { status });
        toast.add({
          severity: "success",
          summary: "Test Updated",
          detail: "The test status has been updated successfully.",
          life: 3000,
        });
      } catch (err) {
        const error = err as AxiosError<{ detail: string }>;
        console.error("Error updating test status:", error);
        toast.add({
          severity: "error",
          summary: "Update Failed",
          detail:
            error?.response?.data?.detail ??
            "An error occurred while updating the test status. Please try again.",
          life: 3000,
        });
        throw error;
      }
    };

    const addNewLabTechnician = async (payload: {
      full_name: string;
      phone_number: string;
      branch_id: number;
      password: string;
    }) => {
      try {
        const response = await api.post<{ status: string }>(
          "/medics/lab-technicians/add",
          payload
        );
        if (response.status === "success") {
          toast.add({
            severity: "success",
            summary: "Lab Technician Added",
            detail: "The lab technician has been added successfully.",
            life: 3000,
          });
        }
      } catch (err) {
        const error = err as AxiosError<{ detail: string }>;
        console.error("Error adding lab technician:", error);
        toast.add({
          severity: "error",
          summary: "Addition Failed",
          detail:
            error?.response?.data?.detail ??
            "An error occurred while adding the lab technician. Please try again.",
          life: 3000,
        });
        throw error;
      }
    };

    const addFacilityBranch = async (
      payload: { name: string }
    ) => {
      try {
        const response = await api.post<{ status: string }>(`/medics/branches/add`, payload);
        if (response.status === "success") {
          toast.add({
            severity: "success",
            summary: "Branch Added",
            detail: "The branch has been added successfully.",
            life: 3000,
          });
        }
      } catch (err) {
        const error = err as AxiosError<{ detail: string }>;
        console.error("Error adding branch:", error);
        toast.add({
          severity: "error",
          summary: "Addition Failed",
          detail:
            error?.response?.data?.detail ??
            "An error occurred while adding the branch. Please try again.",
          life: 3000,
        });
        throw error;
      }
    };

    return {
      testTypes,
      tests,
      facilities,
      practitionerReferrals,
      labTechReferrals,
      getLabTechReferrals,
      updateReferralStatus,
      updateTestStatus,
      addReferral,
      getAllTestTypes,
      getAllFacilities,
      getPractitionerReferrals,
      getAllTestForTestTypes,
      getFacilityBranches,
      addNewLabTechnician,
      addFacilityBranch
    };
  },
  {
    persist: {
      storage: localStorage,
      pick: [
        "testTypes",
        "facilities",
        "practitionerReferrals",
        "labTechReferrals",
        "tests",
      ],
    },
  }
);
