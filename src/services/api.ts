import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookie from 'js-cookie';

// Define API configuration interface
interface ApiConfig {
    baseURL: string;
    timeout: number;
    headers?: Record<string, string>;
}

// Default API configuration
const defaultConfig: ApiConfig = {
    baseURL: 'http://16.170.166.38/api/',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

/**
 * ApiService class for handling API requests
 * Provides methods for making HTTP requests with error handling and retries
 */
class ApiService {
    private instance: AxiosInstance;
    private maxRetries: number = 3;
    private retryDelay: number = 1000; // 1 second

    constructor(config: ApiConfig = defaultConfig) {
        this.instance = axios.create(config);
        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors(): void {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                // Get token from auth store
                const token = Cookie.get('authToken');

                // If token exists, add it to the headers
                if (token && !config.url?.includes("auth")) {
                    config.headers = config.headers || {};
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };

                // If the request has no _retry property, initialize it
                if (originalRequest && !originalRequest._retry) {
                    originalRequest._retry = 0;
                }

                // Handle authentication errors (401)
                if (error.response?.status === 401) {

                    const refreshToken = Cookie.get('refreshToken');
                    if (refreshToken) {
                        try {
                            const response = await this.instance.post('/refresh', { refresh_token: refreshToken });
                            this.setAuthToken(response.data.access_token);
                            if(originalRequest.headers) {
                                originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
                            }
                            return this.instance(originalRequest);
                        } catch (refreshError) {
                            // Clear token and redirect to login
                            this.clearAuthToken();
                            return Promise.reject(refreshError);
                        }
                    }
                    // You might want to redirect to login page or refresh token here
                    return Promise.reject(error);
                }

                // Retry logic for network errors or 5xx server errors
                if (
                    originalRequest &&
                    originalRequest._retry !== undefined &&
                    originalRequest._retry < this.maxRetries &&
                    (
                        !error.response ||
                        (error.response.status >= 500 && error.response.status < 600)
                    )
                ) {
                    originalRequest._retry++;

                    // Wait before retrying (exponential backoff)
                    const delay = this.retryDelay * Math.pow(2, originalRequest._retry - 1);
                    await new Promise(resolve => setTimeout(resolve, delay));

                    // Retry the request
                    return this.instance(originalRequest);
                }

                return Promise.reject(error);
            }
        );
    }

    /**
     * Set the authentication token
     * @param token - The authentication token
     */
    public setAuthToken(token: string): void {
        Cookie.set('authToken', token);
    }

    /**
     * Clear the authentication token
     */
    public clearAuthToken(): void {
        Cookie.remove('authToken');
        Cookie.remove('refreshToken');
    }

    /**
     * Make a GET request
     * @param url - The URL to make the request to
     * @param params - The query parameters
     * @param config - Additional Axios config
     * @returns Promise with the response data
     */
    public async get<T, P extends Record<string, unknown> = Record<string, unknown>>(
        url: string,
        params?: P,
        config?: AxiosRequestConfig
    ): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.get(url, {
                ...config,
                params
            });
            return response.data;
        } catch (error) {
            this.handleError(error instanceof Error ? error : new Error('Unknown error'));
            throw error;
        }
    }

    /**
     * Make a POST request
     * @param url - The URL to make the request to
     * @param data - The data to send
     * @param config - Additional Axios config
     * @returns Promise with the response data
     */
    public async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.post(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error instanceof Error ? error : new Error('Unknown error'));
            throw error;
        }
    }

    /**
     * Make a PUT request
     * @param url - The URL to make the request to
     * @param data - The data to send
     * @param config - Additional Axios config
     * @returns Promise with the response data
     */
    public async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.put(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error instanceof Error ? error : new Error('Unknown error'));
            throw error;
        }
    }

    /**
     * Make a PATCH request
     * @param url - The URL to make the request to
     * @param data - The data to send
     * @param config - Additional Axios config
     * @returns Promise with the response data
     */
    public async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error instanceof Error ? error : new Error('Unknown error'));
            throw error;
        }
    }

    /**
     * Make a DELETE request
     * @param url - The URL to make the request to
     * @param config - Additional Axios config
     * @returns Promise with the response data
     */
    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.delete(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error instanceof Error ? error : new Error('Unknown error'));
            throw error;
        }
    }

    /**
     * Handle API errors
     * @param error - The error object
     */
    private handleError(error: Error): void {
        if (axios.isAxiosError(error)) {
            // Handle Axios specific errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response error:', error.response.status, error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Request error:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Axios error:', error.message);
            }
        } else {
            // Handle non-Axios errors
            console.error('Error:', error.message);
        }
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
