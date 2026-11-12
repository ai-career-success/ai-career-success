import axios from "axios";
import { api, setStoredToken } from "./client";

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
}

/**
 * Extract a user-friendly error message from an API error response.
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const data = error.response.data as ApiErrorResponse;
      if (typeof data.error === "string" && data.error.trim()) {
        return data.error;
      }
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }
    }
    if (error.response?.status === 401) {
      return "Invalid credentials";
    }
    if (error.response?.status === 400) {
      return "Invalid request. Please check your input.";
    }
    if (error.response?.status === 500) {
      return "Server error. Please try again later.";
    }
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "Request timed out. Please check your network connection.";
    }
    if (!error.response && error.request) {
      return "Unable to connect to the server. Please check your network connection.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Perform login request to the backend.
 * POST /api/auth/login
 * On success, stores the accessToken in local storage.
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", {
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  });

  if (data?.accessToken) {
    setStoredToken(data.accessToken);
  }

  return data;
}

/**
 * Register a new user.
 * POST /api/auth/register
 * Does NOT return an auth token — user must log in after registering.
 */
export async function registerUser(credentials: RegisterCredentials): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", {
    firstName: credentials.firstName.trim(),
    lastName: credentials.lastName.trim(),
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
    confirmPassword: credentials.confirmPassword,
  });
  return data;
}

