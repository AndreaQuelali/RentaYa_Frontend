import { Tabs, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationContext } from "@/context/NotificationContext";
import { useAuth } from "@/hooks/auth/use-auth";
import { storage } from "@/lib/storage";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { unreadCount, refreshUnreadCount } = useNotificationContext();
  const [storedUserRole, setStoredUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredUserRole = async () => {
      try {
        const storedUser = await storage.getUser();
        if (storedUser && (storedUser as any).role) {
          setStoredUserRole((storedUser as any).role);
        }
      } catch (error) {
        console.error("Error loading stored user role:", error);
      }
    };
    loadStoredUserRole();
  }, []);

  const userRole = user?.role || storedUserRole;
  const isArrendador = userRole === "arrendador";

  // Actualizar contador cuando se enfoca cualquier tab
  useFocusEffect(
    useCallback(() => {
      if (user) {
        refreshUnreadCount();
      }
    }, [user, refreshUnreadCount])
  );

  const NotificationIconWithBadge = ({
    color,
    size,
  }: {
    color: string;
    size?: number;
  }) => (
    <View>
      <Ionicons name="notifications-outline" size={size ?? 24} color={color} />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center px-1">
          <Text className="text-white text-[10px] font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size ?? 24} color={color} />
          ),
          href: isArrendador ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size ?? 24} color={color} />
          ),
          href: isArrendador ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="properties"
        options={{
          title: "Propiedades",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size ?? 24} color={color} />
          ),
          href: !isArrendador ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reportes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size ?? 24} color={color} />
          ),
          href: !isArrendador ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="rentals"
        options={{
          title: "Mis alquileres",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size ?? 24} color={color} />
          ),
          href: isArrendador ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          title: "Mis solicitudes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full-outline" size={size ?? 24} color={color} />
          ),
          href: isArrendador ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="property-interests"
        options={{
          title: "Solicitudes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full-outline" size={size ?? 24} color={color} />
          ),
          href: !isArrendador ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          tabBarIcon: ({ color, size }) => (
            <NotificationIconWithBadge color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
