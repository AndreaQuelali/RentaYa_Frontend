import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useMode } from '@/context/ModeContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { mode } = useMode();

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
