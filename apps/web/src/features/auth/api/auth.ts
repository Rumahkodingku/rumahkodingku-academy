"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { httpClient } from "@/lib/api/client";
import type { ApiSuccess } from "@/lib/api/types";

import { authKeys } from "./session";
import type { AuthUser, LoginInput, ProfilePatch, RegisterInput } from "../types";

type AuthResponse = ApiSuccess<{ user: AuthUser }>;

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await httpClient.post<AuthResponse>("/auth/login", input);
      return response.data.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.session, user);
      void queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const response = await httpClient.post<AuthResponse>("/auth/register", input);
      return response.data.data.user;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await httpClient.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(authKeys.session, null);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: { email: string }) => {
      await httpClient.post("/auth/forgot-password", input);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (input: { token: string; password: string }) => {
      await httpClient.post("/auth/reset-password", input);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (input: { token: string }) => {
      const response = await httpClient.post<ApiSuccess<{ email: string }>>(
        "/auth/verify-email",
        input,
      );
      return response.data.data;
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (input: { email: string }) => {
      await httpClient.post("/auth/resend-verification", input);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProfilePatch) => {
      const response = await httpClient.patch<AuthResponse>("/users/me", input);
      return response.data.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.session, user);
    },
  });
}

let refreshPromise: Promise<AuthUser> | null = null;

export function refreshSession(): Promise<AuthUser> {
  refreshPromise ??= httpClient
    .post<AuthResponse>("/auth/refresh")
    .then((response) => response.data.data.user)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
