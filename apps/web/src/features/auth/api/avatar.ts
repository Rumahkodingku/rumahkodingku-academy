"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { httpClient } from "@/lib/api/client";
import type { ApiSuccess } from "@/lib/api/types";

import { authKeys } from "./session";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await httpClient.post<ApiSuccess<{ avatarUrl: string }>>(
        "/users/me/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await httpClient.delete("/users/me/avatar");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}
