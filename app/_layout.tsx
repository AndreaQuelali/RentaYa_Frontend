import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/context/AuthContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth/use-auth";
import { View, ActivityIndicator } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      const pathString = segments.join("/");

      if (!user) {
        if (
          pathString.startsWith("(tabs)") ||
          pathString.startsWith("settings") ||
          pathString.startsWith("property")
        ) {
          router.replace("/");
        }
      } else {
        if (
          pathString === "" ||
          pathString.startsWith("(auth)") ||
          pathString === "index"
        ) {
          router.replace("/(tabs)");
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D65E48" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="property/[id]"
        options={{
          headerShown: false,
          presentation: "card",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          headerShown: false,
          presentation: "card",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProfileProvider>
          <NotificationProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <RootLayoutNav />
              <StatusBar style="auto" />
            </ThemeProvider>
          </NotificationProvider>
        </UserProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
