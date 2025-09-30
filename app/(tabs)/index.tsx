import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 mt-14  px-4 py-6">
      <ThemedView className="items-center mb-8">
        <ThemedText className="text-3xl font-bold text-primary mb-2">Rentaya</ThemedText>
        <ThemedText className="text-base text-gray-500">¡Bienvenido! Encuentra y renta lo que necesitas.</ThemedText>
      </ThemedView>

      <ThemedView className="rounded-xl shadow p-4 mb-6">
        <ThemedText className="text-xl font-semibold text-primary mb-2">¿Qué buscas hoy?</ThemedText>
        <ThemedText className="text-gray-100 mb-4">Explora categorías y encuentra productos o servicios para rentar cerca de ti.</ThemedText>
        <TouchableOpacity className="bg-primary rounded-lg py-2 px-4 self-start">
          <Link href="/modal" asChild>
            <ThemedText className="font-bold">Explorar</ThemedText>
          </Link>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView className="rounded-xl shadow p-4 mb-6">
        <ThemedText className="text-lg font-semibold text-primary mb-2">¿Tienes algo para rentar?</ThemedText>
        <ThemedText className="text-gray-100 mb-4">Publica tu producto o servicio y genera ingresos extra.</ThemedText>
        <TouchableOpacity className="bg-secondary rounded-lg py-2 px-4 self-start">
          <Link href="/settings" asChild>
            <ThemedText className="font-bold">Publicar</ThemedText>
          </Link>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView className="items-center mt-8">
        <ThemedText className="text-xs">Powered by Rentaya</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}
