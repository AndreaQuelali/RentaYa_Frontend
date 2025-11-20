import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useMode } from '@/context/ModeContext';
import { useNotificationContext } from '@/context/NotificationContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { mode } = useMode();
  const { unreadCount } = useNotificationContext();

  const NotificationIconWithBadge = ({ color, size }: { color: string; size?: number }) => (
    <View>
      <Ionicons name="notifications-outline" size={size ?? 24} color={color} />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center px-1">
          <Text className="text-white text-[10px] font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size ?? 24} color={color} />,
          href: mode === 'owner' ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size ?? 24} color={color} />,
          href: mode === 'owner' ? null : undefined,
        }}
      />
    
      <Tabs.Screen
        name="properties"
        options={{
          title: 'Propiedades',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size ?? 24} color={color} />,
          href: mode === 'user' ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size ?? 24} color={color} />,
          href: mode === 'user' ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="rentals"
        options={{
          title: 'Mis alquileres',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size ?? 24} color={color} />,
          href: mode === 'owner' ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, size }) => <NotificationIconWithBadge color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
