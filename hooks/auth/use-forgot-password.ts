import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Alert } from "react-native";

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export function useForgotPassword() {
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post("/api/auth/forgot-password", { email });
      return response.data as {
        success: boolean;
        data: ForgotPasswordResponse;
        message: string;
      };
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Error al solicitar reset de contraseña";
      Alert.alert("Error", message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: {
      code: string;
      newPassword: string;
    }) => {
      const response = await api.post("/api/auth/reset-password", payload);
      return response.data as {
        success: boolean;
        data: ResetPasswordResponse;
        message: string;
      };
    },
    onSuccess: (data) => {
      Alert.alert("Éxito", data.data.message);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Error al restablecer contraseña";
      Alert.alert("Error", message);
    },
  });

  return {
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
  };
}
