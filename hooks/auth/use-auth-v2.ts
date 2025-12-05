import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { Alert } from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "expo-router";

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

export function useAuthV2() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initCheckRef = useRef(false);
  const logoutInProgressRef = useRef(false);

  useEffect(() => {
    if (initCheckRef.current) return;
    initCheckRef.current = true;

    const initialize = async () => {
      try {
        // Primero verificar y limpiar storage corrupto
        await storage.checkAndClearCorruptedStorage();

        const isValid = await storage.validateSession();

        if (isValid) {
          const userData = await storage.getUser();
          if (userData) {
            setUser(userData as User);
          } else {
            setUser(null);
          }
        } else {
          await storage.clear();
          setUser(null);
        }
      } catch (error) {
        console.error("Error durante inicialización:", error);
        try {
          await storage.clear();
        } catch (clearError) {
          console.error("Error al limpiar storage:", clearError);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!user || isLoading) return;

    const checkSession = async () => {
      try {
        const isValid = await storage.validateSession();
        if (!isValid) {
          console.warn("Sesión invalidada detectada");
          try {
            await storage.clear();
          } catch (clearError) {
            console.error("Error al limpiar storage:", clearError);
          }
          setUser(null);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        try {
          await storage.clear();
        } catch (clearError) {
          console.error("Error al limpiar storage:", clearError);
        }
        setUser(null);
      }
    };

    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, [user, isLoading]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post("/api/auth/login", credentials);
      return response.data as BackendResponse;
    },
    onSuccess: async (response) => {
      const { accessToken, refreshToken, user: userData } = response.data;

      await storage.setToken(accessToken);
      if (refreshToken) {
        await storage.setRefreshToken(refreshToken);
      }
      await storage.setUser(userData);

      setUser(userData);
      queryClient.setQueryData(["auth", "user"], userData);
      try {
        // Usar setTimeout para evitar problemas de navegación durante el render
        setTimeout(() => {
          if (userData?.role === "arrendador") {
            router.replace("/(tabs)/properties");
          } else {
            router.replace("/(tabs)");
          }
        }, 100);
      } catch (err) {
        console.warn("Router replace failed after login:", err);
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      let message = "Error al iniciar sesión";

      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }

      // Solo mostrar mensaje limpio, sin JSON
      Alert.alert("Error de inicio de sesión", message);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (payload: {
      token: string;
      role: "rentante" | "arrendador";
    }) => {
      const response = await api.post("/api/auth/google", {
        token: payload.token,
        role: payload.role,
      });
      return response.data as BackendResponse;
    },
    onSuccess: async (response) => {
      const { accessToken, refreshToken, user: userData } = response.data;

      await storage.setToken(accessToken);
      if (refreshToken) {
        await storage.setRefreshToken(refreshToken);
      }
      await storage.setUser(userData);

      setUser(userData);
      queryClient.setQueryData(["auth", "user"], userData);
      try {
        // Usar setTimeout para evitar problemas de navegación durante el render
        setTimeout(() => {
          if (userData?.role === "arrendador") {
            router.replace("/(tabs)/properties");
          } else {
            router.replace("/(tabs)");
          }
        }, 100);
      } catch (err) {
        console.warn("Router replace failed after google login:", err);
      }
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      let message = "Error al iniciar sesión con Google";

      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }

      // Solo mostrar mensaje limpio, sin JSON
      Alert.alert("Error de inicio de sesión", message);
    },
  });

  const logout = useCallback(async () => {
    if (logoutInProgressRef.current) return;
    logoutInProgressRef.current = true;

    try {
      await storage.clear();

      setUser(null);
      queryClient.clear();
      try {
        router.replace("/(auth)/signin-options");
      } catch (err) {
        console.warn("Router replace failed after logout:", err);
      }
    } catch (error) {
      console.error("Error en logout:", error);
      setUser(null);
    } finally {
      logoutInProgressRef.current = false;
    }
  }, [queryClient, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,

    loginMutation,
    googleLoginMutation,
    login: loginMutation,
    googleLogin: googleLoginMutation,

    logout,
  };
}
