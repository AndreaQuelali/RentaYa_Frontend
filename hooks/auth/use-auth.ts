import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { Alert } from "react-native";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
  statusVerification?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type BackendResponse = {
  success: boolean;
  data: AuthResponse;
  message: string;
  timestamp: string;
};

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const token = await storage.getToken();
        if (!token) {
          return null;
        }

        const storedUser = await storage.getUser();

        try {
          const response = await api.get("/api/auth/refresh-token");
          const userData = response.data.success
            ? response.data.data.user
            : response.data.user;

          if (userData) {
            await storage.setUser(userData);
          }

          return userData;
        } catch (error) {
          if (storedUser) {
            return storedUser as User;
          }

          await storage.clear();
          return null;
        }
      } catch (error) {
        console.error("Error in auth query:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await api.post("/api/auth/login", payload);
      return response.data as BackendResponse;
    },
    onSuccess: async (backendResponse) => {
      const { data: authData } = backendResponse;

      await storage.setToken(authData.accessToken);
      await storage.setRefreshToken(authData.refreshToken);
      await storage.setUser(authData.user);

      queryClient.setQueryData(["auth", "user"], authData.user);

      Alert.alert("Éxito", backendResponse.message, [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)");
          },
        },
      ]);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      Alert.alert("Error", message);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (googleToken: string) => {
      const response = await api.post("/api/auth/google", {
        token: googleToken,
      });
      return response.data as BackendResponse;
    },
    onSuccess: async (backendResponse) => {
      const { data: authData } = backendResponse;

      await storage.setToken(authData.accessToken);
      await storage.setRefreshToken(authData.refreshToken);
      await storage.setUser(authData.user);

      queryClient.setQueryData(["auth", "user"], authData.user);

      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al iniciar sesión con Google";
      Alert.alert("Error", message);
    },
  });

  const logout = async () => {
    try {
      try {
        await api.post("/api/auth/logout");
      } catch (error) {}

      await storage.clear();

      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();

      setTimeout(() => {
        router.replace("/");
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
      router.replace("/");
    }
  };

  const refreshAuth = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    } catch (error) {
      console.error("Error refreshing auth:", error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation,
    googleLogin: googleLoginMutation,
    logout,
    refreshAuth,
  };
}
