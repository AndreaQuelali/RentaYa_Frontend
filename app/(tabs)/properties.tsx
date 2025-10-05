import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NewPropertyForm from '@/components/NewPropertyForm';

export default function PropertiesScreen() {
  const [showForm, setShowForm] = useState(false);
  // Form state (simple)
  const [type, setType] = useState<string>('');
  const [mode, setMode] = useState<string>('');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const typeOptions = ['Casa', 'Departamento', 'Oficina', 'Terreno'];
  const modeOptions = ['Alquiler', 'Venta', 'Anticrético'];

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header rojo */}
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        {showForm ? (
          <Pressable onPress={() => setShowForm(false)} className="pr-2">
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
        ) : (
          <Ionicons name="home-outline" size={20} color="#fff" />
        )}
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      {showForm ? (
        <NewPropertyForm />
      ) : (
        <View className="p-4">
          <Text className="text-xl font-semibold mb-2">Mis propiedades</Text>
          <View className="mt-2 items-center">
            <Text className="text-gray-500 text-center mb-4">Aún no tienes propiedades publicadas.\n¡Empieza ahora y publica tu primera propiedad!</Text>
            <Pressable className="bg-black rounded-xl py-3 px-5" onPress={() => setShowForm(true)}>
              <Text className="text-white font-semibold">Publicar propiedad</Text>
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
