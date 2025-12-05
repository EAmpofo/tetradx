
export interface Facility {
    id: number;
    name: string;
    contact_number?: string | null;
}

export interface Branch {
    id: number;
    name: string;
    location?: string;
}

export interface TestType {
    id: number;
    name: string;
}

export interface Test {
    id?: number;
    test_id: number;
    test_name: string;
    test_type_name: string;
    status: string;
}

export interface SingleReferral {
    referral_id: string;
    facility: string;
    patient_name: string;
    patient_id: string;
    test_type: string;
    referring_doctor: string;
    referred_at: string;
    status: string;
}

export interface Referral {
    referral_id: string;
    patient_name_or_id: string;
    patient_unique_id: string;
    test_type_name: string;
    facility_name: string;
    clinical_notes: string;
    referred_at: string;
    tests: Test[];
    status: string;
}

export interface User {
    id: string,
    full_name: string,
    phone_number: string,
    user_type: string,
    date_joined: string,
    is_new_user: boolean,
    is_admin: boolean,
    facilities: Facility[],
    branches: Branch[]
}

export interface ReferralResponseData {
    data_summary: {
        total_referrals: number,
        total_completed: number,
        total_pending: number,
        total_received: number
    },
    referrals: Referral[],
    pagination: {
        total_pages: number,
        current_page: number,
        page_size: number,
        total_referrals: number,
        has_next: boolean,
        has_previous: boolean,
    }
}