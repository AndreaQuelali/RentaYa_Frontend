import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import type { RegisterFormData } from "@/lib/validation/authSchema";

export type RegisterResponse = {
  data: {
    user: {
      id: string;
      email: string;
      fullName: string;
      phone: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
};

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, Error, RegisterFormData>({
    mutationFn: async (payload: RegisterFormData) => {
      const response = await api.post("/api/auth/register", payload);
      return response.data;
    },
    onSuccess: async (response) => {
      // Guardar los tokens y el usuario
      const { accessToken, refreshToken, user } = response.data;
      if (accessToken) {
        await storage.setToken(accessToken);
      }
      if (refreshToken) {
        await storage.setRefreshToken(refreshToken);
      }
      if (user) {
        await storage.setUser(user);
        queryClient.setQueryData(["auth", "user"], user);
      }

      // Si es rentante, ir a preferencias. Si es arrendador, ir directamente a tabs
      if (user?.role === "rentante") {
        Alert.alert(
          "Éxito",
          "Registro exitoso. Ahora personaliza tu experiencia.",
          [
            {
              text: "Continuar",
              onPress: () => router.replace("/(auth)/preferences"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Éxito",
          "Registro exitoso. ¡Bienvenido a RentaYa!",
          [
            {
              text: "Continuar",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error en el registro";
      Alert.alert("Error", message);
    },
  });
}
